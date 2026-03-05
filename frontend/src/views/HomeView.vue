<template>
  <section class="space-y-4">
    <h1 class="text-3xl font-bold text-slate-900">BrainAPI Trivia</h1>
    <p class="max-w-2xl text-slate-600">
      OpenTDB-style trivia platform with public API browsing and admin content management.
    </p>
    <div class="flex flex-wrap gap-3">
      <RouterLink to="/browse" class="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white">Browse Questions</RouterLink>
      <RouterLink to="/categories" class="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700">View Categories</RouterLink>
    </div>
  </section>
</template>
