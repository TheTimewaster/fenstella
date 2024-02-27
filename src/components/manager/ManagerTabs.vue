<template>
  <div class="flex gap-4">
    <manager-tabs-link v-for="link in links" :key="link.name" :link="link" />
  </div>
</template>

<script setup lang="ts">
import ManagerTabsLink from "./ManagerTabsLink.vue";
import { type ManagerTabItem } from "./types";

defineProps<{
  links: Array<ManagerTabItem>;
}>();
</script>

<style scoped></style>
