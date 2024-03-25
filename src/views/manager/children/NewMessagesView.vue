<template>
  <main>
    <message-list
      :is-loading="isLoading"
      loading-list-label="Loading new messages... 🕒"
      empty-list-label="No new messages. ✨"
    >
      <template #empty-action>
        <f-button label="Add" @click="addMessage" />
      </template>
    </message-list>

    <f-dialog 
      v-model="openModal"
      title="Add a new message"
    >
      <form class="relative" @submit.prevent="sendMessage">
        <f-input
          label="Message"
          v-model="input"
          name="message"
          class="flex-1 transition-all"
          :class="{'mr-12': input.length > 0, 'mr-0': input.length === 0}"
          placeholder="Enter a message"
        />
        <scale-transition>
          <f-button
            v-if="input.length > 0"
            class="absolute bottom-0 right-0"
            icon="material-symbols:done"
            rounded
            type="submit"
          />
        </scale-transition>
      </form>
    </f-dialog>
  </main>
</template>

<script setup lang="ts">
import FButton from '@/components/base/FButton.vue';
import FDialog from '@/components/base/FDialog.vue';
import FInput from '@/components/base/FInput.vue';
import ScaleTransition from '@/components/transitions/ScaleTransition.vue';
import MessageList from '@/components/manager/message/MessageList.vue';
import useMessagesStore from '@/stores/messages';
import { onMounted, ref } from 'vue';

const messagesStore = useMessagesStore();

const input = ref('');
const openModal = ref(false);
const addMessage = () => {
  openModal.value = true;
};

const sendMessage = () => {
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
