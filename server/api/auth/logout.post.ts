export default defineEventHandler((event) => {
  setCookie(event, 'auth_token', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    secure: process.env.COOKIE_SECURE === 'true',
  })
  return { success: true }
})
