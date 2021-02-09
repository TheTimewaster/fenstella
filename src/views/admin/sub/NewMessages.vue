<template>
    <section class="new-messages-view">
        <div v-if="newMessages.length == 0">
            No new messages! ✨
        </div>
        <div class="messages-list" v-else>
            <div class="messages-item" v-for="item in newMessages" :key="item.id">
                <span>{{ item.timestamp | toDateTime }}</span>
                <p>{{item.content}}</p>
                <div class="messages-item__actions">
                    <button class="btn btn--secondary" @click="deleteMessage(item)">Delete</button>
                    <button class="btn btn--secondary" @click="assignStatus(item, 'DENIED')">Deny</button>
                    <button class="btn btn--primary" @click="assignStatus(item, 'PUBLISHED')">Approve</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { Message, MessageStatus } from "@/models";
import messageService from "@/services/message.service";
import { Component, Vue } from "vue-property-decorator";
const OBSERVER_KEY = "new_messages";

@Component({
    // All component options are allowed in here
    filters: {
        toDateTime: function(timestamp: number) {
            const format = Intl.DateTimeFormat("de-DE");
            return format.format(new Date(timestamp));
        }
    }
})
export default class extends Vue {
    messages: Array<Message> = [];

    get newMessages() {
        return this.messages.filter(m => m.messageStatus === MessageStatus.NEW);
    };

    created() {
        messageService.observeMessage({
            INSERT: message => {
                this.messages.unshift(message);
            },
            UPDATE: message => {
                const index = this.messages.findIndex(m => m.id === message.id);
                this.$set(this.messages, index, message);
            },
            DELETE: message => {
                this.messages = this.messages.filter(m => m.id !== message.id);
            }
        }, OBSERVER_KEY, MessageStatus.NEW);
        this.getMessages();
    }

    async getMessages() {
        this.messages = await messageService.getNewMessages();
    }

    async assignStatus(message: Message, status: MessageStatus) {
        const updated = await messageService.assignStatus(message, status);
        const index = this.messages.findIndex(m => m.id === message.id);
        this.$set(this.messages, index, updated);
    }

    deleteMessage(message: Message) {
        messageService.deleteMessage(message);
    }

    beforeDestroy() {
        messageService.closeObserver(OBSERVER_KEY);
    }
}
</script>

<style scoped lang="less">
.messages{
    &-item {
        padding: 16px;
    }
}
</style>
