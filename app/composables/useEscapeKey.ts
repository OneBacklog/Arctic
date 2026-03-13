/**
 * Calls `fn` when the Escape key is pressed.
 * Listener is automatically removed when the component unmounts.
 */
export function useEscapeKey(fn: () => void) {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') fn()
  }
  onMounted(() => document.addEventListener('keydown', handler))
  onUnmounted(() => document.removeEventListener('keydown', handler))
}
