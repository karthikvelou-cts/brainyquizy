<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <p class="kicker">Question Explorer</p>
      <h1 class="page-title text-slate-900">Browse Questions</h1>
      <p class="max-w-2xl text-sm text-slate-600">
        Filter by category, difficulty, and type to quickly find the right quiz dataset.
      </p>
    </div>

    <div class="surface-panel grid gap-3 md:grid-cols-5">
      <CategorySelect :categories="store.categories" v-model="filters.category" />
      <DifficultyFilter v-model="filters.difficulty" />
      <select v-model="filters.type" class="field-input">
        <option value="">Any Type</option>
        <option value="multiple">Multiple Choice</option>
        <option value="boolean">True / False</option>
      </select>
      <input
        v-model.number="filters.amount"
        type="number"
        min="1"
        max="50"
        class="field-input"
        placeholder="Amount"
      />
      <button class="btn-primary" @click="loadQuestions(1)">Apply</button>
    </div>

    <p v-if="store.error" class="rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-rose-700">{{ store.error }}</p>

    <div class="grid gap-4">
      <QuestionCardSkeleton v-if="store.loadingQuestions" v-for="n in 6" :key="`skeleton-${n}`" />
      <QuestionCard v-for="(question, idx) in store.questions" :key="idx" :question="question" />
      <div
        v-if="!store.loadingQuestions && store.questions.length === 0"
        class="surface-panel border-dashed text-center text-sm text-slate-600"
      >
        No questions found for this filter combination.
      </div>
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
import QuestionCardSkeleton from "../components/QuestionCardSkeleton.vue";
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
