import { createFileRoute } from '@tanstack/react-router'
import { CopyIcon } from 'lucide-react'
import { ImageUploader } from '@/components/image-uploader/image-uploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Example, ExampleWrapper } from '@/components/example'
import { CodeBlock } from '@/components/ui/code-block'

export const Route = createFileRoute('/components/image-uploader')({
  component: ImageUploaderPage,
})

function ImageUploaderPage() {
  return (
    <ExampleWrapper>
      <OverviewSection />
      <InstallationSection />
      <ServerSideExample />
      <UsageExample />
    </ExampleWrapper>
  )
}

function OverviewSection() {
  return (
    <Example title="概要">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">ImageUploader</h3>
          <p className="text-sm text-muted-foreground">
            ドラッグ&ドロップまたはクリックで複数の画像をアップロードできるコンポーネントです。事前バリデーション、プレビュー表示、並び替え、進捗表示などの機能を提供します。
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>ドラッグ&ドロップとクリック選択に対応</li>
            <li>複数画像の選択と管理（最大10枚）</li>
            <li>事前バリデーション（形式、サイズ、枚数）</li>
            <li>画像プレビュー表示</li>
            <li>並び替え機能（上下ボタン）</li>
            <li>アップロード進捗表示</li>
            <li>エラー表示と再試行機能</li>
          </ul>
        </div>
      </div>
    </Example>
  )
}

function InstallationSection() {
  const registryUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/r/image-uploader.json`
      : 'http://localhost:3000/r/image-uploader.json'
  const command = `npx shadcn@latest add ${registryUrl}`

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
  }

  return (
    <Example title="インストール">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          以下のコマンドを実行して、ImageUploaderコンポーネントをプロジェクトに追加できます。
        </p>
        <div className="flex items-center gap-2">
          <Input readOnly value={command} className="font-mono text-sm" />
          <Button size="icon" variant="outline" onClick={handleCopy}>
            <CopyIcon />
            <span className="sr-only">コピー</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          このコマンドは、ImageUploaderコンポーネントとその依存関係（Button、Badge）のコードをプロジェクトにコピーします。
        </p>
        <div className="rounded-lg border bg-muted/50 p-3">
          <p className="text-xs font-medium mb-1">必要な依存関係</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• lucide-react（アイコン用）</li>
            <li>• @/components/ui/button</li>
            <li>• @/components/ui/badge</li>
          </ul>
        </div>
      </div>
    </Example>
  )
}

function ServerSideExample() {
  const serverCode = `// app/api/upload-image/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 10
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    // 認証チェック（例：Supabase Auth）
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    // 枚数チェック
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: \`最大\${MAX_FILES}枚までアップロードできます\` },
        { status: 400 }
      )
    }

    // 合計サイズチェック
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: '合計サイズが50MBを超えています' },
        { status: 400 }
      )
    }

    const uploadedFiles = []

    for (const file of files) {
      // MIME typeチェック
      if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: \`\${file.name}: 対応していない形式です\` },
          { status: 400 }
        )
      }

      // サイズチェック
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: \`\${file.name}: ファイルサイズが大きすぎます\` },
          { status: 400 }
        )
      }

      // 画像としてデコードできるか検証
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      try {
        const metadata = await sharp(buffer).metadata()
        if (!metadata.width || !metadata.height) {
          return NextResponse.json(
            { error: \`\${file.name}: 画像として読み込めません\` },
            { status: 400 }
          )
        }
      } catch (error) {
        return NextResponse.json(
          { error: \`\${file.name}: 画像ファイルが破損しています\` },
          { status: 400 }
        )
      }

      // ファイル名をUUIDで生成（セキュリティ）
      const uuid = crypto.randomUUID()
      const extension = file.name.split('.').pop()
      const fileName = \`\${uuid}.\${extension}\`

      // 画像処理（リサイズ、最適化、Exif削除）
      const processedImage = await sharp(buffer)
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer()

      // ストレージに保存（例：ローカル、S3、Supabase Storage）
      const uploadPath = join(process.cwd(), 'public', 'uploads', fileName)
      await writeFile(uploadPath, processedImage)

      uploadedFiles.push({
        id: uuid,
        url: \`/uploads/\${fileName}\`,
        width: metadata.width,
        height: metadata.height,
        size: processedImage.length,
      })
    }

    // データベースに保存（例：Supabase）
    // await supabase.from('post_images').insert(uploadedFiles)

    return NextResponse.json({ files: uploadedFiles })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'アップロードに失敗しました' },
      { status: 500 }
    )
  }
}`

  const clientCode = `// クライアント側でのアップロード実装例
import { ImageUploader } from '@/components/image-uploader/image-uploader'
import type { ImageFile } from '@/components/image-uploader/types'

async function uploadImage(image: ImageFile): Promise<{ success: boolean; error?: string }> {
  const formData = new FormData()
  formData.append('files', image.file)

  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'アップロードに失敗しました' }
    }

    const data = await response.json()
    return { success: true }
  } catch (error) {
    return { success: false, error: 'ネットワークエラーが発生しました' }
  }
}

function MyComponent() {
  const handleImagesChange = (images: ImageFile[]) => {
    // 画像が変更されたときの処理
    console.log('Images:', images)
  }

  return (
    <ImageUploader
      onImagesChange={handleImagesChange}
      config={{
        maxFiles: 10,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxTotalSize: 50 * 1024 * 1024, // 50MB
      }}
    />
  )
}`

  return (
    <Example title="サーバーサイド実装例">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            サーバーサイドでの画像アップロード処理の実装例です。セキュリティとパフォーマンスを考慮した実装になっています。
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium mb-2">
                サーバーサイド（Next.js App Router）
              </p>
              <CodeBlock code={serverCode} language="typescript" />
            </div>
            <div>
              <p className="text-xs font-medium mb-2">クライアント側の統合例</p>
              <CodeBlock code={clientCode} language="typescript" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
          <p className="text-xs font-medium">実装のポイント</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 認証・認可チェック（必須）</li>
            <li>• MIME typeと拡張子の検証</li>
            <li>• 画像としてデコードできるか検証</li>
            <li>• ファイル名はUUIDで生成（セキュリティ）</li>
            <li>• 画像のリサイズと最適化（sharp使用）</li>
            <li>• Exif情報の削除（プライバシー保護）</li>
            <li>• ストレージへの保存（S3、Supabase Storage等）</li>
          </ul>
        </div>
      </div>
    </Example>
  )
}

function UsageExample() {
  const code = `<ImageUploader
  config={{
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxTotalSize: 50 * 1024 * 1024, // 50MB
  }}
  onImagesChange={(images) => {
    console.log('Selected images:', images)
  }}
  autoUpload={false}
/>`

  return (
    <Example title="使用例">
      <div className="space-y-4">
        <div>
          <ImageUploader />
        </div>
        <CodeBlock code={code} />
      </div>
    </Example>
  )
}
