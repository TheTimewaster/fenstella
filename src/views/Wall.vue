<template>
    <div class="wall">
        <div class="wall-main d-flex flex-column flex-justify-center">
            <template v-if="!isLoading">
                <template v-if="message != null && message.content.length">
                    <transition
                        @beforeEnter="beforeEnterTransition"
                        @enter="enterTransition"
                        mode="out-in"
                        :css="false"
                    >
                        <h4 :key="message.timestamp">{{ message.content }}</h4>
                    </transition>
                </template>
                <template v-else>
                    No current message. 😬
                </template>
            </template>
        </div>

        <div class="wall-bottom d-flex">
            <button class="btn btn--primary" @click="enableFullscren">
                Fullscreen
            </button>
            <button class="btn btn--primary mar-l" @click="playTransition">
                Transition
            </button>
        </div>

        <div class="wall-info text-align-right d-flex flex-align-center">
            <img class="wall-info__img" src="@/assets/mobile-icon-white.png" alt="">
            <div class="mar-l">
                <span class="overline">SEND SMS TO</span>
                <h5 class="mar--none">+49 171 6984922</h5>
                <small>Info: fenestella.de</small>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Message, MessageStatus } from "@/models";
import messageService from "@/services/message.service";
import Velocity, { VelocityCallbackFn, VelocityElements } from "velocity-animate";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class WallView extends Vue {
    message: Message | null = null;
    isLoading = true;
    readonly OBSERVER_KEY = "published_message";

    async created() {
        messageService.observeMessage({
            INSERT: this.assignMessageContent,
            UPDATE: this.assignMessageContent,
            DELETE: () => undefined
        }, this.OBSERVER_KEY, MessageStatus.PUBLISHED);

        this.isLoading = true;
        const msg = await messageService.getLastPublishedMessage();
        if (msg != null) {
            this.assignMessageContent(msg);
        }
        this.isLoading = false;
    }

    enableFullscren() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    playTransition() {
        this.message = {
            timestamp: new Date().valueOf(),
            id: `${Math.random()}`,
            content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
            messageStatus: MessageStatus.PUBLISHED
        };
    }

    beforeEnterTransition(el: HTMLElement) {
        el.style.transform = "translateY(-200px)";
        el.style.opacity = "0";
    }

    enterTransition(el: HTMLElement, done: VelocityCallbackFn) {
        Velocity(el as VelocityElements, { opacity: 1, transform: ["translateY(20px)", "translateY(0)"] }, { duration: 200 });
        Velocity(el as VelocityElements, { transform: "translateY(0px)" }, { duration: 100, complete: done });
    }

    leaveTransition(el: HTMLElement, done: VelocityCallbackFn) {
        Velocity(el as VelocityElements, { opacity: 0, transform: "translateY(200px)" }, { duration: 200, complete: done });
    }

    assignMessageContent(message: Message) {
        this.message = message;
    }

    beforeDestroy() {
        messageService.closeObserver(this.OBSERVER_KEY);
    }
};
</script>
<style lang="less" scoped>
.wall {
    display: flex;
    flex-direction: column;
    &-main {
        text-align: center;
        flex: 1;
    }

    &-bottom {
        padding: 0.5rem;
    }

    &-info {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        align-items: center;

        h5 {
            margin: 0;
        }

        &__img {
            max-width: 2rem;
            max-height: 3rem;
            width: auto;
            height: auto;
        }
    }
}
</style>
