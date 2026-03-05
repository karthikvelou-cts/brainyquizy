<template>
  <section class="space-y-5">
    <div class="space-y-2">
      <p class="kicker">Taxonomy</p>
      <h1 class="page-title text-slate-900">Category Library</h1>
      <p class="text-sm text-slate-600">Discover available quiz domains and their descriptions.</p>
    </div>
    <div class="grid gap-3 md:grid-cols-2">
      <CategoryItemSkeleton v-if="store.loadingCategories" v-for="n in 6" :key="`cat-skeleton-${n}`" />
      <article v-for="category in store.categories" :key="category._id" class="surface-panel">
        <h2 class="font-semibold text-slate-800">{{ category.name }}</h2>
        <p class="text-sm text-slate-600">{{ category.description || 'No description' }}</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import { useTriviaStore } from "../stores/trivia";
import CategoryItemSkeleton from "../components/CategoryItemSkeleton.vue";

const store = useTriviaStore();

onMounted(() => {
  store.fetchCategories(1, 100);
});
</script>
