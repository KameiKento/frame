import type { ImageUploadError, ImageUploaderConfig } from './types'

export const defaultConfig: ImageUploaderConfig = {
  maxFiles: 10,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxTotalSize: 50 * 1024 * 1024, // 50MB
  acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
  acceptedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
}

export function validateImageFile(
  file: File,
  config: ImageUploaderConfig = defaultConfig,
): { valid: boolean; error: ImageUploadError | null } {
  // MIME typeチェック
  if (!config.acceptedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: {
        type: 'format',
        message: `対応していない形式です。許可されている形式: ${config.acceptedFormats.join(', ')}`,
      },
    }
  }

  // 拡張子チェック
  const extension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf('.'))
  if (!config.acceptedFormats.includes(extension)) {
    return {
      valid: false,
      error: {
        type: 'format',
        message: `対応していない拡張子です。許可されている拡張子: ${config.acceptedFormats.join(', ')}`,
      },
    }
  }

  // サイズチェック
  if (file.size > config.maxFileSize) {
    const maxSizeMB = (config.maxFileSize / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: {
        type: 'size',
        message: `ファイルサイズが大きすぎます。最大サイズ: ${maxSizeMB}MB`,
      },
    }
  }

  return { valid: true, error: null }
}

export function validateImageFiles(
  files: Array<File>,
  existingCount: number = 0,
  existingTotalSize: number = 0,
  config: ImageUploaderConfig = defaultConfig,
): {
  valid: boolean
  errors: Array<{ file: File; error: ImageUploadError }>
  validFiles: Array<File>
} {
  const errors: Array<{ file: File; error: ImageUploadError }> = []
  const validFiles: Array<File> = []

  // 枚数チェック
  const totalCount = existingCount + files.length
  if (totalCount > config.maxFiles) {
    const excess = totalCount - config.maxFiles
    files.forEach((file) => {
      errors.push({
        file,
        error: {
          type: 'count',
          message: `画像の枚数が上限を超えています。最大: ${config.maxFiles}枚（あと${excess}枚削除してください）`,
        },
      })
    })
    return { valid: false, errors, validFiles }
  }

  // 合計サイズチェック
  const newTotalSize = files.reduce((sum, file) => sum + file.size, 0)
  const totalSize = existingTotalSize + newTotalSize
  if (totalSize > config.maxTotalSize) {
    const maxTotalSizeMB = (config.maxTotalSize / (1024 * 1024)).toFixed(1)
    files.forEach((file) => {
      errors.push({
        file,
        error: {
          type: 'totalSize',
          message: `合計サイズが上限を超えています。最大: ${maxTotalSizeMB}MB`,
        },
      })
    })
    return { valid: false, errors, validFiles }
  }

  // 個別ファイルのバリデーション
  for (const file of files) {
    const result = validateImageFile(file, config)
    if (result.valid) {
      validFiles.push(file)
    } else {
      errors.push({ file, error: result.error! })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    validFiles,
  }
}

export async function validateImageDecode(file: File): Promise<{
  valid: boolean
  error: ImageUploadError | null
  width?: number
  height?: number
}> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        valid: true,
        error: null,
        width: img.width,
        height: img.height,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({
        valid: false,
        error: {
          type: 'decode',
          message: '画像ファイルが破損しているか、正しい形式ではありません',
        },
      })
    }

    img.src = url
  })
}
