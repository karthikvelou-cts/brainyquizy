<template>
  <section class="space-y-6">
    <div class="space-y-2">
      <p class="kicker">Quiz Engine</p>
      <h1 class="page-title text-slate-900">Play Quiz</h1>
      <p class="text-sm text-slate-600">
        Generate a quiz from API filters, answer questions, submit, and track your score history.
      </p>
    </div>

    <div class="surface-panel grid gap-3 md:grid-cols-6">
      <select v-model.number="filters.amount" class="field-input">
        <option :value="5">5 Questions</option>
        <option :value="10">10 Questions</option>
        <option :value="15">15 Questions</option>
        <option :value="20">20 Questions</option>
      </select>
      <CategorySelect :categories="store.categories" v-model="filters.category" />
      <DifficultyFilter v-model="filters.difficulty" />
      <select v-model="filters.type" class="field-input">
        <option value="">Any Type</option>
        <option value="multiple">Multiple Choice</option>
        <option value="boolean">True / False</option>
      </select>
      <label class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-3 py-2.5 text-sm font-semibold text-slate-700">
        <input v-model="proctorEnabled" type="checkbox" class="h-4 w-4 accent-brand-600" />
        <span>Strict Proctoring</span>
      </label>
      <button class="btn-primary" :disabled="loadingQuiz" @click="loadQuiz">
        {{ loadingQuiz ? "Loading..." : "Start Quiz" }}
      </button>
    </div>

    <p v-if="quizError" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {{ quizError }}
    </p>

    <p v-if="quizInProgress && proctorEnabled" class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
      Proctoring is active. Tab switching, window blur, or exiting fullscreen will auto-submit the quiz as malpractice.
    </p>

    <div v-if="questions.length" class="space-y-4">
      <article
        v-for="(question, index) in questions"
        :key="question._id || `${question.question}-${index}`"
        class="surface-panel"
      >
        <p class="kicker text-brand-700">Question {{ index + 1 }}</p>
        <h2 class="mt-1 text-base font-semibold text-slate-900 md:text-lg">{{ question.question }}</h2>
        <div class="mt-3 grid gap-2">
          <label
            v-for="option in optionMap[getQuestionKey(question, index)]"
            :key="option"
            class="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white/85 p-2.5 text-sm text-slate-700 transition hover:border-brand-400"
          >
            <input
              type="radio"
              class="h-4 w-4 accent-brand-600"
              :name="getQuestionKey(question, index)"
              :value="option"
              v-model="selectedAnswers[getQuestionKey(question, index)]"
            />
            <span>{{ option }}</span>
          </label>
        </div>
      </article>

      <div class="surface-panel">
        <button class="btn-primary w-full py-2.5 text-base" @click="submitQuiz">
          Submit Answers
        </button>
      </div>
    </div>

    <div v-if="result" class="surface-panel space-y-3">
      <h3 class="text-xl font-bold text-slate-900">Quiz Result</h3>
      <div class="grid gap-2 text-sm text-slate-700 md:grid-cols-4">
        <p>Total: <span class="font-semibold">{{ result.total }}</span></p>
        <p>Correct: <span class="font-semibold text-emerald-700">{{ result.correct }}</span></p>
        <p>Wrong: <span class="font-semibold text-rose-700">{{ result.wrong }}</span></p>
        <p>Score: <span class="font-semibold text-brand-700">{{ result.score }} / {{ result.maxScore }} ({{ result.percentage }}%)</span></p>
      </div>
      <p v-if="result.terminatedForMalpractice" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
        Attempt flagged for malpractice due to proctoring violation.
      </p>
      <p v-if="saveMessage" class="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{{ saveMessage }}</p>
      <p v-if="saveError" class="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{{ saveError }}</p>
      <p v-if="!auth.isAuthenticated" class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        Login to save this score to your history.
      </p>
    </div>

    <div class="surface-panel space-y-3">
      <h3 class="text-lg font-bold text-slate-900">Your Last Score / Quiz Results History</h3>

      <p v-if="!auth.isAuthenticated" class="text-sm text-slate-600">Login to view saved score history.</p>
      <p v-else-if="historyLoading" class="text-sm text-slate-600">Loading score history...</p>
      <p v-else-if="!scoreHistory.length" class="text-sm text-slate-600">No saved quiz attempts yet.</p>
      <div v-else class="space-y-2">
        <article
          v-for="item in scoreHistory"
          :key="item._id"
          class="rounded-xl border border-slate-200 bg-white/85 p-3 text-sm text-slate-700"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="font-semibold text-slate-900">{{ new Date(item.createdAt).toLocaleString() }}</p>
            <p class="font-semibold text-brand-700">{{ item.score }} / {{ item.maxScore }} ({{ item.percentage }}%)</p>
          </div>
          <p class="mt-1 text-xs text-slate-500">
            Correct: {{ item.correctAnswers }} | Wrong: {{ item.wrongAnswers }} | Total: {{ item.totalQuestions }}
          </p>
          <p v-if="item.proctoring?.terminatedForMalpractice" class="mt-1 text-xs font-semibold text-rose-700">
            Malpractice flagged (violations: {{ item.proctoring?.violations?.length || 0 }})
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { useTriviaStore } from "../stores/trivia";
import CategorySelect from "../components/CategorySelect.vue";
import DifficultyFilter from "../components/DifficultyFilter.vue";

const route = useRoute();
const auth = useAuthStore();
const store = useTriviaStore();

const loadingQuiz = ref(false);
const quizError = ref("");
const historyLoading = ref(false);
const saveMessage = ref("");
const saveError = ref("");
const proctorEnabled = ref(true);
const quizInProgress = ref(false);
const terminatingForMalpractice = ref(false);
const violations = ref([]);

