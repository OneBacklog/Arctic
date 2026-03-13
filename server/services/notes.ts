import { getDb, schema } from '../database/index'
import { eq, asc, inArray } from 'drizzle-orm'

export async function getNotesWithMeta(noteIds: string[]) {
  if (noteIds.length === 0) return []
  const db = getDb()

  const rows = await db
    .select()
    .from(schema.notes)
    .where(inArray(schema.notes.id, noteIds))
    .all()

  const notesWithMeta = await Promise.all(
    rows.map(async (note) => {
      const [labelLinks, checklistItemsRaw, attachmentsRaw] = await Promise.all([
        db
          .select({ label: schema.labels })
          .from(schema.noteLabels)
          .innerJoin(schema.labels, eq(schema.noteLabels.labelId, schema.labels.id))
          .where(eq(schema.noteLabels.noteId, note.id))
          .orderBy(asc(schema.labels.position))
          .all(),
        note.type === 'checklist'
          ? db
              .select()
              .from(schema.checklistItems)
              .where(eq(schema.checklistItems.noteId, note.id))
              .orderBy(asc(schema.checklistItems.position))
              .all()
          : Promise.resolve([]),
        db.select().from(schema.attachments).where(eq(schema.attachments.noteId, note.id)).all(),
      ])

      return {
        ...note,
        labels: labelLinks.map((l) => l.label),
        checklistItems: checklistItemsRaw,
        attachments: attachmentsRaw,
      }
    })
  )

  // Preserve Meilisearch ranking order
  const idOrder = new Map(noteIds.map((id, i) => [id, i]))
  return notesWithMeta.sort((a, b) => (idOrder.get(a.id) ?? 999) - (idOrder.get(b.id) ?? 999))
}
