<template>
    <div class="app-modal">
        <transition
            @beforeEnter="beforeEnterTransition"
            @enter="enterTransition"
            @leave="leaveTransition"
        >
            <div v-if="isSelfVisible" class="app-modal__container">
                <div
                    ref="backdrop"
                    class="app-modal__backdrop"
                    @click="commitClose"
                ></div>
                <div ref="content" class="app-modal__content">
                    <div v-if="contentComponent != null" class="app-modal__body mar--2x pad--2x">
                        <component :is="contentComponent" v-bind="componentProps"></component>
                    </div>
                    <div class="app-modal__footer">
                        <slot name="modal-actions"></slot>
                        <button
                            class="btn btn--secondary-fill full-width"
                            @click="commitClose"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Velocity, { VelocityCallbackFn, VelocityElements } from "velocity-animate";
import { MutationTypes } from "@/store/mutation-types";

@Component
export default class AppModal extends Vue {
    isSelfVisible = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contentComponent: any | null = null;

    get isVisible() {
        return this.$store.state.modal.isVisible;
    }

    get componentProps() {
        return this.$store.state.modal.component.props;
    }

    commitClose() {
        this.$store.commit("modal/" + MutationTypes.MODAL_HIDE);
    }

    beforeEnterTransition() {
        (this.$refs.backdrop as HTMLElement).style.opacity = "0";
        (this.$refs.content as HTMLElement).style.bottom = "-100%";
    }

    enterTransition(el: Element, done: Function) {
        const backdrop = this.$refs.backdrop as VelocityElements;
        Velocity(backdrop, { opacity: 1 }, { duration: 200 });

        const content = this.$refs.content as VelocityElements;
        Velocity(content, { bottom: "0%" }, { duration: 300, complete: done as VelocityCallbackFn });
    }

    leaveTransition(el: Element, done: Function) {
        const content = this.$refs.content as VelocityElements;
        Velocity(content, { bottom: "-100%" }, { duration: 300 });

        const backdrop = this.$refs.backdrop as VelocityElements;
        Velocity(backdrop, { opacity: 0 }, { duration: 200, complete: done as VelocityCallbackFn });
    }

    @Watch("isVisible")
    async onIsVisibleChanged() {
        const body = document.querySelector("body");
        if (this.isVisible) {
            this.contentComponent = Vue.component("modal-confirm", async() => await import(`@/components/modals/${this.$store.state.modal.component.name}`));
            this.isSelfVisible = true;
            if (body == null) return;
            body.classList.add("overflow-hidden");
        } else {
            this.isSelfVisible = false;
            if (body == null) return;
            body.classList.remove("overflow-hidden");
        }
    }
}
</script>

<style scoped lang="less">
.app-modal {
    &__container {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }

    &__backdrop {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }

    &__content {
        position: absolute;
        width: 100%;
        bottom: 0;
    }

    &__body {
        border-radius: 4px;
        background-color: white;
    }

    &__footer {
        margin: 8px 16px 16px 16px;
    }

    .full-width {
        width: 100%;
    }

    @media screen and (min-width: 1024px) {
        .app-modal__content {
            max-width: 640px;
            left: 50%;
            margin-left: -320px;
        }
    }
}
</style>
