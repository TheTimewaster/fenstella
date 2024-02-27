<template>
  <main class="mx-auto flex h-screen max-w-md items-center">
    <form class="w-full" @submit.prevent="login">
      <h1 class="text-4xl font-bold">Fenstella | Login</h1>
      <f-input class="mt-4" label="E-Mail" name="email" v-model="email" />
      <f-input
        class="mt-4"
        label="Password"
        name="password"
        type="password"
        v-model="password"
      />
      <f-button
        class="mt-8 block w-full"
        :label="isLoading ? 'Loading...' : 'Login'"
        :disabled="isLoading || !email || !password"
        @click="login"
      />

      <p
        v-if="loginError != null && loginError.length > 0"
        class="mt-4 text-center text-red-500"
      >
        {{ loginError }}
      </p>

      <p class="mt-4 text-center">Or login with</p>

      <f-button class="mt-4 block w-full" label="Github" />
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FButton from "@/components/base/FButton.vue";
import FInput from "@/components/base/FInput.vue";
import useAuthStore from "@/stores/auth";
import router from "@/router";

const email = ref("");
const password = ref("");

const authStore = useAuthStore();
const isLoading = ref(false);
const loginError = ref("");
const login = async () => {
  isLoading.value = true;
  try {
    await authStore.login(email.value, password.value);
    loginError.value = "";
    router.push({ name: "NewMessages" });
  } catch (error) {
    loginError.value = (error as Error).message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
