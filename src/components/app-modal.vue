<template>
    <div class="app-modal">
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
                        class="btn btn--secondary--full full-width"
                        @click="commitClose"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Velocity, { VelocityElements } from "velocity-animate";
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

    async closeModal() {
        (this.$refs.backdrop as HTMLDivElement).style.opacity = "1";
        (this.$refs.content as HTMLDivElement).style.bottom = "0";

        const content = this.$refs.content as VelocityElements;
        await Velocity(content, { bottom: "-100%" }, { duration: 250 }).promise;

        const backdrop = this.$refs.backdrop as VelocityElements;
        await Velocity(backdrop, { opacity: 0 }, { duration: 100 }).promise;
        this.isSelfVisible = false;
    }

    async showModal() {
        this.isSelfVisible = true;

        await this.$nextTick();
        (this.$refs.backdrop as HTMLElement).style.opacity = "0";
        (this.$refs.content as HTMLElement).style.bottom = "-100%";

        const backdrop = this.$refs.backdrop as VelocityElements;
        await Velocity(backdrop, { opacity: 1 }, { duration: 100 }).promise;

        const content = this.$refs.content as VelocityElements;
        await Velocity(content, { bottom: "0" }, { duration: 250 }).promise;
    }

    @Watch("isVisible")
    async onIsVisibleChanged() {
        if (this.isVisible) {
            this.contentComponent = Vue.component("modal-confirm", async() => await import(`@/components/modals/${this.$store.state.modal.component.name}`));
            this.showModal();
        } else {
            this.closeModal();
        }
    }
}
</script>

<style scoped lang="less">
.app-modal {
  &__backdrop {
    width: 100vw;
    height: 100vh;
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
