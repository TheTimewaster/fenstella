<template>
  <div class="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
    <p class="mb-4">
      {{ message.content }}
    </p>

    <div class="flex gap-2">
      <f-button label="Stage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import FButton from "@/components/base/FButton.vue";
import { type Message } from "@/models";

defineProps<{
  message: Message;
}>();
</script>

<style scoped></style>
