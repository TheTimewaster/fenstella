<template>
  <button
    class="text-center font-bold transition-colors"
    :class="{
      'bg-gray-800 text-white hover:bg-gray-700': !inverted,
      'bg-gray-100 text-gray-800 hover:bg-gray-200': inverted,
      'size-10 px-0 py-3': isIconOnly,
      'px-4 py-2': !isIconOnly,
      'rounded-full': rounded,
      'rounded-lg': !rounded,
    }"
    @click="emit('click')"
  >
    <icon
      v-if="icon"
      :icon="icon"
      class="inline-block align-top"
      :class="{'mr-2': !isIconOnly}"
    />
    
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{
    icon?: string;
    label?: string;
    inverted?: boolean;
    rounded?: boolean;
  }>(),
  {
    inverted: false,
    rounded: false,
  },
);

const emit = defineEmits<{
  click: [];
}>();

const isIconOnly = computed(() => !props.label && props.icon);
</script>

<style scoped></style>
