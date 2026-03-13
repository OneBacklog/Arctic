<template>
  <Teleport to="body">
    <Transition name="snackbar">
      <div
        v-if="queue.length > 0"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium min-w-[200px] max-w-[90vw]"
        :class="queue[0]?.type === 'error'
          ? 'bg-nord-ember text-white'
          : 'bg-nord-blue text-white'"
      >
        <span class="flex-1">{{ queue[0]?.message }}</span>
        <button
          class="hover:opacity-80 transition-opacity ml-2 text-lg leading-none text-white/70"
          @click="dismiss"
        >✕</button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { queue, dismiss } = useSnackbar()
</script>

<style scoped>
.snackbar-enter-active,
.snackbar-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.snackbar-enter-from,
.snackbar-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px);
}
</style>
