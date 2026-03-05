<template>
  <section>
    <h1 class="mb-4 text-2xl font-bold text-slate-900">Category List</h1>
    <div class="grid gap-3">
      <article v-for="category in store.categories" :key="category._id" class="rounded-lg border border-slate-200 bg-white p-4">
        <h2 class="font-semibold text-slate-800">{{ category.name }}</h2>
        <p class="text-sm text-slate-600">{{ category.description || 'No description' }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useTriviaStore } from "../stores/trivia";

const store = useTriviaStore();

onMounted(() => {
  store.fetchCategories(1, 100);
});
</script>
