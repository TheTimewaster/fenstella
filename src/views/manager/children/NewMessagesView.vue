<template>
  <main>
    <message-list
      :is-loading
      loading-list-label="Loading new messages... 🕒"
      empty-list-label="No new messages. ✨"
    >
      <template #empty-action>
        <f-button label="Add" @click="addMessage" />
      </template>
    </message-list>
  </main>
</template>

<script setup lang="ts">
import FButton from "@/components/base/FButton.vue";
import MessageList from "@/components/manager/message/MessageList.vue";
import useMessagesStore from "@/stores/messages";
import { onMounted, ref } from "vue";

const messagesStore = useMessagesStore();

const addMessage = () => {
  // TODO: implement
};

const isLoading = ref(false);
onMounted(async () => {
  if (messagesStore.messages.length === 0) {
    isLoading.value = true;
    try {
      await messagesStore.getMessages();
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
});
</script>

<style scoped></style>
