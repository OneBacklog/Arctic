export const useAuth = () => {
  const router = useRouter()

  const login = async (code: string) => {
    await $fetch('/api/auth/login', { method: 'POST', body: { code } })
    await router.push('/')
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await router.push('/login')
  }

  return { login, logout }
}