const questions = ref([]);
const optionMap = ref({});
const selectedAnswers = reactive({});
const result = ref(null);
const scoreHistory = ref([]);

const filters = reactive({
  amount: Number(route.query.amount || 10),
  category: String(route.query.category || ""),
  difficulty: String(route.query.difficulty || ""),
  type: String(route.query.type || ""),
  page: Number(route.query.page || 1),
  limit: Number(route.query.limit || 10),
});

const getQuestionKey = (question, index) => question._id || `${index}-${question.question}`;
const markViolation = (type, message) => {
  violations.value.push({
    type,
    message,
    at: new Date().toISOString(),
  });
};

const stopProctoring = () => {
  document.removeEventListener("visibilitychange", onVisibilityChange);
  window.removeEventListener("blur", onWindowBlur);
  document.removeEventListener("fullscreenchange", onFullscreenChange);
  document.removeEventListener("contextmenu", blockClipboardAction);
  document.removeEventListener("copy", blockClipboardAction);
  document.removeEventListener("cut", blockClipboardAction);
};

const blockClipboardAction = (event) => {
  if (!quizInProgress.value || !proctorEnabled.value) return;
  event.preventDefault();
};

const forceSubmitForMalpractice = async (type, message) => {
  if (!quizInProgress.value || terminatingForMalpractice.value) return;
  terminatingForMalpractice.value = true;
  markViolation(type, message);
  quizError.value = message;
  await submitQuiz({ terminatedForMalpractice: true });
  terminatingForMalpractice.value = false;
};

const onVisibilityChange = () => {
  if (document.hidden) {
    forceSubmitForMalpractice("tab_switch", "Tab switch detected. Quiz auto-submitted.");
  }
};

const onWindowBlur = () => {
  forceSubmitForMalpractice("window_blur", "Window focus lost. Quiz auto-submitted.");
};

const onFullscreenChange = () => {
  if (!quizInProgress.value || !proctorEnabled.value) return;
  if (!document.fullscreenElement) {
    forceSubmitForMalpractice("fullscreen_exit", "Fullscreen exited. Quiz auto-submitted.");
  }
};

const startProctoring = async () => {
  if (!proctorEnabled.value) return;
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("blur", onWindowBlur);
  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("contextmenu", blockClipboardAction);
  document.addEventListener("copy", blockClipboardAction);
  document.addEventListener("cut", blockClipboardAction);

  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    markViolation("fullscreen_unavailable", "Could not enter fullscreen mode");
  }
};

const shuffle = (arr) => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const loadHistory = async () => {
  if (!auth.isAuthenticated) {
    scoreHistory.value = [];
    return;
  }
  historyLoading.value = true;
  try {
    const { data } = await api.get("/scores/my?page=1&limit=10");
    scoreHistory.value = data.results || [];
  } catch {
    scoreHistory.value = [];
  } finally {
    historyLoading.value = false;
  }
};

const loadQuiz = async () => {
  loadingQuiz.value = true;
  quizError.value = "";
  saveError.value = "";
  saveMessage.value = "";
  result.value = null;
  quizInProgress.value = false;
  violations.value = [];
  stopProctoring();
  questions.value = [];
  optionMap.value = {};
  Object.keys(selectedAnswers).forEach((key) => delete selectedAnswers[key]);

  try {
    const { data } = await api.get("/questions", {
      params: {
        amount: filters.amount,
        category: filters.category,
        difficulty: filters.difficulty,
        type: filters.type,
        page: filters.page,
        limit: filters.limit,
      },
    });

    questions.value = data.results || [];
    if (!questions.value.length) {
      quizError.value = "No questions found for this filter. Try different options.";
      return;
    }

    questions.value.forEach((question, index) => {
      const key = getQuestionKey(question, index);
      optionMap.value[key] = shuffle([question.correct_answer, ...question.incorrect_answers]);
    });
    quizInProgress.value = true;
    await startProctoring();
  } catch (e) {
    quizError.value = e.response?.data?.message || "Failed to load quiz questions.";
  } finally {
    loadingQuiz.value = false;
  }
};

const submitQuiz = async ({ terminatedForMalpractice = false } = {}) => {
  stopProctoring();
  quizInProgress.value = false;
  saveError.value = "";
  saveMessage.value = "";
  const total = questions.value.length;

  let correct = 0;
  questions.value.forEach((question, index) => {
    const key = getQuestionKey(question, index);
    if (selectedAnswers[key] === question.correct_answer) {
      correct += 1;
    }
  });

  const wrong = total - correct;
  const score = correct;
  const maxScore = total;
  const percentage = total > 0 ? Number(((correct / total) * 100).toFixed(2)) : 0;

  result.value = { total, correct, wrong, score, maxScore, percentage, terminatedForMalpractice };

  if (!auth.isAuthenticated) return;

  try {
    await api.post("/scores/my", {
      quizConfig: { ...filters },
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: wrong,
      score,
      maxScore,
      proctoring: {
        enabled: proctorEnabled.value,
        terminatedForMalpractice,
        violations: violations.value,
      },
    });
    saveMessage.value = terminatedForMalpractice
      ? "Quiz score saved and flagged for malpractice."
      : "Quiz score saved successfully.";
    await loadHistory();
  } catch (e) {
    saveError.value = e.response?.data?.message || "Failed to save score.";
  }
};

onMounted(async () => {
  await store.fetchCategories(1, 100);
  await loadHistory();
  if (route.query.autoStart === "1") {
    await loadQuiz();
  }
});

onBeforeRouteLeave(() => {
  if (quizInProgress.value && proctorEnabled.value) {
    forceSubmitForMalpractice("route_leave", "Route change detected. Quiz auto-submitted.");
  }
  return true;
});

onBeforeUnmount(() => {
  stopProctoring();
});
</script>
