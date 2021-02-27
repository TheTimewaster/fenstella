<template>
    <div class="app-modal">
        <template v-if="isShowing">
            <div class="app-modal__container">
                <div
                    ref="backdrop"
                    class="app-modal__backdrop"
                    @click="closeModal"
                ></div>
                <div ref="content" class="app-modal__content">
                    <div class="app-modal__body mar--2x pad--2x">
                        <slot name="modal-content"></slot>
                    </div>
                    <div class="app-modal__footer">
                        <slot name="modal-actions"></slot>
                        <button
                            class="btn btn--secondary--full full-width"
                            @click="closeModal"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Velocity, { VelocityElements } from "velocity-animate";

@Component
export default class AppModal extends Vue {
  isShowing = false;

  closeModal() {
      return this.$nextTick()
          .then(() => {
              (this.$refs.backdrop as HTMLDivElement).style.opacity = "1";
              (this.$refs.content as HTMLDivElement).style.bottom = "0";
          })
          .then(() => {
              const backdrop = this.$refs.backdrop as VelocityElements;
              const content = this.$refs.content as VelocityElements;
              return Promise.all([
                  Velocity(backdrop, { opacity: 0 }, { duration: 200 }).promise,
                  Velocity(content, { bottom: "-100%" }, { duration: 200 }).promise
              ]);
          })
          .then(() => {
              this.isShowing = false;
          });
  }

  showModal() {
      this.isShowing = true;

      return this.$nextTick()
          .then(() => {
              (this.$refs.backdrop as HTMLElement).style.opacity = "0";
              (this.$refs.content as HTMLElement).style.bottom = "-100%";
          })
          .then(() => {
              const backdrop = this.$refs.backdrop as VelocityElements;
              const content = this.$refs.content as VelocityElements;
              return Promise.all([
                  Velocity(backdrop, { opacity: 1 }, { duration: 200 }).promise,
                  Velocity(content, { bottom: "0" }, { duration: 200 }).promise
              ]);
          });
  }
}
</script>

<style lang="less">
.app-modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

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
            max-width: 480px;
            left: 50%;
            margin-left: -240px;
        }
    }
}
</style>
