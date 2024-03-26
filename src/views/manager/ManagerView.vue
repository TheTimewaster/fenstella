<template>
  <div>
    <manager-tabs :links="links" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import ManagerTabs from "@/components/manager/ManagerTabs.vue";
import { type ManagerTabItem } from "@/components/manager/types";

const links: Array<ManagerTabItem> = [
  {
    name: "NewMessages",
    label: "New",
  },
  {
    name: "UpcomingMessages",
    label: "Upcoming",
  }
];
</script>

<style scoped></style>
