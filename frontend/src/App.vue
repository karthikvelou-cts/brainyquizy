<template>
  <div class="min-h-screen bg-gradient-to-b from-white to-slate-100">
    <Navbar />
    <main class="mx-auto max-w-6xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>
