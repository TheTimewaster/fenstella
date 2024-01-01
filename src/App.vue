<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import FLink from "./components/base/FLink.vue";
import { computed } from "vue";
import useAuthStore from "@/stores/auth";
import FButton from "./components/base/FButton.vue";

const route = useRoute();
const isLoginRoute = computed(() => route.name === "Login");

const auth = useAuthStore();
</script>

<template>
  <div
    class="fixed inset-x-0 top-0 flex items-center justify-between gap-4 p-2"
  >
    <router-link to="/wall" custom v-slot="{ href, isActive, navigate }">
      <a :href="href" :class="{ 'font-bold': isActive }" @click="navigate"
        >Wall</a
      >
    </router-link>
    <template v-if="!isLoginRoute">
      <router-link
        v-if="!auth.hasUser"
        to="/login"
        custom
        v-slot="{ href, navigate }"
      >
        <f-link inverted :href="href" label="Login" @click="navigate" />
      </router-link>
      <div class="flex gap-2" v-else-if="auth.hasUser">
        <router-link to="/manager" custom v-slot="{ href, navigate }">
          <f-link inverted label="Manager" :href="href" @click="navigate" />
        </router-link>
        <f-button label="Logout" inverted @click="auth.logout" />
      </div>
    </template>
  </div>

  <router-view class="px-4 py-16 md:px-8" />
</template>
