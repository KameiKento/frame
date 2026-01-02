import * as React from 'react'
import { DropZone } from './drop-zone'
import { ImagePreview } from './image-preview'
import {
  cleanupImageFiles,
  createPreviewUrl,
  generateImageId,
  mockUploadImage,
  revokePreviewUrl,
} from './utils'
import {
  defaultConfig,
  validateImageDecode,
  validateImageFiles,
} from './validation'
import type { ImageFile, ImageUploadError, ImageUploaderConfig } from './types'

type ImageUploaderProps = {
  config?: Partial<ImageUploaderConfig>
  onImagesChange?: (images: Array<ImageFile>) => void
  autoUpload?: boolean
  className?: string
}

export function ImageUploader({
  config: customConfig,
  onImagesChange,
  autoUpload = false,
  className,
}: ImageUploaderProps) {
  const config = React.useMemo(
    () => ({ ...defaultConfig, ...customConfig }),
    [customConfig],
  )

  const [images, setImages] = React.useState<Array<ImageFile>>([])
  const [errors, setErrors] = React.useState<
    Array<{ file: File; error: ImageUploadError }>
  >([])

  // 画像変更時にコールバックを呼び出す
  React.useEffect(() => {
    onImagesChange?.(images)
  }, [images, onImagesChange])

  // クリーンアップ
  React.useEffect(() => {
    return () => {
      cleanupImageFiles(images)
    }
  }, [])

  const handleFilesSelected = React.useCallback(
    async (files: Array<File>) => {
      const existingCount = images.length
      const existingTotalSize = images.reduce(
        (sum, img) => sum + img.file.size,
        0,
      )

      const validation = validateImageFiles(
        files,
        existingCount,
        existingTotalSize,
        config,
      )

      setErrors(validation.errors)

      if (validation.validFiles.length === 0) {
        return
      }

      // バリデーション済みファイルを画像オブジェクトに変換
      const newImages: Array<ImageFile> = []

      for (const file of validation.validFiles) {
        const id = generateImageId()
        const previewUrl = createPreviewUrl(file)

        // 画像デコード検証
        const decodeResult = await validateImageDecode(file)
        if (!decodeResult.valid) {
          setErrors((prev) => [...prev, { file, error: decodeResult.error! }])
          revokePreviewUrl(previewUrl)
          continue
        }

        const image: ImageFile = {
          id,
          file,
          previewUrl,
          status: 'idle',
          error: null,
          progress: 0,
          width: decodeResult.width,
          height: decodeResult.height,
        }

        newImages.push(image)
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages])

        // 自動アップロードが有効な場合
        if (autoUpload) {
          newImages.forEach((image) => {
            handleUpload(image.id)
          })
        }
      }
    },
    [images, config, autoUpload],
  )

  const handleRemove = React.useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        revokePreviewUrl(image.previewUrl)
      }
      return prev.filter((img) => img.id !== id)
    })
  }, [])

  const handleMoveUp = React.useCallback((id: string) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id)
      if (index <= 0) return prev
      const newImages = [...prev]
      ;[newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ]
      return newImages
    })
  }, [])

  const handleMoveDown = React.useCallback((id: string) => {
    setImages((prev) => {
      const index = prev.findIndex((img) => img.id === id)
      if (index < 0 || index >= prev.length - 1) return prev
      const newImages = [...prev]
      ;[newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ]
      return newImages
    })
  }, [])

  const handleUpload = React.useCallback(
    async (id: string) => {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, status: 'uploading' as const, progress: 0, error: null }
            : img,
        ),
      )

      const image = images.find((img) => img.id === id)
      if (!image) return

      const result = await mockUploadImage(image, (progress) => {
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, progress } : img)),
        )
      })

      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                status: result.success
                  ? ('success' as const)
                  : ('error' as const),
                error: result.success
                  ? null
                  : {
                      type: 'upload',
                      message: result.error || 'アップロードに失敗しました',
                    },
              }
            : img,
        ),
      )
    },
    [images],
  )

  const handleRetry = React.useCallback(
    (id: string) => {
      handleUpload(id)
    },
    [handleUpload],
  )

  const isUploading = images.some((img) => img.status === 'uploading')
  const canAddMore = images.length < config.maxFiles

  return (
    <div className={className}>
      <div className="space-y-4">
        {canAddMore && (
          <DropZone
            onFilesSelected={handleFilesSelected}
            disabled={isUploading}
          />
        )}

        {errors.length > 0 && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <h3 className="mb-2 text-sm font-medium text-destructive">
              エラーが発生しました
            </h3>
            <ul className="space-y-1 text-sm text-destructive">
              {errors.map((error, index) => (
                <li key={index}>
                  {error.file.name}: {error.error.message}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setErrors([])}
              className="mt-2 text-xs text-destructive underline"
            >
              エラーをクリア
            </button>
          </div>
        )}

        {images.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {images.length} / {config.maxFiles} 枚
              </p>
              {!autoUpload && (
                <button
                  type="button"
                  onClick={() => {
                    images.forEach((img) => {
                      if (img.status === 'idle' || img.status === 'error') {
                        handleUpload(img.id)
                      }
                    })
                  }}
                  disabled={isUploading}
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                >
                  すべてアップロード
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((image, index) => (
                <ImagePreview
                  key={image.id}
                  image={image}
                  index={index}
                  total={images.length}
                  onRemove={handleRemove}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onRetry={handleRetry}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
