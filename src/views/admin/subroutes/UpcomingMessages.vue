<template>
    <section class="archived-messages-view">
        <messages-list
            :messages="messages"
            :isLoading="isLoading"
            :endOfListReached="endOfListReached"
            :operations="['DELETE', 'DENY']"
            @loadMore="getMoreMessages"
            @messageChanged="getMessages">
            <template slot="messages-list-empty">
                No upcoming messages. 🕖
            </template>
            <template slot="messages-list-nomore">
                No more upcoming messages. ⌚
            </template>
        </messages-list>
    </section>
</template>

<script lang="ts">
import MessagesList from "@/components/messages-list.vue";
import { Message, MessageStatus } from "@/models";
import messageService from "@/services/message.service";
import { Component } from "vue-property-decorator";
import MessagePageMixin from "./messages-page-mixin";

@Component({
    components: { MessagesList }
})
export default class UpcomingMessagesView extends MessagePageMixin {
    created() {
        this.getMessagesFn = messageService.getStagedMessages;
        this.getMessages();
    }

    async assignStatus(message: Message, status: MessageStatus) {
        await messageService.assignStatus(message, status);
        this.getMessages();
    }

    async deleteMessage(message: Message) {
        await messageService.deleteMessage(message);
        this.getMessages();
    }
}
</script>

<style scoped>
</style>
