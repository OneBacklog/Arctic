export default defineNuxtPlugin(() => {
  const setViewportVars = () => {
    const vv = window.visualViewport
    const height = vv?.height ?? window.innerHeight
    const width = vv?.width ?? window.innerWidth
    const root = document.documentElement
    root.style.setProperty('--app-vh', `${height}px`)
    root.style.setProperty('--app-vw', `${width}px`)
  }

  setViewportVars()
  window.addEventListener('resize', setViewportVars, { passive: true })
  window.addEventListener('orientationchange', setViewportVars, { passive: true })
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setViewportVars, { passive: true })
    window.visualViewport.addEventListener('scroll', setViewportVars, { passive: true })
  }
})
