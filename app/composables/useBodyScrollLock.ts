let lockCount = 0

const lock = () => {
  if (typeof document === 'undefined') return
  lockCount += 1
  if (lockCount === 1) {
    document.body.style.overflow = 'hidden'
  }
}

const unlock = () => {
  if (typeof document === 'undefined') return
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = ''
  }
}

export function useBodyScrollLock(active: Ref<boolean> | boolean = true) {
  const isActive = isRef(active) ? active : ref(!!active)

  watch(
    isActive,
    (value, prev) => {
      if (value === prev) return
      if (value) lock()
      else unlock()
    },
    { immediate: true }
  )

  onUnmounted(() => {
    if (isActive.value) unlock()
  })
}
