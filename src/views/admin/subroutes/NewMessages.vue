<template>
    <section class="new-messages-view">
        <div v-if="messages.length == 0" class="text-align-center">
            No new messages. ✨
        </div>

        <messages-list v-else :messages="messages">
            <template v-slot="{item}">
                <button class="btn btn--secondary" @click="deleteMessage(item)">Delete</button>
                <button class="btn btn--secondary" @click="assignStatus(item, 'DENIED')">Deny</button>
                <button class="btn btn--primary" @click="assignStatus(item, 'STAGED')">Approve</button>
            </template>
        </messages-list>
    </section>
</template>

<script lang="ts">
import { Message, MessageStatus } from "@/models";
import messageService from "@/services/message.service";
import { Component, Vue } from "vue-property-decorator";
import messagesList from "@/components/messages-list.vue";

@Component({
    components: {
        messagesList
    }
})
export default class NewMessagesView extends Vue {
    messages: Array<Message> = [];
    readonly OBSERVER_KEY = "new_messages";

    created() {
        messageService.observeMessage({
            INSERT: message => {
                if (message.messageStatus === MessageStatus.NEW) {
                    this.messages.unshift(message);
                }
            },
            UPDATE: message => {
                if (message.messageStatus !== MessageStatus.NEW) {
                    this.getMessages();
                } else {
                    const index = this.messages.findIndex(m => m.id === message.id);
                    this.$set(this.messages, index, message);
                }
            },
            DELETE: message => {
                this.messages = this.messages.filter(m => m.id !== message.id);
            }
        }, this.OBSERVER_KEY, MessageStatus.NEW);
        this.getMessages();
    }

    async getMessages() {
        this.messages = await messageService.getNewMessages();
    }

    async assignStatus(message: Message, status: MessageStatus) {
        await messageService.assignStatus(message, status);
        this.getMessages();
    }

    deleteMessage(message: Message) {
        messageService.deleteMessage(message);
    }

    beforeDestroy() {
        messageService.closeObserver(this.OBSERVER_KEY);
    }
}
</script>

<style scoped lang="less">

</style>
