export type ImageUploadStatus = 'idle' | 'uploading' | 'success' | 'error'

export type ImageUploadError = {
  type: 'format' | 'size' | 'count' | 'totalSize' | 'decode' | 'upload'
  message: string
}

export type ImageFile = {
  id: string
  file: File
  previewUrl: string
  status: ImageUploadStatus
  error: ImageUploadError | null
  progress: number
  width?: number
  height?: number
}

export type ImageUploaderConfig = {
  maxFiles: number
  maxFileSize: number // bytes
  maxTotalSize: number // bytes
  acceptedFormats: Array<string>
  acceptedMimeTypes: Array<string>
}
