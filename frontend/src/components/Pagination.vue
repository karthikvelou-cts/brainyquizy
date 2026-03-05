<template>
  <div class="mt-6 flex items-center justify-center gap-2" v-if="totalPages > 1">
    <button
      class="rounded border px-3 py-1 text-sm"
      :disabled="page <= 1"
      @click="$emit('change', page - 1)"
    >
      Prev
    </button>
    <span class="text-sm text-slate-600">Page {{ page }} of {{ totalPages }}</span>
    <button
      class="rounded border px-3 py-1 text-sm"
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
