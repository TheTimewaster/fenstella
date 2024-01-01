<template>
  <div>
    <label
      class="block text-sm font-bold text-gray-700 dark:text-gray-400"
      for="name"
    >
      {{ label }}</label
    >
    <input
      class="mt-1 w-full rounded-lg border border-gray-900 p-2 focus:border-white dark:border-gray-400 dark:bg-black"
      v-model="modelValue"
      :type="type"
      :name="name"
      :id="name"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    name: string;
    type?: string;
  }>(),
  {
    type: "text",
  },
);

const modelValue = defineModel<string>();
</script>

<style scoped></style>
