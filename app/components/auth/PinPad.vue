<template>
  <div class="grid grid-cols-3 gap-6 w-full max-w-[260px] mx-auto">
    <button
      v-for="key in keys"
      :key="key"
      type="button"
      class="w-full min-w-0 aspect-square rounded-full border border-nord-graphite bg-nord-obsidian text-nord-snow text-base font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-nord-aurora flex items-center justify-center leading-none select-none appearance-none overflow-hidden p-1.5 active:scale-[0.94] active:bg-nord-graphite"
      :class="{
        'col-start-2': key === '0',
        'col-start-3': key === 'backspace',
      }"
      :disabled="disabled || key === ''"
      @click="onKeyPress(key)"
    >
      <span v-if="key !== 'backspace'">{{ key }}</span>
      <svg
        v-else
        class="w-5 h-5 -translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 9l3 3-3 3m3-3H9m-6 0l6.75-7.5A1.5 1.5 0 0110.86 4.5h9.64a1.5 1.5 0 011.5 1.5v12a1.5 1.5 0 01-1.5 1.5h-9.64a1.5 1.5 0 01-1.11-.5L3 12z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{ press: [key: string] }>()

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace']

const onKeyPress = (key: string) => {
  if (!key || props.disabled) return
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(12)
  }
  emit('press', key)
}

</script>

<style scoped>
.pad-press {
  animation: pad-press 120ms ease-out;
}

@keyframes pad-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.96); }
  100% { transform: scale(1); }
}
</style>
