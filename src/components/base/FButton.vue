<template>
  <button
    class="rounded-lg px-4 py-2 font-bold transition-colors"
    :class="{
      'bg-gray-800 text-white hover:bg-gray-700': !inverted,
      'bg-gray-100 text-gray-800 hover:bg-white': inverted,
    }"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    inverted?: boolean;
  }>(),
  {
    inverted: false,
  },
);

const emit = defineEmits<{
  click: [];
}>();
</script>

<style scoped></style>
