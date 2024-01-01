<template>
  <main class="mx-auto flex h-screen max-w-md items-center">
    <div class="w-full">
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

      <p class="mt-4 text-center">Or login with</p>

      <f-button class="mt-4 block w-full" label="Github" />
    </div>
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
const login = async () => {
  isLoading.value = true;
  try {
    await authStore.login(email.value, password.value);

    router.push({ name: "Manager" });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped></style>
