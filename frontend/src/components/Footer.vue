<template>
  <footer class="mt-8 border-t border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-600 sm:flex-row">
      <div class="flex items-center gap-2">
        <img
          :src="logo"
          alt="brainyquizy logo"
          class="h-8 w-auto max-w-[140px] shrink-0 rounded object-contain"
        />
        <p>(c) {{ year }} brainyquizy. All rights reserved.</p>
      </div>
      <div class="flex items-center gap-4">
        <RouterLink to="/browse" class="hover:text-brand-600">Browse</RouterLink>
        <RouterLink to="/categories" class="hover:text-brand-600">Categories</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logo from "../assets/images/logo.png";

const year = new Date().getFullYear();
</script>
