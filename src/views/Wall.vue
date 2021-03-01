<template>
    <div class="wall">
        <div class="wall-main d-flex flex-column flex-justify-center">
            <h4 v-if="messageContent.length">{{ messageContent }}</h4>
            <span v-else>No messages 😬</span>
        </div>

        <div class="wall-bottom">
            <button class="btn btn--primary" @click="enableFullscren">
                Fullscreen
            </button>
        </div>
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

    enableFullscren() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
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
<style lang="less" scoped>
.wall {
    display: flex;
    flex-direction: column;
    &-main {
        text-align: center;
        flex: 1;
    }

    &-bottom {
        padding: .5rem;
    }
}
</style>
