<template>
  <AuthPinLogin />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { error: authError } = await useFetch('/api/auth/me', {
  credentials: 'include',
})
if (!authError.value) {
  await navigateTo('/')
}
</script>
