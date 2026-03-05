<template>
  <section class="space-y-8">
    <div class="space-y-2">
      <p class="kicker">User Space</p>
      <h1 class="page-title text-slate-900">My Dashboard</h1>
    </div>

    <article ref="createQuestionSection" class="surface-panel">
      <h2 class="mb-3 text-lg font-semibold">Create My Question</h2>
      <p v-if="!hasCategories" class="mb-3 rounded bg-amber-50 p-2 text-sm text-amber-700">
        Categories are required before creating a question.
      </p>
      <form class="grid gap-2 md:grid-cols-2" @submit.prevent="createQuestion">
        <select v-model="questionForm.category" class="field-input" required>
          <option disabled value="">Select category</option>
          <option v-for="category in store.categories" :key="category._id" :value="category._id">{{ category.name }}</option>
        </select>
        <select v-model="questionForm.type" class="field-input" required>
          <option value="multiple">multiple</option>
          <option value="boolean">boolean</option>
        </select>
        <select v-model="questionForm.difficulty" class="field-input" required>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <input v-model="questionForm.question" class="field-input md:col-span-2" placeholder="Question" required />
        <input v-model="questionForm.correct_answer" class="field-input" placeholder="Correct answer" required />
        <input v-model="questionForm.incorrect_answers_text" class="field-input" placeholder="Incorrect answers (comma separated)" required />
        <button :disabled="!hasCategories" class="btn-primary disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2">
          Add My Question
        </button>
      </form>
    </article>

    <article class="surface-panel">
      <h2 class="mb-3 text-lg font-semibold">My Questions</h2>
      <div class="space-y-3" v-if="questions.length">
        <div v-for="question in questions" :key="question._id" class="rounded-xl border border-slate-200/90 bg-white/85 p-3">
          <div class="grid gap-2 md:grid-cols-2">
            <select v-model="question.categoryId" class="field-input">
              <option v-for="category in store.categories" :key="category._id" :value="category._id">{{ category.name }}</option>
            </select>
            <select v-model="question.type" class="field-input">
              <option value="multiple">multiple</option>
              <option value="boolean">boolean</option>
            </select>
            <select v-model="question.difficulty" class="field-input">
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
            <input
              :value="question.incorrect_answers.join(', ')"
              class="field-input"
              @input="setIncorrect(question, $event.target.value)"
            />
            <input v-model="question.question" class="field-input md:col-span-2" />
            <input v-model="question.correct_answer" class="field-input md:col-span-2" />
          </div>
          <div class="mt-2 flex gap-2">
            <button class="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white" @click="updateQuestion(question)">Save</button>
            <button class="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white" @click="removeQuestion(question._id)">Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="rounded-xl border border-dashed border-slate-300 p-4 text-center">
        <p class="text-sm text-slate-600">You have not created any questions yet.</p>
        <button class="btn-primary mt-3" @click="scrollToCreateQuestion">
          Create First Question
        </button>
      </div>
    </article>

    <p v-if="message" class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{{ message }}</p>
    <p v-if="error" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{{ error }}</p>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import api from "../services/api";
import { useTriviaStore } from "../stores/trivia";

const store = useTriviaStore();
const message = ref("");
const error = ref("");
const questions = ref([]);
const createQuestionSection = ref(null);

const questionForm = reactive({
  category: "",
  type: "multiple",
  difficulty: "easy",
  question: "",
  correct_answer: "",
  incorrect_answers_text: "",
});

const hasCategories = computed(() => store.categories.length > 0);

const loadQuestions = async () => {
  try {
    const { data } = await api.get("/questions/my?amount=50&page=1&limit=50");
    questions.value = data.results.map((q) => ({ ...q }));
  } catch {
    questions.value = [];
  }
};

const setIncorrect = (question, text) => {
  question.incorrect_answers = text
    .split(",")
    .map((answer) => answer.trim())
    .filter(Boolean);
};

const createQuestion = async () => {
  if (!hasCategories.value) {
    error.value = "Categories are required before creating a question.";
    return;
  }

  message.value = "";
  error.value = "";
  try {
    const incorrect_answers = questionForm.incorrect_answers_text
      .split(",")
      .map((answer) => answer.trim())
      .filter(Boolean);

    await api.post("/questions/my", {
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
    await api.put(`/questions/my/${question._id}`, {
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
    await api.delete(`/questions/my/${id}`);
    await loadQuestions();
    message.value = "Question deleted";
  } catch (e) {
    error.value = e.response?.data?.message || "Failed to delete question";
  }
};

const scrollToCreateQuestion = () => {
  createQuestionSection.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};

onMounted(async () => {
  await store.fetchCategories(1, 100);
  await loadQuestions();
});
</script>
