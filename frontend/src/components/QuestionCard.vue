<template>
  <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <p class="text-xs font-semibold uppercase tracking-wide text-brand-600">
      {{ question.category }} | {{ question.difficulty }} | {{ question.type }}
    </p>
    <h3 class="mt-2 text-base font-semibold text-slate-800">{{ question.question }}</h3>
    <div class="mt-3">
      <p class="text-sm text-emerald-700"><span class="font-semibold">Correct:</span> {{ question.correct_answer }}</p>
      <p class="text-sm text-rose-700"><span class="font-semibold">Incorrect:</span> {{ question.incorrect_answers.join(', ') }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: Object,
    required: true,
  },
});
</script>
