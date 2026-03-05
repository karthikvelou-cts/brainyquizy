<template>
  <section class="space-y-8">
    <div
      class="relative overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-900 via-blue-700 to-sky-600 p-8 text-white shadow-[0_22px_52px_rgba(30,58,138,0.35)] md:p-10"
    >
      <div class="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/10 blur-sm"></div>
      <div class="absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10 blur-sm"></div>

      <div class="relative z-10 max-w-3xl space-y-4">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">brainyquizy</p>
        <h1 class="text-3xl font-extrabold leading-tight md:text-5xl">
          Quiz Management With Real API Workflows
        </h1>
        <p class="max-w-2xl text-sm text-blue-50 md:text-base">
          Browse quiz datasets, filter instantly, and manage categories or questions through role-based dashboards.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <RouterLink
            to="/browse"
            class="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-800 transition hover:bg-slate-100"
          >
            Start Browsing
          </RouterLink>
          <RouterLink v-if="!auth.isAuthenticated"
            to="/auth"
            class="rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Login / Register
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <article class="surface-panel">
        <p class="kicker text-brand-700">Public API</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900">Fetch Questions Fast</h2>
        <p class="mt-2 text-sm text-slate-600">
          Pull questions with category, difficulty, type, pagination, and amount controls.
        </p>
      </article>

      <article class="surface-panel">
        <p class="kicker text-brand-700">Admin Suite</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900">Manage Content Securely</h2>
        <p class="mt-2 text-sm text-slate-600">
          Admin-only create, update, delete, and JSON import for large quiz datasets.
        </p>
      </article>

      <article class="surface-panel">
        <p class="kicker text-brand-700">Session Token</p>
        <h2 class="mt-2 text-lg font-bold text-slate-900">Token Session Workflow</h2>
        <p class="mt-2 text-sm text-slate-600">
          Token routes support dedicated quiz sessions and controlled question retrieval.
        </p>
      </article>
    </div>

    <div class="surface-panel">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-bold text-slate-900">Quick Access</h3>
        <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">MEVN Stack</span>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink to="/browse" class="rounded-xl border border-slate-200/90 bg-white/90 p-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700">
          Browse Questions
        </RouterLink>
        <RouterLink to="/categories" class="rounded-xl border border-slate-200/90 bg-white/90 p-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700">
          Category Library
        </RouterLink>
        <RouterLink to="/api-config" class="rounded-xl border border-slate-200/90 bg-white/90 p-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700">
          API Config Builder
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="rounded-xl border border-slate-200/90 bg-white/90 p-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700">
          Admin Dashboard
        </RouterLink>
        <RouterLink v-else-if="auth.isAuthenticated" to="/dashboard" class="rounded-xl border border-slate-200/90 bg-white/90 p-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700">
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
