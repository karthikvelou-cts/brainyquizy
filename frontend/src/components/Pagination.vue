<template>
  <div class="mt-8 flex items-center justify-center gap-3" v-if="totalPages > 1">
    <button
      class="btn-muted px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="page <= 1"
      @click="$emit('change', page - 1)"
    >
      Prev
    </button>
    <span class="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600">Page {{ page }} of {{ totalPages }}</span>
    <button
      class="btn-primary px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="page >= totalPages"
      @click="$emit('change', page + 1)"
    >
      Next
    </button>
  </div>
</template>

<script setup>
defineProps({
  page: {
    type: Number,
    default: 1,
  },
  totalPages: {
    type: Number,
    default: 1,
  },
});

defineEmits(["change"]);
</script>
