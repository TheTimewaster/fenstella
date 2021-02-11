<template>
    <section class="archived-messages-view">
        <div v-if="messages.length == 0" class="text-align-center">
            No upcoming messages. 🕖
        </div>

        <messages-list v-else :messages="messages">
            <template v-slot="{item}">
                <button class="btn btn--secondary" @click="deleteMessage(item)">Delete</button>
                <button class="btn btn--secondary" @click="assignStatus(item, 'DENIED')">Deny</button>
            </template>
        </messages-list>
    </section>
</template>

<script lang="ts">
import MessagesList from "@/components/messages-list.vue";
import { Message, MessageStatus } from "@/models";
import messageService from "@/services/message.service";
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: { MessagesList }
})
export default class UpcomingMessagesView extends Vue {
    messages: Array<Message> = [];

    created() {
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

    async getMessages() {
        this.messages = await messageService.getStagedMessages();
    }
}
</script>

<style scoped>

</style>
