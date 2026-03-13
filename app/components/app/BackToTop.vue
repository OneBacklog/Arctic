<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <button
      v-if="showButton"
      class="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-nord-blue hover:bg-nord-frost text-white shadow-lg flex items-center justify-center transition-colors duration-150"
      aria-label="Back to top"
      @click="scrollToTop"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
const THRESHOLD = 1000

const showButton = ref(false)

const onScroll = () => {
  showButton.value = window.scrollY > THRESHOLD
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>
