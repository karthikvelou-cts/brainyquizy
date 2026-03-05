<template>
  <section class="space-y-8">
    <div
      class="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-brand-700 via-brand-600 to-sky-600 p-8 text-white shadow-lg"
    >
      <div class="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
      <div class="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10"></div>

      <div class="relative z-10 max-w-3xl space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">brainyquizy</p>
        <h1 class="text-3xl font-extrabold leading-tight md:text-5xl">
          Build, Browse, and Manage at Scale
        </h1>
        <p class="max-w-2xl text-sm text-white/90 md:text-base">
          Modern platform with public question APIs, category filtering, difficulty tuning, and secured admin controls.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <RouterLink
            to="/browse"
            class="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-slate-100"
          >
            Start Browsing
          </RouterLink>
          <RouterLink v-if="!auth.isAuthenticated"
            to="/auth"
            class="rounded-lg border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Login / Register
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-brand-600">Public API</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900">Fetch Questions Fast</h2>
        <p class="mt-2 text-sm text-slate-600">
          Pull questions with category, difficulty, type, pagination, and amount controls.
        </p>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-brand-600">Admin Suite</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900">Manage Content Securely</h2>
        <p class="mt-2 text-sm text-slate-600">
          Admin-only create, update, delete, and JSON import for large quiz datasets.
        </p>
      </article>

      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wider text-brand-600">Session Token</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900">Token Session Workflow</h2>
        <p class="mt-2 text-sm text-slate-600">
          Token routes support dedicated quiz sessions and controlled question retrieval.
        </p>
      </article>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-900">Quick Access</h3>
        <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">MEVN Stack</span>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink to="/browse" class="rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
          Browse Questions
        </RouterLink>
        <RouterLink to="/categories" class="rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
          Category Library
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
          Admin Dashboard
        </RouterLink>
        <RouterLink v-else-if="auth.isAuthenticated" to="/dashboard" class="rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 transition hover:border-brand-500 hover:text-brand-700">
          My Dashboard
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
</script>
