<template>
  <header class="sticky top-0 z-20 border-b border-slate-200/70 bg-white/75 backdrop-blur-lg">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <RouterLink class="flex items-center gap-3" to="/" aria-label="Go to home">
        <img
          :src="logo"
          alt="brainyquizy logo"
          class="h-10 w-auto max-w-[180px] shrink-0 rounded-lg object-contain"
        />
      </RouterLink>
      <div class="flex items-center gap-2 text-sm font-semibold">
        <RouterLink to="/browse" class="rounded-lg px-3 py-1.5 text-slate-700 transition hover:bg-white hover:text-brand-700">Browse</RouterLink>
        <RouterLink to="/categories" class="rounded-lg px-3 py-1.5 text-slate-700 transition hover:bg-white hover:text-brand-700">Categories</RouterLink>
        <RouterLink to="/api-config" class="rounded-lg px-3 py-1.5 text-slate-700 transition hover:bg-white hover:text-brand-700">API Config</RouterLink>
        <RouterLink
          v-if="auth.isAuthenticated && !auth.isAdmin"
          to="/dashboard"
          class="rounded-lg px-3 py-1.5 text-slate-700 transition hover:bg-white hover:text-brand-700"
        >
          Dashboard
        </RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="rounded-lg px-3 py-1.5 text-slate-700 transition hover:bg-white hover:text-brand-700">
          Admin
        </RouterLink>
        <RouterLink
          v-if="!auth.isAuthenticated"
          to="/auth"
          class="btn-primary px-4 py-2 text-white"
        >
          Login
        </RouterLink>
        <button
          v-else
          class="btn-muted px-4 py-2"
          @click="logout"
        >
          Logout
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import logo from "../assets/images/logo.png";

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push("/");
};
</script>
