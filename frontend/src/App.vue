<template>
  <div class="relative flex min-h-screen flex-col overflow-hidden">
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -left-20 top-20 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl"></div>
      <div class="absolute right-10 top-1/3 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"></div>
    </div>
    <Navbar />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>
