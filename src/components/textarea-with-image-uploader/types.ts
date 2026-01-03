import type {
  ImageFile,
  ImageUploaderConfig,
} from '@/components/image-uploader/types'

export type TextareaWithImageUploaderProps = {
  value?: string
  onChange?: (value: string) => void
  onImagesChange?: (images: Array<ImageFile>) => void
  placeholder?: string
  maxLength?: number
  imageConfig?: Partial<ImageUploaderConfig>
  disabled?: boolean
  className?: string
  autoUpload?: boolean
}
