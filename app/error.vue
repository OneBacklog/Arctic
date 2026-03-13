<template>
  <div />
</template>

<script setup lang="ts">
const error = useError()

const redirect = async () => {
  await clearError({ redirect: '/login' })
}

// Both SSR and client-side: redirect 401 to login immediately
if (error.value?.statusCode === 401) {
  await redirect()
} else {
  onMounted(async () => {
    if (error.value?.statusCode === 401) await redirect()
  })
}
</script>
