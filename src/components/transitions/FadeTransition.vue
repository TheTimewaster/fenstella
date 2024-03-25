<template>
  <transition
    v-bind="transitions"
  >
    <slot />
  </transition>
</template>

<script setup lang="ts">
const transitions = {
  enterFromClass: /* tw */ 'opacity-0',
  enterActiveClass: /* tw */ 'transition ease-out duration-300',
  enterToClass: /* tw */ 'opacity-100',
  leaveFromClass: /* tw */ 'opacity-100',
  leaveActiveClass: /* tw */ 'transition ease-in duration-200',
  leaveToClass: /* tw */ 'opacity-0',
};
</script>

<style scoped>

</style>