<template>
    <section class="archived-messages-view">
        <div v-if="!isLoading && messages.length == 0" class="text-align-center">
            No archived messages. 😬
        </div>

        <messages-list v-else :messages="messages" @loadMore="getMoreMessages">
            <template v-slot="{item}">
                <button class="btn btn--secondary" @click="deleteMessage(item)">Delete</button>
            </template>
        </messages-list>
        <div class="mar-t--2x text-align-center">
            <template v-if="isLoading">Loading...</template>
            <template v-else-if="endOfListReached">No more archived messages. 👌</template>
        </div>
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
