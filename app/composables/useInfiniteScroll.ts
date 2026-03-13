// Watches a sentinel element at the bottom of the list.
// Calls `loadMore` when it enters the viewport.
export const useInfiniteScroll = (loadMore: () => void) => {
  const sentinel = ref<HTMLElement | null>(null)

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )
    if (sentinel.value) observer.observe(sentinel.value)
    onUnmounted(() => observer.disconnect())
  })

  return { sentinel }
}
