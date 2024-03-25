<template>
  <a
    class="rounded-lg px-4 py-2 font-bold transition-colors"
    :class="{
      'bg-gray-800 text-white hover:bg-gray-700': !inverted,
      'bg-gray-100 text-gray-800 hover:bg-gray-200': inverted,
    }"
    :href="href"
  >
    {{ label }}
  </a>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    inverted?: boolean;
    href: string;
  }>(),
  {
    inverted: false,
  },
);
</script>

<style scoped></style>
