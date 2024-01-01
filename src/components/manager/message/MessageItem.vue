<template>
  <div>
    <p>
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
