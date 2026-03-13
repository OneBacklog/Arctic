import { runMigrations } from '../utils/db'
import { ensureNotesIndex } from '../utils/searchSvc'

export default defineNitroPlugin(async () => {
  try {
    runMigrations()
    console.log('[db] Migrations applied successfully')
  } catch (e) {
    console.error('[db] Migration failed:', e)
  }

  try {
    await ensureNotesIndex()
    console.log('[search] Meilisearch index ready')
  } catch (e) {
    console.warn('[search] Meilisearch not available, search will be disabled:', e)
  }
})
