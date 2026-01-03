import * as React from 'react'
import { ImageIcon } from 'lucide-react'
import type {
  ImageFile,
  ImageUploaderConfig,
} from '@/components/image-uploader/types'
import type { TextareaWithImageUploaderProps } from './types'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImagePreview } from '@/components/image-uploader/image-preview'
import {
  cleanupImageFiles,
  createPreviewUrl,
  generateImageId,
  mockUploadImage,
  revokePreviewUrl,
} from '@/components/image-uploader/utils'
import {
  defaultConfig,
  validateImageDecode,
  validateImageFiles,
} from '@/components/image-uploader/validation'
import { cn } from '@/lib/utils'

export function TextareaWithImageUploader({
  value = '',
  onChange,
  onImagesChange,
  placeholder,
  maxLength,
  imageConfig: customImageConfig,
  disabled = false,
  className,
  autoUpload = true,
}: TextareaWithImageUploaderProps) {
  const imageConfig = React.useMemo<ImageUploaderConfig>(
    () => ({ ...defaultConfig, ...customImageConfig }),
    [customImageConfig],
  )

  const [images, setImages] = React.useState<Array<ImageFile>>([])
  const [errors, setErrors] = React.useState<
    Array<{ file: File; error: { type: string; message: string } }>
  >([])

  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const imagesRef = React.useRef<Array<ImageFile>>(images)

  // imagesの最新値をrefに保持
  React.useEffect(() => {
    imagesRef.current = images
  }, [images])

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

  const handleUpload = React.useCallback(
    async (id: string, imageOverride?: ImageFile) => {
      let image: ImageFile | undefined = imageOverride

      if (!image) {
        setImages((prev) => {
          const found = prev.find((img) => img.id === id)
          if (!found) return prev
          image = found
          return prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  status: 'uploading' as const,
                  progress: 0,
                  error: null,
                }
              : img,
          )
        })
      } else {
        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  status: 'uploading' as const,
                  progress: 0,
                  error: null,
                }
              : img,
          ),
        )
      }

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
    [],
  )

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
        imageConfig,
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
          // 画像を直接渡すことで、状態の更新を待つ必要がない
          newImages.forEach((image) => {
            handleUpload(image.id, image)
          })
        }
      }
    },
    [images, imageConfig, autoUpload, handleUpload],
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

  const handleRetry = React.useCallback(
    (id: string) => {
      const image = imagesRef.current.find((img) => img.id === id)
      if (image) {
        handleUpload(id, image)
      }
    },
    [handleUpload],
  )

  const handleImageButtonClick = React.useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) =>
        file.type.startsWith('image/'),
      )
      if (files.length > 0) {
        handleFilesSelected(files)
      }
      // 同じファイルを再度選択できるようにリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [handleFilesSelected],
  )

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    },
    [],
  )

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (disabled) return

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/'),
      )
      if (files.length > 0) {
        handleFilesSelected(files)
      }
    },
    [disabled, handleFilesSelected],
  )

  const handleTextareaChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      if (maxLength && newValue.length > maxLength) {
        return
      }
      onChange?.(newValue)
    },
    [onChange, maxLength],
  )

  const currentLength = value.length
  const canAddMore = images.length < imageConfig.maxFiles
  const isUploading = images.some((img) => img.status === 'uploading')

  return (
    <div className={cn('space-y-3', className)}>
      <div onDragOver={handleDragOver} onDrop={handleDrop} className="relative">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            maxLength={maxLength}
            disabled={disabled}
            className="pr-20"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            {maxLength !== undefined && (
              <span
                className={cn(
                  'text-xs text-muted-foreground',
                  currentLength > maxLength * 0.9 && 'text-foreground',
                  currentLength >= maxLength && 'text-destructive',
                )}
              >
                {currentLength} / {maxLength}
              </span>
            )}
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleImageButtonClick}
              disabled={disabled || !canAddMore || isUploading}
              className="h-7 w-7"
              aria-label="画像を追加"
            >
              <ImageIcon className="size-4" />
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={imageConfig.acceptedMimeTypes.join(',')}
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || !canAddMore || isUploading}
        />
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
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
              {images.length} / {imageConfig.maxFiles} 枚
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
  )
}
