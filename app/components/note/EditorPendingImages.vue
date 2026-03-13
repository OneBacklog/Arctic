<template>
  <div
    v-if="files.length > 0"
    class="grid gap-1 rounded-t-xl overflow-hidden"
    :class="files.length === 1 ? 'grid-cols-1' : 'grid-cols-2'"
  >
    <div
      v-for="(file, i) in files"
      :key="i"
      class="relative group"
    >
      <img
        :src="getUrl(file)"
        :alt="file.name"
        class="w-full object-cover"
        :class="files.length === 1 ? 'max-h-56' : 'h-32'"
      >

      <!-- Delete button (hover) -->
      <button
        v-if="confirmingIdx !== i"
        class="absolute top-1 right-1 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-nord-ember/80"
        title="Remove image"
        @click.stop="$emit('confirm', i)"
      >
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
        </svg>
      </button>

      <!-- Inline confirm overlay -->
      <div
        v-if="confirmingIdx === i"
        class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 rounded"
        @click.stop
      >
        <p class="text-white text-xs font-medium">Remove image?</p>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 text-xs bg-nord-ember text-white rounded-full hover:bg-nord-ember/80 transition-colors"
            @click.stop="$emit('remove', i)"
          >Remove</button>
          <button
            class="px-3 py-1 text-xs bg-nord-slate text-nord-snow rounded-full hover:bg-nord-graphite transition-colors"
            @click.stop="$emit('cancel-confirm')"
          >Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  files: File[]
  confirmingIdx: number | null
}>()

defineEmits<{
  remove: [index: number]
  confirm: [index: number]
  'cancel-confirm': []
}>()

const urlCache = new Map<File, string>()

const getUrl = (file: File): string => {
  if (!urlCache.has(file)) urlCache.set(file, URL.createObjectURL(file))
  return urlCache.get(file)!
}

watch(() => props.files, (newFiles) => {
  const newSet = new Set(newFiles)
  urlCache.forEach((url, file) => {
    if (!newSet.has(file)) { URL.revokeObjectURL(url); urlCache.delete(file) }
  })
})

onUnmounted(() => { urlCache.forEach((url) => URL.revokeObjectURL(url)); urlCache.clear() })
</script>
