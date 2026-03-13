/**
 * Reusable drag-and-touch sort logic.
 * Shared by NoteChecklist and LabelManager.
 */
export function useDragSort<T>(options: {
  getItems: () => T[]
  onReorder: (items: T[]) => void
}) {
  const dragIdx = ref<number | null>(null)
  const dragOverIdx = ref<number | null>(null)

  const onDragStart = (idx: number) => { dragIdx.value = idx }
  const onDragOver = (idx: number) => { dragOverIdx.value = idx }
  const onDragEnd = () => { dragIdx.value = null; dragOverIdx.value = null }

  const performReorder = (from: number, to: number) => {
    const items = [...options.getItems()]
    const [moved] = items.splice(from, 1)
    items.splice(to, 0, moved!)
    options.onReorder(items)
  }

  const onDrop = (targetIdx: number) => {
    const from = dragIdx.value
    if (from !== null && from !== targetIdx) performReorder(from, targetIdx)
    onDragEnd()
  }

  let touchMoveHandler: ((e: TouchEvent) => void) | null = null

  const startTouchDrag = (idx: number) => {
    dragIdx.value = idx

    touchMoveHandler = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]!
      const el = document.elementFromPoint(touch.clientX, touch.clientY)
      const row = el?.closest('[data-drag-idx]') as HTMLElement | null
      if (row) {
        const rowIdx = parseInt(row.dataset.dragIdx ?? '-1')
        if (rowIdx >= 0) dragOverIdx.value = rowIdx
      }
    }

    const touchEndHandler = () => {
      window.removeEventListener('touchmove', touchMoveHandler!)
      if (dragOverIdx.value !== null && dragIdx.value !== null && dragOverIdx.value !== dragIdx.value) {
        performReorder(dragIdx.value, dragOverIdx.value)
      }
      onDragEnd()
      touchMoveHandler = null
    }

    window.addEventListener('touchmove', touchMoveHandler, { passive: false })
    window.addEventListener('touchend', touchEndHandler, { once: true })
  }

  onUnmounted(() => {
    if (touchMoveHandler) window.removeEventListener('touchmove', touchMoveHandler)
  })

  return { dragOverIdx: readonly(dragOverIdx), onDragStart, onDragOver, onDrop, onDragEnd, startTouchDrag }
}
