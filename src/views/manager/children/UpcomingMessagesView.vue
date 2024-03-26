<template>
  <main>
    <message-list
      :is-loading="isLoading"
      loading-list-label="Loading upcoming messages... 🕒"
      empty-list-label="No upcoming messages. ✨"
    >
      <template #empty-action>
      </template>
    </message-list>
  </main>
</template>

<script setup lang="ts">
import MessageList from '@/components/manager/message/MessageList.vue';
import useMessagesStore from '@/stores/messages';
import { onMounted, ref } from 'vue';

const messagesStore = useMessagesStore();

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
