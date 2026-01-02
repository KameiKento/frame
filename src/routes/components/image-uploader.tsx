import { createFileRoute } from '@tanstack/react-router'
import { ImageUploader } from '@/components/image-uploader/image-uploader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/components/image-uploader')({
  component: ImageUploaderPage,
})

function ImageUploaderPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">画像アップローダー</h1>
        <p className="text-muted-foreground">
          ドラッグ&ドロップまたはクリックで画像をアップロードできます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>画像をアップロード</CardTitle>
          <CardDescription>
            複数の画像を選択し、プレビューを確認してからアップロードできます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploader />
        </CardContent>
      </Card>
    </div>
  )
}
