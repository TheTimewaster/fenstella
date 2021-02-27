<template>
    <section class="archived-messages-view">
        <div v-if="!isLoading && messages.length == 0" class="text-align-center">
            No upcoming messages. 🕖
        </div>

        <messages-list v-else :messages="messages" @loadMore="getMoreMessages">
            <template v-slot="{item}">
                <button class="btn btn--secondary" @click="deleteMessage(item)">Delete</button>
                <button class="btn btn--secondary" @click="assignStatus(item, 'DENIED')">Deny</button>
            </template>
        </messages-list>
        <div class="mar-t--2x text-align-center">
            <template v-if="isLoading">Loading...</template>
            <template v-else-if="endOfListReached">No more upcoming messages. ⌚</template>
        </div>
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
