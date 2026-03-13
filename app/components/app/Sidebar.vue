<template>
  <div>
    <!-- Mobile overlay — covers full screen including header -->
    <Transition name="fade">
      <div
        v-if="open === true"
        class="fixed inset-0 bg-black/30 z-20 md:hidden"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Sidebar — always visible, width toggles -->
    <aside
      class="fixed top-0 left-0 bottom-0 z-30 bg-nord-mist dark:bg-nord-obsidian flex flex-col overflow-hidden pt-16"
      :class="[asideWidthCls, animated ? 'transition-[width] duration-300 ease-in-out' : '']"
    >
      <!-- Fixed nav items (never scroll) -->
      <nav class="flex-shrink-0 pt-2">
        <!-- All Notes -->
        <NuxtLink to="/" class="flex items-center h-12 cursor-pointer">
          <div :class="innerCls($route.path === '/')">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>
            </svg>
            <span :class="labelCls">All Notes</span>
          </div>
        </NuxtLink>

        <!-- Archive -->
        <NuxtLink to="/archive" class="flex items-center h-12 cursor-pointer">
          <div :class="innerCls($route.path === '/archive')">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>
            </svg>
            <span :class="labelCls">Archive</span>
          </div>
        </NuxtLink>

        <!-- Trash -->
        <NuxtLink to="/trash" class="flex items-center h-12 cursor-pointer">
          <div :class="innerCls($route.path === '/trash')">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
            </svg>
            <span :class="labelCls">Trash</span>
          </div>
        </NuxtLink>

        <!-- Divider -->
        <div class="border-t border-nord-ice dark:border-nord-graphite my-2 mx-3" />

        <!-- Manage Labels -->
        <button class="flex items-center h-12 w-full cursor-pointer" @click="showLabelManager = true">
          <div :class="innerCls(false)">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
            </svg>
            <span :class="labelCls">Manage Labels</span>
          </div>
        </button>
      </nav>

      <!-- Scrollable labels list -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden">
        <NuxtLink
          v-for="label in labels"
          :key="label.id"
          :to="`/label/${label.id}`"
          class="flex items-center h-12 cursor-pointer"
        >
          <div :class="innerCls($route.params.id === label.id)">
            <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 6h.008v.008H6V6z"/>
            </svg>
            <span :class="[labelCls, 'truncate']">{{ label.name }}</span>
          </div>
        </NuxtLink>
      </div>

    </aside>

    <LabelManager v-if="showLabelManager" @close="showLabelManager = false" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean | null; animated?: boolean }>()
const emit = defineEmits<{ close: [] }>()

const { labels } = useLabels()
const showLabelManager = ref(false)

// Lock body scroll on mobile only when sidebar is open
const isMobile = ref(false)
const updateIsMobile = () => {
  if (typeof window === 'undefined') return
  isMobile.value = window.innerWidth < 768
}
onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile, { passive: true })
})
onUnmounted(() => {
  if (typeof window !== 'undefined') window.removeEventListener('resize', updateIsMobile)
})
const isMobileSidebarOpen = computed(() => props.open === true && isMobile.value)
useBodyScrollLock(isMobileSidebarOpen)

// Close mobile sidebar on Escape
useEscapeKey(() => { if (props.open === true) emit('close') })

const asideWidthCls = computed(() => {
  if (props.open === null) return 'w-16 md:w-64'
  return props.open ? 'w-64' : 'w-16'
})

const innerCls = (active: boolean) => [
  'flex items-center h-12 flex-1 mx-2 pl-[14px] pr-3 rounded-full transition-colors duration-200',
  active
    ? 'bg-nord-blue/20 dark:bg-nord-blue/30 text-nord-blue dark:text-nord-aurora font-medium'
    : 'text-nord-obsidian dark:text-nord-ice hover:bg-nord-ice dark:hover:bg-nord-graphite',
]

const labelCls = computed(() => [
  'text-sm whitespace-nowrap overflow-hidden transition-[max-width,opacity,margin] duration-300 ease-in-out',
  props.open === null
    ? 'max-w-0 opacity-0 md:max-w-[180px] md:opacity-100 md:ml-3'
    : props.open ? 'max-w-[180px] opacity-100 ml-3' : 'max-w-0 opacity-0',
])

// pl-[20px]: centers the 8px dot in the 48px-wide pill (mx-2 on w-16 sidebar)
// pl-3: standard left padding when expanded and text is visible
</script>

<style scoped>
@reference "tailwindcss";

.nav-icon {
  @apply w-5 h-5 flex-shrink-0;
}
</style>
