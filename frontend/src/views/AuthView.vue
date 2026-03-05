<template>
  <section class="mx-auto max-w-md">
    <div class="surface-panel">
      <p class="kicker">Account Access</p>
      <h1 class="mb-5 mt-1 text-3xl font-bold text-slate-900">Login / Register</h1>

      <div class="mb-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
        <button class="rounded-lg px-3 py-2 text-sm font-semibold transition" :class="mode === 'login' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-700'" @click="mode = 'login'">Login</button>
        <button class="rounded-lg px-3 py-2 text-sm font-semibold transition" :class="mode === 'register' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-700'" @click="mode = 'register'">Register</button>
      </div>

      <form class="space-y-3" @submit.prevent="submit">
        <input v-if="mode === 'register'" v-model="form.username" class="field-input" placeholder="Username" required />
        <input v-model="form.email" type="email" class="field-input" placeholder="Email" required />
        <div class="relative">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="field-input pr-10"
            placeholder="Password"
            required
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <svg
              v-if="showPassword"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-5 w-5"
            >
              <path d="M3 3l18 18" />
              <path d="M10.58 10.58a2 2 0 102.83 2.83" />
              <path d="M9.88 5.09A10.94 10.94 0 0112 5c5 0 9.27 3.11 11 7-1 2.23-2.64 4.11-4.66 5.35" />
              <path d="M6.61 6.61C4.62 7.87 3 9.73 2 12c.64 1.43 1.53 2.73 2.61 3.86" />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-5 w-5"
            >
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
        <button class="btn-primary w-full py-2.5 text-base" :disabled="auth.loading">
          {{ auth.loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register' }}
        </button>
      </form>

      <p v-if="localError" class="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">{{ localError }}</p>
      <p v-if="auth.error" class="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">{{ auth.error }}</p>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const mode = ref("login");
const localError = ref("");
const showPassword = ref(false);
const form = reactive({
  username: "",
  email: "",
  password: "",
});

const submit = async () => {
  localError.value = "";

  if (!form.password?.trim()) {
    localError.value = "Password is required.";
    return;
  }

  if (mode.value === "register" && !form.username?.trim()) {
    localError.value = "Username is required.";
    return;
  }

  try {
    if (mode.value === "login") {
      await auth.login({ email: form.email, password: form.password });
    } else {
      await auth.register({ username: form.username, email: form.email, password: form.password });
    }

    if (auth.isAdmin) {
      const redirectTarget =
        typeof route.query.redirect === "string" && route.query.redirect.startsWith("/")
          ? route.query.redirect
          : "/admin";
      router.push(redirectTarget);
    } else {
      const redirectTarget =
        typeof route.query.redirect === "string" && route.query.redirect.startsWith("/")
          ? route.query.redirect
          : "/dashboard";
      router.push(redirectTarget);
    }
  } catch {
    // API-level errors are already handled in auth store and surfaced via auth.error
  }
};
</script>
