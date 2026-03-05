<template>
  <div class="surface-panel">
    <p class="kicker text-brand-700">{{ question.category }}</p>
    <h3 class="mt-2 text-base font-semibold text-slate-800 md:text-lg">{{ question.question }}</h3>
    <div class="mt-3 text-sm text-slate-600">
      <span class="font-semibold">Created By:</span>
      {{ question.createdBy || "Admin" }}
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
