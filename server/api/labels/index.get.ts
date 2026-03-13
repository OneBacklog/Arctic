import { getDb, schema } from '../../utils/db'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = getDb()
  const rows = await db.select().from(schema.labels).orderBy(asc(schema.labels.position), asc(schema.labels.createdAt)).all()
  return { labels: rows }
})
