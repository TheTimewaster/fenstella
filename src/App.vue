<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import FLink from "./components/base/FLink.vue";
import { computed, onMounted } from "vue";
import useAuthStore from "@/stores/auth";
import FButton from "./components/base/FButton.vue";

const route = useRoute();
const isLoginRoute = computed(() => route.name === "Login");

const auth = useAuthStore();
const router = useRouter();
const logout = async () => {
  await auth.logout();
  router.push({ name: "Wall" });
};

onMounted(async () => {
  if (auth.hasSession) {
    try {
      await auth.checkSession();
    } catch (error) {
      console.log(error);
    }
  }
});
</script>

<template>
  <div
    class="fixed inset-x-0 top-0 flex items-center justify-between gap-4 p-2"
  >
    <router-link
      :to="{ name: 'Wall' }"
      custom
      v-slot="{ href, isActive, navigate }"
    >
      <a :href="href" :class="{ 'font-bold': isActive }" @click="navigate">
        Wall
      </a>
    </router-link>

    <template v-if="!isLoginRoute">
      <router-link
        v-if="!auth.hasSession"
        to="/login"
        custom
        v-slot="{ href, navigate }"
      >
        <f-link inverted :href="href" label="Login" @click="navigate" />
      </router-link>
      <div class="flex gap-2" v-else-if="auth.hasSession">
        <router-link to="/manager" custom v-slot="{ href, navigate }">
          <f-link inverted label="Manager" :href="href" @click="navigate" />
        </router-link>

        <f-button label="Logout" inverted @click="logout" />
      </div>
    </template>
  </div>

  <router-view class="px-4 py-16 md:px-8 max-w-screen-xl mx-auto" />
</template>
