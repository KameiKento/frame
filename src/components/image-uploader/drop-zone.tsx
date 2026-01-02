import * as React from 'react'
import { UploadIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type DropZoneProps = {
  onFilesSelected: (files: Array<File>) => void
  disabled?: boolean
  className?: string
}

export function DropZone({
  onFilesSelected,
  disabled = false,
  className,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragging(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    },
    [],
  )

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/'),
      )
      if (files.length > 0) {
        onFilesSelected(files)
      }
    },
    [disabled, onFilesSelected],
  )

  const handleClick = React.useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        onFilesSelected(files)
      }
      // 同じファイルを再度選択できるようにリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [onFilesSelected],
  )

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border bg-muted/30 hover:bg-muted/50',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <UploadIcon className="size-12 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium">
          画像をドラッグ&ドロップするか、クリックして選択
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPEG, PNG, WebP形式（最大10MB、最大10枚）
        </p>
      </div>
    </div>
  )
}
