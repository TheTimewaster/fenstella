<template>
    <section class="new-messages-view">
        <div v-if="isLoading && messages.length == 0" class="text-align-center">
            No new messages. ✨
        </div>

        <messages-list v-else :messages="messages" @loadMore="getMoreMessages">
            <template v-slot="{item}">
                <button class="btn btn--secondary" @click="deleteMessage(item)">Delete</button>
                <button class="btn btn--secondary" @click="assignStatus(item, 'DENIED')">Deny</button>
                <button class="btn btn--primary" @click="stageMessage(item, 'STAGED')">Publish</button>
            </template>
        </messages-list>
        <div class="mar-t--2x text-align-center">
            <template v-if="isLoading">Loading...</template>
            <template v-else-if="endOfListReached">No more new messages. ✨</template>
        </div>

        <app-modal ref="modal">
            <template slot="modal-content">
                <div class="mar-b--2x">{{ confirmation.text }}</div>
                <div class="d-flex flex-justify-end"><button class="btn btn--primary" @click="confirmation.button.action">{{ confirmation.button.content }}</button></div>
            </template>
        </app-modal>
    </section>
</template>

<script lang="ts">
import { Message, MessageStatus } from "@/models";
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
    confirmation: ConfirmationModel = {
        text: "",
        button: {
            content: "Yes",
            action: () => undefined,
            disabled: false
        }
    };

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

    async assignStatus(message: Message, status: MessageStatus) {
        await messageService.assignStatus(message, status);
        await this.getMessages();
    }

    async stageMessage(message: Message) {
        const stageAction = async() => {
            this.confirmation.button.disabled = true;
            await this.assignStatus(message, MessageStatus.STAGED);
            await (this.$refs.modal as AppModal).closeModal();
        };
        this.confirmation = {
            text: "Are you sure you want to publish the message?",
            button: {
                content: "Publish",
                action: stageAction,
                disabled: false
            }
        };
        (this.$refs.modal as AppModal).showModal();
    }

    async deleteMessage(message: Message) {
        const deleteAction = async() => {
            this.confirmation.button.disabled = true;
            await messageService.deleteMessage(message);
            await (this.$refs.modal as AppModal).closeModal();
            this.getMessages();
        };
        this.confirmation = {
            text: "Are you sure you want to remove the message?",
            button: {
                content: "Remove",
                action: deleteAction,
                disabled: false
            }
        };
        (this.$refs.modal as AppModal).showModal();
    }

    beforeDestroy() {
        messageService.closeObserver(this.OBSERVER_KEY);
    }
}

declare type ConfirmationModel= {
    text: string;
    button: {
        content: string;
        action: Function;
        disabled: boolean;
    };
}
</script>

<style scoped lang="less">

</style>
