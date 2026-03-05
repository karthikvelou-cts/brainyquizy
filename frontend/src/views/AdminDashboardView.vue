<template>
  <section class="space-y-8">
    <h1 class="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

    <article class="rounded-xl border border-slate-200 bg-white p-4">
      <h2 class="mb-3 text-lg font-semibold">Create Category</h2>
      <form class="grid gap-2 md:grid-cols-3" @submit.prevent="createCategory">
        <input v-model="categoryForm.name" class="rounded border px-3 py-2" placeholder="Category name" required />
        <input v-model="categoryForm.description" class="rounded border px-3 py-2" placeholder="Description" />
        <button class="rounded bg-brand-600 px-4 py-2 text-white">Add Category</button>
      </form>
    </article>

    <article class="rounded-xl border border-slate-200 bg-white p-4">
      <h2 class="mb-3 text-lg font-semibold">Manage Categories</h2>
      <div class="space-y-2" v-if="store.categories.length">
        <div v-for="category in store.categories" :key="category._id" class="grid gap-2 rounded border p-2 md:grid-cols-5">
          <input v-model="category.name" class="rounded border px-2 py-1 md:col-span-2" />
          <input v-model="category.description" class="rounded border px-2 py-1 md:col-span-2" />
          <div class="flex gap-2">
            <button class="rounded bg-amber-500 px-2 py-1 text-sm text-white" @click="updateCategory(category)">Save</button>
            <button class="rounded bg-rose-600 px-2 py-1 text-sm text-white" @click="removeCategory(category._id)">Delete</button>
          </div>
        </div>
      </div>
    </article>

    <article class="rounded-xl border border-slate-200 bg-white p-4">
      <h2 class="mb-3 text-lg font-semibold">Create Question</h2>
      <form class="grid gap-2 md:grid-cols-2" @submit.prevent="createQuestion">
        <select v-model="questionForm.category" class="rounded border px-3 py-2" required>
          <option disabled value="">Select category</option>
          <option v-for="category in store.categories" :key="category._id" :value="category._id">{{ category.name }}</option>
        </select>
        <select v-model="questionForm.type" class="rounded border px-3 py-2" required>
          <option value="multiple">multiple</option>
          <option value="boolean">boolean</option>
        </select>
        <select v-model="questionForm.difficulty" class="rounded border px-3 py-2" required>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <input v-model="questionForm.question" class="rounded border px-3 py-2 md:col-span-2" placeholder="Question" required />
        <input v-model="questionForm.correct_answer" class="rounded border px-3 py-2" placeholder="Correct answer" required />
        <input v-model="questionForm.incorrect_answers_text" class="rounded border px-3 py-2" placeholder="Incorrect answers (comma separated)" required />
        <button class="rounded bg-brand-600 px-4 py-2 text-white md:col-span-2">Add Question</button>
      </form>
    </article>

    <article class="rounded-xl border border-slate-200 bg-white p-4">
      <h2 class="mb-3 text-lg font-semibold">Manage Questions</h2>
      <div class="space-y-3" v-if="questions.length">
        <div v-for="question in questions" :key="question._id" class="rounded border p-3">
          <div class="grid gap-2 md:grid-cols-2">
            <select v-model="question.categoryId" class="rounded border px-2 py-1">
              <option v-for="category in store.categories" :key="category._id" :value="category._id">{{ category.name }}</option>
            </select>
            <select v-model="question.type" class="rounded border px-2 py-1">
              <option value="multiple">multiple</option>
              <option value="boolean">boolean</option>
            </select>
            <select v-model="question.difficulty" class="rounded border px-2 py-1">
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
            <input
              :value="question.incorrect_answers.join(', ')"
              class="rounded border px-2 py-1"
              @input="setIncorrect(question, $event.target.value)"
            />
            <input v-model="question.question" class="rounded border px-2 py-1 md:col-span-2" />
            <input v-model="question.correct_answer" class="rounded border px-2 py-1 md:col-span-2" />
          </div>
          <div class="mt-2 flex gap-2">
            <button class="rounded bg-amber-500 px-2 py-1 text-sm text-white" @click="updateQuestion(question)">Save</button>
            <button class="rounded bg-rose-600 px-2 py-1 text-sm text-white" @click="removeQuestion(question._id)">Delete</button>
          </div>
        </div>
      </div>
    </article>

    <p v-if="message" class="text-sm text-emerald-700">{{ message }}</p>
    <p v-if="error" class="text-sm text-rose-700">{{ error }}</p>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import api from "../services/api";
import { useTriviaStore } from "../stores/trivia";

const store = useTriviaStore();
const message = ref("");
const error = ref("");
const questions = ref([]);

const categoryForm = reactive({
  name: "",
  description: "",
});

const questionForm = reactive({
  category: "",
  type: "multiple",
  difficulty: "easy",
  question: "",
  correct_answer: "",
  incorrect_answers_text: "",
});

const loadQuestions = async () => {
  const { data } = await api.get("/questions?amount=20&page=1&limit=20");
  questions.value = data.results.map((q) => ({ ...q }));
};

const createCategory = async () => {
  message.value = "";
  error.value = "";
  try {
    await api.post("/categories", categoryForm);
    categoryForm.name = "";
    categoryForm.description = "";
    await store.fetchCategories(1, 100);
    message.value = "Category created";
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to create category";
  }
};

const updateCategory = async (category) => {
  message.value = "";
  error.value = "";
  try {
    await api.put(`/categories/${category._id}`, {
      name: category.name,
      description: category.description,
    });
    message.value = "Category updated";
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to update category";
  }
};

const removeCategory = async (id) => {
  message.value = "";
  error.value = "";
  try {
    await api.delete(`/categories/${id}`);
    await store.fetchCategories(1, 100);
    message.value = "Category deleted";
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to delete category";
  }
};

const setIncorrect = (question, text) => {
  question.incorrect_answers = text
    .split(",")
    .map((answer) => answer.trim())
    .filter(Boolean);
};

const createQuestion = async () => {
  message.value = "";
  error.value = "";
  try {
    const incorrect_answers = questionForm.incorrect_answers_text
      .split(",")
      .map((answer) => answer.trim())
      .filter(Boolean);

    await api.post("/questions", {
      category: questionForm.category,
      type: questionForm.type,
      difficulty: questionForm.difficulty,
      question: questionForm.question,
      correct_answer: questionForm.correct_answer,
      incorrect_answers,
    });

    questionForm.category = "";
    questionForm.type = "multiple";
    questionForm.difficulty = "easy";
    questionForm.question = "";
    questionForm.correct_answer = "";
    questionForm.incorrect_answers_text = "";
    await loadQuestions();
    message.value = "Question created";
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to create question";
  }
};

const updateQuestion = async (question) => {
  message.value = "";
  error.value = "";
  try {
    await api.put(`/questions/${question._id}`, {
      category: question.categoryId,
      type: question.type,
      difficulty: question.difficulty,
      question: question.question,
      correct_answer: question.correct_answer,
      incorrect_answers: question.incorrect_answers,
    });
    message.value = "Question updated";
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to update question";
  }
};

const removeQuestion = async (id) => {
  message.value = "";
  error.value = "";
  try {
    await api.delete(`/questions/${id}`);
    await loadQuestions();
    message.value = "Question deleted";
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to delete question";
  }
};

onMounted(async () => {
  await store.fetchCategories(1, 100);
  await loadQuestions();
});
</script>
