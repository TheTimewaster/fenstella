<template>
    <div class="wall">
        <h1 v-if="messageContent.length">{{ messageContent }}</h1>
        <span v-else>No messages 😬</span>
    </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Message, MessageStatus } from "@/models";
import messageService from "@/services/message.service";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class WallView extends Vue {
  messageContent = "";
  readonly OBSERVER_KEY = "published_message";

  async created() {
      messageService.observeMessage({
          INSERT: this.assignMessageContent,
          UPDATE: this.assignMessageContent,
          DELETE: () => undefined
      }, this.OBSERVER_KEY, MessageStatus.PUBLISHED);

      const msg = await messageService.getLastPublishedMessage();
      if (msg != null) {
          this.assignMessageContent(msg);
      }
  }

  assignMessageContent(message: Message) {
      this.messageContent = message.content;
  }

  beforeDestroy() {
      messageService.closeObserver(this.OBSERVER_KEY);
  }
};
</script>
