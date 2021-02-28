<template>
    <section class="new-messages-view">
        <messages-list
            :messages="messages"
            :isLoading="isLoading"
            :endOfListReached="endOfListReached"
            @loadMore="getMoreMessages"
            @messageChanged="getMessages">
            <template slot="messages-list-empty">
                No new messages. ✨
            </template>
            <template slot="messages-list-nomore">
                No more new messages. ✨
            </template>
        </messages-list>
    </section>
</template>

<script lang="ts">
import { MessageStatus } from "@/models";
import messageService from "@/services/message.service";
import { Component } from "vue-property-decorator";
import MessagesList from "@/components/messages-list.vue";
import AppModal from "@/components/app-modal.vue";
import MessagePageMixin from "./messages-page-mixin";

@Component({
    components: {
        MessagesList,
        AppModal
    }
})
export default class NewMessagesView extends MessagePageMixin {
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

        this.getMessagesFn = messageService.getNewMessages;
        this.getMessages();
    }

    beforeDestroy() {
        messageService.closeObserver(this.OBSERVER_KEY);
    }
}
</script>

<style scoped lang="less">

</style>
