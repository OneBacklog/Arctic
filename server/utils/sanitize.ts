/**
 * HTML-escape a plain text string.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * Sanitize a Meilisearch highlight string that contains <mark>...</mark> delimiters.
 * All content is HTML-escaped; only <mark> wrapper tags are preserved.
 *
 * This prevents XSS when rendering highlights with v-html.
 */
export function sanitizeHighlight(raw: string): string {
  const MARK_OPEN = '<mark>'
  const MARK_CLOSE = '</mark>'
  const result: string[] = []
  let remaining = raw

  while (remaining.length > 0) {
    const openIdx = remaining.indexOf(MARK_OPEN)
    if (openIdx === -1) {
      result.push(escapeHtml(remaining))
      break
    }
    if (openIdx > 0) result.push(escapeHtml(remaining.slice(0, openIdx)))
    remaining = remaining.slice(openIdx + MARK_OPEN.length)

    const closeIdx = remaining.indexOf(MARK_CLOSE)
    if (closeIdx === -1) {
      result.push(escapeHtml(remaining))
      break
    }
    result.push(`<mark>${escapeHtml(remaining.slice(0, closeIdx))}</mark>`)
    remaining = remaining.slice(closeIdx + MARK_CLOSE.length)
  }

  return result.join('')
}

/**
 * Sanitize an uploaded filename: strip path components and restrict to safe characters.
 * Spaces are replaced with `-`; unsafe symbols are removed.
 * If the name (excluding extension) is empty after sanitization, a random 8-char name is used.
 */
export function sanitizeFilename(filename: string): string {
  const base = filename.split(/[\\/]/).pop() || ''
  const dotIdx = base.lastIndexOf('.')
  const rawName = dotIdx > -1 ? base.slice(0, dotIdx) : base
  const ext = dotIdx > -1 ? base.slice(dotIdx) : ''

  const cleanName = rawName
    .replace(/ /g, '-')
    .replace(/[^\w\-.]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+/, '')
    .replace(/\.+$/, '')
  const safeName = cleanName || Math.random().toString(36).slice(2, 10)

  return safeName + ext
}
