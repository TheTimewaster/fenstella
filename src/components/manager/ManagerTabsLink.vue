<template>
  <router-link
    :to="{ name: link.name }"
    custom
    v-slot="{ href, isActive, navigate }"
  >
    <a
      :href="href"
      class="text-5xl font-bold transition-colors dark:hover:text-white"
      :class="{
        'text-black hover:text-gray-900 dark:text-white': isActive,
        'text-gray-500 hover:text-black dark:text-gray-400 ': !isActive,
      }"
      @click="navigate"
    >
      {{ link.label }}
    </a>
  </router-link>
</template>

<script setup lang="ts">
import { type ManagerTabItem } from "./types";
import { RouterLink } from "vue-router";

defineProps<{
  link: ManagerTabItem;
}>();
</script>

<style scoped></style>
