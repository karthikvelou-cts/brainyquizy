<template>
  <header class="border-b border-slate-200 bg-white">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <RouterLink class="text-lg font-bold text-brand-700" to="/">BrainAPI</RouterLink>
      <div class="flex items-center gap-4 text-sm font-medium text-slate-700">
        <RouterLink to="/browse" class="hover:text-brand-600">Browse</RouterLink>
        <RouterLink to="/categories" class="hover:text-brand-600">Categories</RouterLink>
        <RouterLink v-if="auth.isAdmin" to="/admin" class="hover:text-brand-600">Admin</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" to="/auth" class="rounded bg-brand-600 px-3 py-1.5 text-white">Login</RouterLink>
        <button
          v-else
          class="rounded bg-slate-800 px-3 py-1.5 text-white"
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

const auth = useAuthStore();
const router = useRouter();

const logout = () => {
  auth.logout();
  router.push("/");
};
</script>
