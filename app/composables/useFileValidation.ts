const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export const useFileValidation = () => {
  const { show: showSnackbar } = useSnackbar()

  const validate = (files: File[]): File[] => {
    const oversized = files.filter(f => f.size > MAX_FILE_SIZE)
    if (oversized.length > 0) {
      showSnackbar('File is Too Large (Max. 100MB)', 'error')
    }
    return files.filter(f => f.size <= MAX_FILE_SIZE)
  }

  return { validate }
}
