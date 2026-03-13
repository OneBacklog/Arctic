export default defineEventHandler((event) => {
  setHeader(event, 'X-Frame-Options', 'SAMEORIGIN')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  setHeader(event, 'X-XSS-Protection', '1; mode=block')
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin')
  setHeader(event, 'Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
})
