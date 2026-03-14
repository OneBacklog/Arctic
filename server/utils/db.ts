import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

// ─── Schema ──────────────────────────────────────────────────────────────────

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
})

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['text', 'checklist'] }).notNull().default('text'),
  title: text('title').notNull().default(''),
  content: text('content').notNull().default(''),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  isTrashed: integer('is_trashed', { mode: 'boolean' }).notNull().default(false),
  trashedAt: text('trashed_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
}, (t) => ({
  isArchivedIdx: index('notes_is_archived_idx').on(t.isArchived),
  isTrashedIdx: index('notes_is_trashed_idx').on(t.isTrashed),
  updatedAtIdx: index('notes_updated_at_idx').on(t.updatedAt),
}))

export const labels = sqliteTable('labels', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  position: real('position').notNull().default(0),
  createdAt: text('created_at').notNull(),
})

export const noteLabels = sqliteTable('note_labels', {
  noteId: text('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  labelId: text('label_id').notNull().references(() => labels.id, { onDelete: 'cascade' }),
}, (t) => ({
  noteIdIdx: index('note_labels_note_id_idx').on(t.noteId),
  labelIdIdx: index('note_labels_label_id_idx').on(t.labelId),
}))

export const checklistItems = sqliteTable('checklist_items', {
  id: text('id').primaryKey(),
  noteId: text('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  text: text('text').notNull().default(''),
  isChecked: integer('is_checked', { mode: 'boolean' }).notNull().default(false),
  position: real('position').notNull().default(0),
}, (t) => ({
  noteIdIdx: index('checklist_items_note_id_idx').on(t.noteId),
}))

export const attachments = sqliteTable('attachments', {
  id: text('id').primaryKey(),
  noteId: text('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  storagePath: text('storage_path').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull().default(0),
  thumbnailPath: text('thumbnail_path'),
  position: real('position').notNull().default(0),
  createdAt: text('created_at').notNull(),
}, (t) => ({
  noteIdIdx: index('attachments_note_id_idx').on(t.noteId),
}))

export type Note = typeof notes.$inferSelect
export type NoteInsert = typeof notes.$inferInsert
export type Label = typeof labels.$inferSelect
export type ChecklistItem = typeof checklistItems.$inferSelect
export type Attachment = typeof attachments.$inferSelect

export const schema = { settings, notes, labels, noteLabels, checklistItems, attachments }

// ─── Database ─────────────────────────────────────────────────────────────────

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (_db) return _db

  const dbPath = process.env.DATABASE_PATH
  if (!dbPath) {
    throw new Error('DATABASE_PATH environment variable is required.')
  }
  mkdirSync(dirname(dbPath), { recursive: true, mode: 0o700 })

  const sqlite = new Database(dbPath)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')

  _db = drizzle(sqlite, { schema })
  return _db
}

export function runMigrations() {
  const db = getDb()
  migrate(db, { migrationsFolder: './server/database/migrations' })
}
