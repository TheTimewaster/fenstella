<template>
    <section class="archived-messages-view">
        <div v-if="messages.length == 0" class="text-align-center">
            No archived messages. 😬
        </div>

        <messages-list v-else :messages="messages">
            <template v-slot="{item}">
                <button class="btn btn--secondary" @click="deleteMessage(item)">Delete</button>
            </template>
        </messages-list>
    </section>
</template>
<script lang="ts">
import { Message } from "@/models";
import messageService from "@/services/message.service";
import Vue from "vue";
import Component from "vue-class-component";
import messagesList from "@/components/messages-list.vue";

@Component({
    components: { messagesList }
})
export default class ArchivedMessagesView extends Vue {
    messages: Array<Message> = [];

    created() {
        this.getMessages();
    }

    async getMessages() {
        this.messages = await messageService.getArchivedMessages();
    }

    async deleteMessage(message: Message) {
        await messageService.deleteMessage(message);
        this.getMessages();
    }
}
</script>
