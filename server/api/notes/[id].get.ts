import { getDb, schema } from '../../utils/db'
import { eq, asc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = getDb()
  const id = getRouterParam(event, 'id')!

  const note = await db.select().from(schema.notes).where(eq(schema.notes.id, id)).get()
  if (!note) throw createError({ statusCode: 404, statusMessage: 'Note not found' })

  const [labelLinks, checklistItemsRaw, attachmentsRaw] = await Promise.all([
    db
      .select({ label: schema.labels })
      .from(schema.noteLabels)
      .innerJoin(schema.labels, eq(schema.noteLabels.labelId, schema.labels.id))
      .where(eq(schema.noteLabels.noteId, id))
      .all(),
    db
      .select()
      .from(schema.checklistItems)
      .where(eq(schema.checklistItems.noteId, id))
      .orderBy(asc(schema.checklistItems.position))
      .all(),
    db
      .select()
      .from(schema.attachments)
      .where(eq(schema.attachments.noteId, id))
      .orderBy(asc(schema.attachments.position), asc(schema.attachments.createdAt))
      .all(),
  ])

  return {
    ...note,
    labels: labelLinks.map((l) => l.label),
    checklistItems: checklistItemsRaw,
    attachments: attachmentsRaw,
  }
})
