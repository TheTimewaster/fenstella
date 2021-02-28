<template>
    <section class="archived-messages-view">
        <messages-list
            :messages="messages"
            :isLoading="isLoading"
            :endOfListReached="endOfListReached"
            :operations="['DELETE']"
            @loadMore="getMoreMessages"
            @messageChanged="getMessages">
            <template slot="messages-list-empty">
                No archived messages. 😬
            </template>
            <template slot="messages-list-nomore">
                No more archived messages. 👌
            </template>
        </messages-list>
    </section>
</template>
<script lang="ts">
import { Message } from "@/models";
import messageService from "@/services/message.service";
import Component from "vue-class-component";
import messagesList from "@/components/messages-list.vue";
import MessagePageMixin from "./messages-page-mixin";

@Component({
    components: { messagesList }
})
export default class ArchivedMessagesView extends MessagePageMixin {
    created() {
        this.getMessagesFn = messageService.getArchivedMessages;
        this.getMessages();
    }

    async deleteMessage(message: Message) {
        await messageService.deleteMessage(message);
        this.getMessages();
    }
}
</script>
