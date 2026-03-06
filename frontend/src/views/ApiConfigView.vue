<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <p class="kicker">Public API Builder</p>
      <h1 class="page-title text-slate-900">API Config</h1>
      <p class="max-w-3xl text-sm text-slate-600">
        Generate customer-ready URLs for the questions API, then test and copy instantly.
      </p>
    </div>

    <div class="surface-panel grid gap-3 md:grid-cols-3">
      <label class="space-y-1 text-sm font-semibold text-slate-700">
        Amount
        <input v-model.number="form.amount" min="1" max="50" type="number" class="field-input" />
      </label>

      <label class="space-y-1 text-sm font-semibold text-slate-700">
        Category
        <select v-model="form.category" class="field-input">
          <option value="">Any Category</option>
          <option v-for="category in store.categories" :key="category._id" :value="category._id">
            {{ category.name }}
          </option>
        </select>
      </label>

      <label class="space-y-1 text-sm font-semibold text-slate-700">
        Difficulty
        <select v-model="form.difficulty" class="field-input">
          <option value="">Any Difficulty</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </label>

      <label class="space-y-1 text-sm font-semibold text-slate-700">
        Type
        <select v-model="form.type" class="field-input">
          <option value="">Any Type</option>
          <option value="multiple">multiple</option>
          <option value="boolean">boolean</option>
        </select>
      </label>

      <label class="space-y-1 text-sm font-semibold text-slate-700">
        Page
        <input v-model.number="form.page" min="1" type="number" class="field-input" />
      </label>

      <label class="space-y-1 text-sm font-semibold text-slate-700">
        Limit
        <input v-model.number="form.limit" min="1" max="50" type="number" class="field-input" />
      </label>
    </div>

    <div class="surface-panel space-y-4">
      <div class="space-y-2">
        <p class="kicker">Generated URL</p>
        <code class="block overflow-x-auto rounded-xl bg-slate-900 p-3 text-xs text-sky-100">
          {{ generatedUrl }}
        </code>
      </div>

      <div class="flex flex-wrap gap-2">
        <button class="btn-primary" @click="copyText(generatedUrl)">Copy URL</button>
        <button class="btn-muted" @click="copyText(fetchSnippet)">Copy Fetch Snippet</button>
        <button class="btn-muted" @click="copyText(curlSnippet)">Copy cURL</button>
        <button class="btn-muted" @click="testEndpoint">Test Endpoint</button>
        <RouterLink class="btn-muted inline-flex items-center" :to="quizRouteTo">Use in Quiz Component</RouterLink>
      </div>

      <p v-if="message" class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{{ message }}</p>
      <p v-if="error" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{{ error }}</p>
    </div>

    <div v-if="preview" class="surface-panel space-y-3">
      <h2 class="text-lg font-bold text-slate-900">Preview Response</h2>
      <div class="grid gap-2 text-sm text-slate-600 md:grid-cols-3">
        <p>
          Total Matching:
          <span class="font-semibold text-slate-800">{{ totalMatching }}</span>
        </p>
        <p>
          Returned Now:
          <span class="font-semibold text-slate-800">{{ returnedCount }}</span>
        </p>
        <p>
          Total Pages:
          <span class="font-semibold text-slate-800">{{ preview.pagination?.totalPages ?? 1 }}</span>
        </p>
      </div>
      <pre class="block max-h-80 overflow-auto rounded-xl bg-slate-900 p-3 text-xs leading-6 text-sky-100"><code v-html="highlightedPreview"></code></pre>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import api from "../services/api";
import { useTriviaStore } from "../stores/trivia";

const store = useTriviaStore();
const message = ref("");
const error = ref("");
const preview = ref(null);

const form = reactive({
  amount: 10,
  category: "",
  difficulty: "",
  type: "",
  page: 1,
  limit: 10,
});

const baseUrl = computed(() => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  return `${window.location.origin}/api`;
});

const queryString = computed(() => {
  const params = new URLSearchParams();
  const add = (key, value) => {
    if (value !== "" && value !== null && value !== undefined) params.set(key, String(value));
  };

  add("amount", form.amount);
  add("category", form.category);
  add("difficulty", form.difficulty);
  add("type", form.type);
  add("page", form.page);
  add("limit", form.limit);

  return params.toString();
});

const generatedUrl = computed(() => {
  const query = queryString.value;
  return `${baseUrl.value}/questions${query ? `?${query}` : ""}`;
});

const fetchSnippet = computed(() => `fetch("${generatedUrl.value}")
  .then((res) => res.json())
  .then((data) => console.log(data));`);

const curlSnippet = computed(() => `curl "${generatedUrl.value}"`);

const formattedPreview = computed(() => JSON.stringify(preview.value, null, 2));
const highlightedPreview = computed(() => syntaxHighlight(formattedPreview.value));
const totalMatching = computed(() => preview.value?.pagination?.total ?? preview.value?.total ?? 0);
const returnedCount = computed(() => preview.value?.results?.length ?? 0);
const quizRouteTo = computed(() => ({
  name: "quiz",
  query: {
    amount: form.amount,
    category: form.category || undefined,
    difficulty: form.difficulty || undefined,
    type: form.type || undefined,
    page: form.page,
    limit: form.limit,
    autoStart: "1",
  },
}));

const escapeHtml = (text) => text
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const syntaxHighlight = (jsonString) => {
  const escaped = escapeHtml(jsonString);
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (token) => {
      if (token.startsWith("\"") && token.endsWith(":")) {
        return `<span class="json-key">${token}</span>`;
      }
      if (token.startsWith("\"")) {
        return `<span class="json-string">${token}</span>`;
      }
      if (token === "true" || token === "false") {
        return `<span class="json-boolean">${token}</span>`;
      }
      if (token === "null") {
        return `<span class="json-null">${token}</span>`;
      }
      return `<span class="json-number">${token}</span>`;
    }
  );
};

const copyText = async (value) => {
  message.value = "";
  error.value = "";
  try {
    await navigator.clipboard.writeText(value);
    message.value = "Copied to clipboard.";
  } catch {
    error.value = "Failed to copy. Please copy manually.";
  }
};

const testEndpoint = async () => {
  message.value = "";
  error.value = "";
  preview.value = null;
  try {
    const endpoint = queryString.value ? `/questions?${queryString.value}` : "/questions";
    const { data } = await api.get(endpoint);
    preview.value = data;
    message.value = "Endpoint test succeeded.";
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to test endpoint.";
  }
};

onMounted(async () => {
  if (!store.categories.length) {
    await store.fetchCategories(1, 100);
  }
});
</script>

<style scoped>
:deep(.json-key) {
  color: #93c5fd;
}

:deep(.json-string) {
  color: #6ee7b7;
}

:deep(.json-number) {
  color: #fda4af;
}

:deep(.json-boolean) {
  color: #fdba74;
}

:deep(.json-null) {
  color: #c4b5fd;
}
</style>
