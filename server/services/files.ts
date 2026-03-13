import { mkdirSync, unlinkSync, rmSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { nanoid } from 'nanoid'

export function getFilesBasePath(): string {
  const path = process.env.FILES_PATH
  if (!path) {
    throw new Error('FILES_PATH environment variable is required.')
  }
  return path
}

export function ensureFilesDir(subDir: string = ''): string {
  const dir = join(getFilesBasePath(), subDir)
  mkdirSync(dir, { recursive: true })
  return dir
}

export function generateStoragePath(originalName: string, noteId: string): string {
  const ext = extname(originalName)
  const id = nanoid()
  return join(noteId, `${id}${ext}`)
}

export function getAbsolutePath(storagePath: string): string {
  return join(getFilesBasePath(), storagePath)
}

export function deleteFile(storagePath: string): void {
  try {
    unlinkSync(getAbsolutePath(storagePath))
  } catch {
    // ignore if already gone
  }
}

export function deleteNoteDir(noteId: string): void {
  try {
    const dir = join(getFilesBasePath(), noteId)
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true })
  } catch {
    // ignore
  }
}

export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}
