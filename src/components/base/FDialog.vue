<template>
  <teleport to="body">
    <fade-transition
      @after-enter="isBodyOpened = true"
    >
      <div
        v-if="isOpened"
        class="fixed inset-0 z-50 flex items-end justify-center bg-black/60 md:items-center"
      >
        <transition
          enter-from-class="translate-y-full md:translate-y-0 md:opacity-0 md:scale-95"
          enter-active-class="transition ease-out duration-300"
          enter-to-class="translate-y-0 md:opacity-100 md:scale-100"
          leave-from-class="translate-y-0 md:opacity-100 md:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-to-class="translate-y-full md:translate-y-0 md:opacity-0 md:scale-95"
        >
          <div
            v-if="isBodyOpened"
            ref="modalBody"
            class="absolute w-full rounded-lg bg-white p-4 shadow-lg md:max-w-screen-sm md:p-8 dark:bg-gray-800"
            role="dialog"
          >
            <f-button
              icon="material-symbols:close"
              rounded
              class="absolute -top-4 right-4"
              @click="handleClose"
            />
            <div class="relative py-2">
              <slot name="header">
                <span class="text-lg font-bold">{{ title }}</span>
              </slot>
            </div>
            <slot />
            <slot name="footer">
            </slot>
          </div>
        </transition>
      </div>
    </fade-transition>
  </teleport>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { nextTick, ref } from 'vue';
import FButton from './FButton.vue';
import FadeTransition from '@/components/transitions/FadeTransition.vue';

withDefaults(
  defineProps<{
    title?: string;
  }>(),
  {
    title: 'Dialog',
  },
);

const isOpened = defineModel<boolean>('modelValue', {
  default: false,
});

const modalBody = ref<HTMLElement | null>(null);
const isBodyOpened = ref(false);
const handleClose = async () => {
  isBodyOpened.value = false;

  await nextTick();
  isOpened.value = false;
};
onClickOutside(modalBody, () => {
  handleClose();
});
</script>

<style scoped>

</style>