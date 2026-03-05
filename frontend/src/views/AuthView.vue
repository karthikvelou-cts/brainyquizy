<template>
  <section class="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6">
    <h1 class="mb-4 text-2xl font-bold text-slate-900">Login / Register</h1>

    <div class="mb-4 flex gap-2">
      <button class="rounded px-3 py-1 text-sm" :class="mode === 'login' ? 'bg-brand-600 text-white' : 'bg-slate-100'" @click="mode = 'login'">Login</button>
      <button class="rounded px-3 py-1 text-sm" :class="mode === 'register' ? 'bg-brand-600 text-white' : 'bg-slate-100'" @click="mode = 'register'">Register</button>
    </div>

    <form class="space-y-3" @submit.prevent="submit">
      <input v-if="mode === 'register'" v-model="form.username" class="w-full rounded border px-3 py-2" placeholder="Username" required />
      <input v-model="form.email" type="email" class="w-full rounded border px-3 py-2" placeholder="Email" required />
      <input v-model="form.password" type="password" class="w-full rounded border px-3 py-2" placeholder="Password" required />
      <button class="w-full rounded bg-brand-600 px-4 py-2 text-white" :disabled="auth.loading">
        {{ auth.loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register' }}
      </button>
    </form>

    <p v-if="auth.error" class="mt-3 rounded bg-rose-50 p-2 text-sm text-rose-700">{{ auth.error }}</p>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const mode = ref("login");
const form = reactive({
  username: "",
  email: "",
  password: "",
});

const submit = async () => {
  if (mode.value === "login") {
    await auth.login({ email: form.email, password: form.password });
  } else {
    await auth.register({ username: form.username, email: form.email, password: form.password });
  }

  if (auth.isAdmin) {
    router.push("/admin");
  } else {
    router.push("/");
  }
};
</script>
