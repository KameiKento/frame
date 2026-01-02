import type { ImageFile } from './types'

export function generateImageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file)
}

export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function cleanupImageFiles(images: Array<ImageFile>): void {
  images.forEach((image) => {
    revokePreviewUrl(image.previewUrl)
  })
}

export async function mockUploadImage(
  image: ImageFile,
  onProgress?: (progress: number) => void,
): Promise<{ success: boolean; error?: string }> {
  // モックアップロード: ランダムな遅延で進捗をシミュレート
  return new Promise((resolve) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        // 10%の確率でエラーをシミュレート
        if (Math.random() < 0.1) {
          resolve({ success: false, error: 'アップロードに失敗しました' })
        } else {
          resolve({ success: true })
        }
      } else {
        onProgress?.(progress)
      }
    }, 200)
  })
}
