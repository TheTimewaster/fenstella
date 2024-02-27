<template>
    <p v-if="isLoading" class="my-8 text-center">
    {{ loadingListLabel }}
    </p>
    <p
      v-else-if="messagesStore.newMessages.length === 0"
      class="my-8 text-center"
    >
      {{ emptyListLabel }}
      <div class="mt-4 flex justify-center gap-4">

        <slot name="empty-action"></slot>

        <f-button
          label="Refresh"
          inverted
          @click="messagesStore.getMessages"
        />
      </div>
    </p>
    <message-item
      v-for="message in messagesStore.newMessages"
      :key="message.$id"
      :message="message"
    />
</template>

<script setup lang="ts">
import FButton from "@/components/base/FButton.vue";
import useMessagesStore from "@/stores/messages";
import MessageItem from "./MessageItem.vue";

const messagesStore = useMessagesStore();

withDefaults(defineProps<{
  isLoading?: boolean,
  loadingListLabel?: string,
  emptyListLabel?: string,
}>(), {
  isLoading: false,
  loadingListLabel: "Loading messages...",
  emptyListLabel: "No messages.",
})
</script>

<style scoped>

</style>