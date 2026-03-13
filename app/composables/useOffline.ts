export const useOffline = () => {
  const isOffline = useState<boolean>('is-offline', () => false)

  if (import.meta.client) {
    isOffline.value = !navigator.onLine
    const onOnline = () => { isOffline.value = false }
    const onOffline = () => { isOffline.value = true }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    onUnmounted(() => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    })
  }

  return { isOffline: readonly(isOffline) }
}
