<template>
    <div class="messages-list" ref="messagesList">
        <div v-if="!isLoading && messages.length === 0" class="mar-t--2x text-align-center">
            <slot name="messages-list-empty">
                No messages.
            </slot>
        </div>
        <transition-group
            name="list"
            tag="section"
            :css="false"
            @beforeEnter="beforeEnter"
            @enter="enter"
            @leave="leave"
        >
            <div
                class="messages-item"
                :class="{'messages-item--denied': item.messageStatus === 'DENIED'}"
                v-for="(item, index) in messages"
                :key="item.id"
                :data-index="index"
            >
                <div class="overline mar-b">{{ item.timestamp | timeDelta(currentTimestamp) }}</div>
                <h5>{{item.content}}</h5>
                <div class="messages-item__actions">
                    <button v-if="operations.indexOf('DELETE') >= 0" class="btn btn--secondary" @click="deleteMessage(item)">Delete</button>
                    <button v-if="operations.indexOf('DENY') >= 0"  class="btn btn--secondary" @click="assignStatus(item, 'DENIED')">Deny</button>
                    <button v-if="operations.indexOf('STAGE') >= 0" class="btn btn--primary" @click="stageMessage(item, 'STAGED')">Publish</button>
                </div>
            </div>
        </transition-group>
        <div class="mar-t--2x text-align-center">
            <template v-if="isLoading">Loading...</template>
            <template v-else-if="endOfListReached && messages.length > 0">
                <slot name="messages-list-nomore">
                    No more messages.
                </slot>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Message, MessageStatus } from "@/models";
import { Component, Prop, Vue } from "vue-property-decorator";
import { debounce } from "@/utilites";
import messageService from "@/services/message.service";
import Velocity, { VelocityCallbackFn, VelocityElements } from "velocity-animate";

@Component
export default class MessagesList extends Vue {
    @Prop({ type: Array, default: () => [] }) messages!: Array<Message>;
    @Prop({ type: Boolean, default: true }) isLoading!: boolean;
    @Prop({ type: Boolean, default: true }) endOfListReached!: boolean;
    @Prop({ type: Array, default: () => ["DELETE", "DENY", "STAGE"] }) operations!: Array<string>;

    currentTimestamp: number = new Date().valueOf();
    scrollDebounceFn: (event: Event) => void = () => undefined;

    scrollHandler() {
        const messagesList = this.$refs.messagesList as HTMLDivElement;
        if (messagesList.getBoundingClientRect().bottom < window.innerHeight) {
            this.$emit("loadMore");
        }
    }

    async assignStatus(message: Message, status: MessageStatus) {
        await messageService.assignStatus(message, status);
        this.$emit("messageChanged", message);
    }

    async stageMessage(message: Message) {
        this.$store.dispatch("modal/showModal", {
            name: "modal-message-confirm.vue",
            props: {
                text: "Are you sure you want to publish the message?",
                button: {
                    content: "Publish",
                    action: async() => {
                        await this.assignStatus(message, MessageStatus.STAGED);
                        this.$store.dispatch("modal/hideModal");
                    }
                }
            }
        });
    }

    async deleteMessage(message: Message) {
        this.$store.dispatch("modal/showModal", {
            name: "modal-message-confirm.vue",
            props: {
                text: "Are you sure you want to delete the message?",
                button: {
                    content: "Delete",
                    action: async() => {
                        await messageService.deleteMessage(message);
                        this.$emit("messageChanged", message);
                        this.$store.dispatch("modal/hideModal");
                    }
                }
            }
        });
    }

    beforeEnter(el: HTMLElement) {
        el.style.opacity = "0";
    }

    enter(el: HTMLElement, done: Function) {
        if (el.dataset.index == null) return;
        const delay = parseInt(el.dataset.index) * 150;
        setTimeout(function() {
            Velocity(el as VelocityElements, { opacity: 1 }, { complete: done as VelocityCallbackFn });
        }, delay);
    }

    leave(el: HTMLElement, done: Function) {
        Velocity(el as VelocityElements, { opacity: 0 }, { complete: done as VelocityCallbackFn });
    }

    mounted() {
        this.scrollDebounceFn = debounce(this.scrollHandler, 200);
        window.addEventListener("scroll", this.scrollDebounceFn);
    }

    beforeDestroy() {
        window.removeEventListener("scroll", this.scrollDebounceFn);
    }
}
</script>

<style scoped lang="less">
.messages {
    &-item {
        padding: 1rem;
        border-radius: 0.5rem;
        background: #f5f5f5;
        margin-bottom: 0.5rem;

        &--denied {
            opacity: 0.4;
            transition: opacity 0.2s ease;

            &:hover,
            &:focus {
                opacity: 1;
            }
        }

        &__actions {
            margin: 0 -0.5rem;
            button {
                margin: 0 0.5rem;
            }
        }
    }
}
</style>
