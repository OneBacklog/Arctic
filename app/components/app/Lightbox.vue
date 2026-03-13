<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="lightboxOpen"
        class="fixed left-0 top-0 modal-viewport z-[200] bg-black/90 flex items-center justify-center"
        @click.self="close"
      >
        <!-- Top bar: filename left, actions right -->
        <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-10 bg-gradient-to-b from-black/60 to-transparent">
          <!-- Filename -->
          <span class="text-sm font-medium text-nord-snow truncate max-w-[50vw] select-none block" dir="rtl">
            {{ lightboxNames[lightboxIndex] || '' }}
          </span>
          <!-- Actions: download, delete, close -->
          <div class="flex items-center gap-2">
            <a
              :href="lightboxImages[lightboxIndex]"
              download
              class="w-10 h-10 flex items-center justify-center rounded-full bg-nord-obsidian/80 hover:bg-nord-graphite text-nord-snow transition-colors"
              title="Download"
              @click.stop="onDownload"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
            </a>
            <button
              v-if="lightboxAttachmentIds[lightboxIndex]"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-nord-obsidian/80 hover:bg-nord-ember/80 text-nord-snow transition-colors"
              title="Delete"
              @click.stop="confirmingDelete = true"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
              </svg>
            </button>
            <button
              class="w-10 h-10 flex items-center justify-center rounded-full bg-nord-obsidian/80 hover:bg-nord-graphite text-nord-snow transition-colors"
              @click="close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Prev button -->
        <button
          v-if="lightboxImages.length > 1 && lightboxIndex > 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-nord-obsidian/80 hover:bg-nord-graphite text-nord-snow transition-colors z-10"
          @click="prev"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
        </button>

        <!-- Image -->
        <img
          :src="lightboxImages[lightboxIndex]"
          class="max-w-[90vw] max-h-[90vh] object-contain select-none rounded-lg shadow-2xl"
          @click.stop
        >

        <!-- Next button -->
        <button
          v-if="lightboxImages.length > 1 && lightboxIndex < lightboxImages.length - 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-nord-obsidian/80 hover:bg-nord-graphite text-nord-snow transition-colors z-10"
          @click="next"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
          </svg>
        </button>

        <!-- Counter -->
        <div
          v-if="lightboxImages.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-nord-frost bg-nord-obsidian/70 px-3 py-1 rounded-full"
        >
          {{ lightboxIndex + 1 }} / {{ lightboxImages.length }}
        </div>

        <!-- Delete confirmation overlay -->
        <Transition name="fade">
          <div
            v-if="confirmingDelete"
            class="absolute inset-0 bg-black/60 flex items-center justify-center z-20"
            @click.self="confirmingDelete = false"
          >
            <div class="bg-nord-obsidian rounded-2xl p-6 w-full max-w-xs mx-4 shadow-2xl">
              <p class="text-nord-snow font-medium mb-1">Are You Sure?</p>
              <p class="text-nord-frost text-sm mb-5">The image will be permanently deleted from this note and disk.</p>
              <div class="flex gap-3 justify-end">
                <button
                  class="px-4 py-2 text-sm text-nord-ice hover:bg-nord-graphite rounded-lg transition-colors"
                  @click="confirmingDelete = false"
                >Cancel</button>
                <button
                  class="px-4 py-2 text-sm bg-nord-ember text-white rounded-lg hover:bg-nord-ember/80 transition-colors"
                  :disabled="deleting"
                  @click="onDeleteConfirmed"
                >{{ deleting ? 'Deleting…' : 'Delete' }}</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { lightboxOpen, lightboxImages, lightboxIndex, lightboxAttachmentIds, lightboxNames, close, prev, next, deleteCurrentImage } = useLightbox()
const { show: showSnackbar } = useSnackbar()

useBodyScrollLock(lightboxOpen)

const confirmingDelete = ref(false)
const deleting = ref(false)

const onDeleteConfirmed = async () => {
  deleting.value = true
  try {
    await deleteCurrentImage()
    confirmingDelete.value = false
  } finally {
    deleting.value = false
  }
}

const onDownload = () => {
  showSnackbar('Download Starting...')
}

useLightboxTouch(
  lightboxOpen,
  prev,
  next,
  close,
  confirmingDelete,
  () => { confirmingDelete.value = false }
)
</script>

<style scoped>
.lightbox-enter-active, .lightbox-leave-active { transition: opacity 0.2s; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
