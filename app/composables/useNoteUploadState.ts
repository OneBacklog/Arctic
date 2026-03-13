const _uploading = reactive<Record<string, boolean>>({})

export const useNoteUploadState = () => {
  const startUpload = (noteId: string) => { _uploading[noteId] = true }
  const endUpload = (noteId: string) => { delete _uploading[noteId] }
  const isUploading = (noteId: string) => !!_uploading[noteId]
  return { startUpload, endUpload, isUploading }
}
