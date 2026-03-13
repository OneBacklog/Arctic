<template>
  <div class="mt-2 space-y-1">
    <div
      v-for="att in attachments"
      :key="att.id"
      class="flex items-center gap-2 group px-2 h-9 rounded-lg hover:bg-nord-ice dark:hover:bg-nord-graphite/50"
    >
      <svg class="w-4 h-4 text-nord-slate dark:text-nord-frost flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13"/>
      </svg>
      <a
        :href="`/api/files/${att.id}?download=1`"
        target="_blank"
        rel="noopener noreferrer"
        class="flex-1 text-xs text-nord-slate dark:text-nord-ice truncate hover:underline"
        @click.stop.prevent="openAttachment(att)"
      >
        {{ att.filename }}
      </a>

      <!-- Inline confirmation -->
      <template v-if="confirmingId === att.id">
        <button class="text-xs text-nord-slate dark:text-nord-frost hover:underline" @click.stop="confirmingId = null">Cancel</button>
        <button class="text-xs text-nord-ember font-medium hover:underline" @click.stop="$emit('delete', att.id); confirmingId = null">Delete</button>
      </template>
      <template v-else>
        <span class="text-xs text-nord-slate dark:text-nord-frost">{{ formatSize(att.size) }}</span>
        <button
          v-if="deletable"
          class="w-6 h-6 flex items-center justify-center rounded-full text-nord-ember hover:bg-nord-ember/10 transition-all flex-shrink-0"
          title="Delete"
          @click.stop="confirmingId = att.id"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Attachment } from '~/composables/types'
defineProps<{ attachments: Attachment[]; deletable?: boolean }>()
defineEmits<{ delete: [id: string] }>()

const confirmingId = ref<string | null>(null)
const { show: showSnackbar } = useSnackbar()
const isStandalone = computed(() => {
  if (process.server) return false
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
})

const openAttachment = (att: Attachment) => {
  showSnackbar('Download Starting...')
  const url = `/api/files/${att.id}?download=1`
  if (isStandalone.value) {
    const link = document.createElement('a')
    link.href = url
    link.download = att.filename
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
    return
  }
  window.open(url, '_blank', 'noopener')
}
</script>
