<template>
  <form class="relative flex-1 w-full" @submit.prevent="submit">
    <div
      class="flex items-center bg-nord-graphite rounded-xl overflow-hidden transition-all"
      :class="focused ? 'ring-2 ring-nord-aurora' : ''"
    >
      <!-- Search icon / submit button -->
      <button
        type="submit"
        class="w-10 h-10 flex items-center justify-center flex-shrink-0 hover:bg-nord-slate transition-colors"
        :title="searching ? 'Searching…' : 'Search'"
      >
        <svg v-if="!searching" class="w-5 h-5 text-nord-frost" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
        </svg>
        <svg v-else class="w-4 h-4 text-nord-aurora animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      </button>

      <input
        ref="inputEl"
        v-model="localQuery"
        type="text"
        placeholder="Search"
        class="flex-1 bg-transparent px-2 py-3 text-sm text-nord-snow outline-none placeholder-nord-frost min-w-0"
        @focus="focused = true"
        @blur="focused = false"
        @keydown.escape="clear"
      >

      <!-- Clear button -->
      <button
        v-if="localQuery || searchResults"
        type="button"
        class="w-10 h-10 flex items-center justify-center hover:bg-nord-slate transition-colors flex-shrink-0"
        title="Clear search"
        @click="clear"
      >
        <svg class="w-4 h-4 text-nord-frost" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18 18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
const { searchQuery, searchResults, searching, performSearch, clearSearch } = useSearch()
const route = useRoute()
const inputEl = ref<HTMLInputElement | null>(null)
const { searchFocusTrigger } = useAppShortcuts()

watch(searchFocusTrigger, () => {
  inputEl.value?.focus()
  inputEl.value?.select()
})

const localQuery = ref(searchQuery.value)
const focused = ref(false)

// Keep input in sync if cleared externally
watch(searchQuery, (v) => { if (!v) localQuery.value = '' })

const getContext = (): { context: 'notes' | 'archive' | 'trash'; labelId?: string } => {
  if (route.path === '/archive') return { context: 'archive' }
  if (route.path === '/trash') return { context: 'trash' }
  if (route.path.startsWith('/label/')) return { context: 'notes', labelId: route.params.id as string }
  return { context: 'notes' }
}

const submit = () => {
  const { context, labelId } = getContext()
  performSearch(localQuery.value, context, labelId)
}

const clear = () => {
  localQuery.value = ''
  clearSearch()
}
</script>
