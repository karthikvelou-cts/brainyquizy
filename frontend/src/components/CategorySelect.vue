<template>
  <select
    v-model="model"
    class="field-input"
  >
    <option value="">Any Category</option>
    <option v-for="category in categories" :key="category._id" :value="category._id">
      {{ category.name }}
    </option>
  </select>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>
