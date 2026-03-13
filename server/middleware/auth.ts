import { signToken, verifyToken, SESSION_MAX_AGE_SECONDS } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const path = event.path

  // Public paths
  if (
    (path.startsWith('/api/auth/') && path !== '/api/auth/me') ||
    path.startsWith('/_nuxt/') ||
    path.startsWith('/__nuxt') ||
    path === '/api/health'
  ) return

  // Only protect /api/* routes
  if (!path.startsWith('/api/')) return

  const cookie = getCookie(event, 'auth_token')
  if (!cookie) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const payload = await verifyToken(cookie)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Sliding session: refresh token on each authenticated request
  const token = await signToken({ authenticated: true })
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
    secure: process.env.COOKIE_SECURE === 'true',
  })
})
