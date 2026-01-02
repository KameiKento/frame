import * as React from 'react'
import { ChevronDownIcon, ChevronUpIcon, XIcon } from 'lucide-react'
import { formatFileSize } from './utils'
import type { ImageFile } from './types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type ImagePreviewProps = {
  image: ImageFile
  index: number
  total: number
  onRemove: (id: string) => void
  onMoveUp?: (id: string) => void
  onMoveDown?: (id: string) => void
  onRetry?: (id: string) => void
}

export function ImagePreview({
  image,
  index,
  total,
  onRemove,
  onMoveUp,
  onMoveDown,
  onRetry,
}: ImagePreviewProps) {
  const [imageError, setImageError] = React.useState(false)

  const handleImageError = React.useCallback(() => {
    setImageError(true)
  }, [])

  const statusLabel = {
    idle: '未送信',
    uploading: '送信中',
    success: '成功',
    error: 'エラー',
  }[image.status]

  const statusVariant = {
    idle: 'outline' as const,
    uploading: 'secondary' as const,
    success: 'default' as const,
    error: 'destructive' as const,
  }[image.status]

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card">
      <div className="relative aspect-square w-full">
        {imageError ? (
          <div className="flex h-full items-center justify-center bg-muted text-sm text-muted-foreground">
            画像の読み込みに失敗しました
          </div>
        ) : (
          <img
            src={image.previewUrl}
            alt={image.file.name}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        )}
        {image.status === 'uploading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <div className="text-sm font-medium">
                {Math.round(image.progress)}%
              </div>
              <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${image.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
        {image.status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
            <div className="text-center">
              <p className="text-sm font-medium text-destructive">エラー</p>
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  onClick={() => onRetry(image.id)}
                >
                  再試行
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="border-t p-2">
        <div className="mb-1 flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium">{image.file.name}</p>
          <Badge variant={statusVariant} className="shrink-0 text-xs">
            {statusLabel}
          </Badge>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {formatFileSize(image.file.size)}
          </p>
          <div className="flex items-center gap-1">
            {onMoveUp && index > 0 && (
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => onMoveUp(image.id)}
                className="h-5 w-5"
              >
                <ChevronUpIcon className="size-3" />
              </Button>
            )}
            {onMoveDown && index < total - 1 && (
              <Button
                size="icon-xs"
                variant="ghost"
                onClick={() => onMoveDown(image.id)}
                className="h-5 w-5"
              >
                <ChevronDownIcon className="size-3" />
              </Button>
            )}
            <Button
              size="icon-xs"
              variant="ghost"
              onClick={() => onRemove(image.id)}
              className="h-5 w-5 text-destructive hover:text-destructive"
            >
              <XIcon className="size-3" />
            </Button>
          </div>
        </div>
        {image.error && (
          <p className="mt-1 text-xs text-destructive">{image.error.message}</p>
        )}
      </div>
    </div>
  )
}
