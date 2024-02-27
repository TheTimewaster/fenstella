<template>
  <main class="h-screen">
    <div class="flex h-full flex-col justify-center text-center">
      <template v-if="!isLoading">
        <template v-if="message != null && message.content.length">
          <transition name="fade" mode="out-in" :css="false">
            <h4 class="text-2xl font-bold" :key="message.$updatedAt">
              {{ message.content }}
            </h4>
          </transition>
        </template>
        <template v-else> No current message. 😬 </template>
      </template>
      <template v-else> Loading message... 🕒 </template>
    </div>

    <div class="absolute inset-x-0 bottom-0 p-2">
      <f-button label="Fullscreen" @click="enableFullscreen" />
      <!-- <button class="btn btn--primary mar-l" @click="playTransition">
        Transition
      </button> -->
    </div>

    <div class="wall-info text-align-right d-flex flex-align-center">
      <div class="wall-info__left wall-info__img" />
      <div class="wall-info__right wall-info__img" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import useMessagesStore from "@/stores/messages";
import FButton from "@/components/base/FButton.vue";

const enableFullscreen = () => {
  const elem = document.body;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  }
};

const messagesStore = useMessagesStore();
const message = computed(() => messagesStore.displayMessage);

const isLoading = ref(false);
onMounted(async () => {
  isLoading.value = true;
  try {
    await messagesStore.getMessages();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>
