<template>
  <footer class="mt-10 border-t border-slate-200/70 bg-white/70 backdrop-blur">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-600 sm:flex-row">
      <div class="flex items-center gap-2.5">
        <img
          :src="logo"
          alt="brainyquizy logo"
          class="h-8 w-auto max-w-[140px] shrink-0 rounded-md object-contain"
        />
        <p>© {{ year }} brainyquizy. Quiz platform by MEVN stack.</p>
      </div>
      <div class="flex items-center gap-4 font-semibold">
        <RouterLink to="/browse" class="transition hover:text-brand-700">Browse</RouterLink>
        <RouterLink to="/categories" class="transition hover:text-brand-700">Categories</RouterLink>
        <RouterLink to="/api-config" class="transition hover:text-brand-700">API Config</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logo from "../assets/images/logo.png";

const year = new Date().getFullYear();
</script>
