import type { Attachment } from '~/composables/types'
import { toRef, computed } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

const IMAGE_EXTS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp',
])

const isImageAttachment = (att: Attachment) => {
  const mime = (att.mimeType || '').toLowerCase()
  if (mime === 'image/jpeg' || mime === 'image/jpg') return true
  if (mime === 'image/png') return true
  if (mime === 'image/gif') return true
  if (mime === 'image/webp') return true
  const dot = att.filename?.lastIndexOf('.') ?? -1
  if (dot === -1) return false
  const ext = att.filename.slice(dot).toLowerCase()
  return IMAGE_EXTS.has(ext)
}

export function splitAttachments(source: MaybeRefOrGetter<Attachment[]>) {
  const att = toRef(source)
  return {
    images: computed(() => att.value.filter((a) => isImageAttachment(a))),
    files: computed(() => att.value.filter((a) => !isImageAttachment(a))),
  }
}
