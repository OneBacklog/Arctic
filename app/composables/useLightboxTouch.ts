/**
 * Handles keyboard and touch/swipe navigation for the lightbox.
 */
export function useLightboxTouch(
  isOpen: Readonly<Ref<boolean>>,
  onPrev: () => void,
  onNext: () => void,
  onClose: () => void,
  isConfirming: Readonly<Ref<boolean>>,
  cancelConfirm: () => void
) {
  const SWIPE_THRESHOLD = 50

  const onKey = (e: KeyboardEvent) => {
    if (!isOpen.value) return
    if (e.key === 'Escape') {
      if (isConfirming.value) cancelConfirm()
      else onClose()
    }
    if (isConfirming.value) return
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }

  let touchStartX = 0
  const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0]?.clientX ?? 0 }
  const onTouchEnd = (e: TouchEvent) => {
    if (!isOpen.value || isConfirming.value) return
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX
    if (Math.abs(dx) < SWIPE_THRESHOLD) return
    if (dx < 0) onNext()
    else onPrev()
  }

  onMounted(() => {
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
  })
}
