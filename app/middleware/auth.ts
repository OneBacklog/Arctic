export default defineNuxtRouteMiddleware(async () => {
  // useRequestFetch forwards browser cookies during SSR (hard refresh),
  // falling back to plain $fetch on client-side navigation.
  const apiFetch = useRequestFetch()
  try {
    await apiFetch('/api/auth/me', { credentials: 'include' })
  } catch (e: any) {
    if (e?.status === 401) {
      return navigateTo('/login')
    }
  }
})
