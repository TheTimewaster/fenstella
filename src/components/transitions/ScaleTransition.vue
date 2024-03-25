<template>
  <transition
    v-bind="transitions"
  >
    <slot />
  </transition>
</template>

<script setup lang="ts">
const transitions = {
  enterFromClass: /* tw */ 'scale-0',
  enterActiveClass: 'transition-transform duration-300 ease-out',
  enterToClass: 'scale-100',
  leaveFromClass: 'scale-100',
  leaveActiveClass: 'transition-transform duration-300 ease-out',
  leaveToClass: 'scale-0',
};
</script>

<style scoped>

</style>