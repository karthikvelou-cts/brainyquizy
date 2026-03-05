<template>
  <section>
    <h1 class="mb-4 text-2xl font-bold text-slate-900">Browse Questions</h1>

    <div class="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-5">
      <CategorySelect :categories="store.categories" v-model="filters.category" />
      <DifficultyFilter v-model="filters.difficulty" />
      <select v-model="filters.type" class="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="">Any Type</option>
        <option value="multiple">Multiple Choice</option>
        <option value="boolean">True / False</option>
      </select>
      <input
        v-model.number="filters.amount"
        type="number"
        min="1"
        max="50"
        class="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        placeholder="Amount"
      />
      <button class="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white" @click="loadQuestions(1)">Apply</button>
    </div>

    <p v-if="store.error" class="mt-4 rounded bg-rose-50 p-3 text-rose-700">{{ store.error }}</p>

    <div class="mt-6 grid gap-4">
      <QuestionCard v-for="(question, idx) in store.questions" :key="idx" :question="question" />
      <p v-if="!store.loading && store.questions.length === 0" class="text-slate-600">No questions found.</p>
    </div>

    <Pagination
      :page="page"
      :total-pages="store.pagination?.totalPages || 1"
      @change="loadQuestions"
    />
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useTriviaStore } from "../stores/trivia";
import QuestionCard from "../components/QuestionCard.vue";
import CategorySelect from "../components/CategorySelect.vue";
import DifficultyFilter from "../components/DifficultyFilter.vue";
import Pagination from "../components/Pagination.vue";

const store = useTriviaStore();
const page = ref(1);

const filters = reactive({
  amount: 10,
  category: "",
  difficulty: "",
  type: "",
});

const loadQuestions = async (nextPage = 1) => {
  page.value = nextPage;
  await store.fetchQuestions({
    ...filters,
    page: page.value,
    limit: 10,
  });
};

onMounted(async () => {
  await store.fetchCategories();
  await loadQuestions();
});
</script>
