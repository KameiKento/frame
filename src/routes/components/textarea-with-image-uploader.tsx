import { createFileRoute } from '@tanstack/react-router'
import { CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { TextareaWithImageUploader } from '@/components/textarea-with-image-uploader/textarea-with-image-uploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Example, ExampleWrapper } from '@/components/example'
import { CodeBlock } from '@/components/ui/code-block'

export const Route = createFileRoute(
  '/components/textarea-with-image-uploader',
)({
  component: TextareaWithImageUploaderPage,
})

function TextareaWithImageUploaderPage() {
  return (
    <ExampleWrapper>
      <OverviewSection />
      <InstallationSection />
      <UsageExample />
      <CharacterLimitExample />
      <CustomConfigExample />
    </ExampleWrapper>
  )
}

function OverviewSection() {
  return (
    <Example title="概要">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">
            TextareaWithImageUploader
          </h3>
          <p className="text-sm text-muted-foreground">
            X、Instagram、ChatGPTなどに実装されている、画像をアップロードできるテキストエリアコンポーネントです。テキスト入力と画像アップロードを統合し、直感的なユーザー体験を提供します。
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            TextareaWithImageUploaderコンポーネントは、テキスト入力と画像アップロードを一つのコンポーネントに統合したものです。
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>テキストエリアに画像をドラッグ&ドロップ</li>
            <li>画像アイコンボタンをクリックして画像をアップロード</li>
            <li>テキストエリアの下に画像プレビューを表示</li>
            <li>画像の削除と並び替え機能</li>
            <li>文字数制限（オプトイン、Xスタイルの表示）</li>
            <li>テキストエリアの自動リサイズ</li>
            <li>カスタム可能な画像アップロード設定</li>
          </ul>
        </div>
      </div>
    </Example>
  )
}

function InstallationSection() {
  const registryUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/r/textarea-with-image-uploader.json`
      : 'http://localhost:3000/r/textarea-with-image-uploader.json'
  const command = `npx shadcn@latest add ${registryUrl}`

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
  }

  return (
    <Example title="インストール">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          以下のコマンドを実行して、TextareaWithImageUploaderコンポーネントをプロジェクトに追加できます。
        </p>
        <div className="flex items-center gap-2">
          <Input readOnly value={command} className="font-mono text-sm" />
          <Button size="icon" variant="outline" onClick={handleCopy}>
            <CopyIcon />
            <span className="sr-only">コピー</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          このコマンドは、TextareaWithImageUploaderコンポーネントとその依存関係のコードをプロジェクトにコピーします。
        </p>
        <div className="rounded-lg border bg-muted/50 p-3">
          <p className="text-xs font-medium mb-1">必要な依存関係</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• lucide-react（アイコン用）</li>
            <li>• @/components/ui/textarea</li>
            <li>• @/components/ui/button</li>
            <li>
              •
              @/components/image-uploader（型定義、ユーティリティ、バリデーション）
            </li>
          </ul>
        </div>
      </div>
    </Example>
  )
}

function UsageExample() {
  const [value, setValue] = useState('')
  const code = `import { TextareaWithImageUploader } from '@/components/textarea-with-image-uploader/textarea-with-image-uploader'
import { useState } from 'react'

function MyComponent() {
  const [value, setValue] = useState('')

  return (
    <TextareaWithImageUploader
      value={value}
      onChange={setValue}
      placeholder="何か投稿してみましょう..."
      onImagesChange={(images) => {
        console.log('Selected images:', images)
      }}
    />
  )
}`

  return (
    <Example title="使用例">
      <div className="space-y-4">
        <div>
          <TextareaWithImageUploader
            value={value}
            onChange={setValue}
            placeholder="何か投稿してみましょう..."
            onImagesChange={(images) => {
              console.log('Selected images:', images)
            }}
          />
        </div>
        <CodeBlock code={code} />
      </div>
    </Example>
  )
}

function CharacterLimitExample() {
  const [value, setValue] = useState('')
  const code = `<TextareaWithImageUploader
  value={value}
  onChange={setValue}
  placeholder="何か投稿してみましょう..."
  maxLength={280}
/>`

  return (
    <Example title="文字数制限">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            文字数制限を設定すると、Xスタイルで現在の文字数と最大文字数が表示されます。90%を超えると通常の色に、最大文字数に達すると警告色になります。
          </p>
          <TextareaWithImageUploader
            value={value}
            onChange={setValue}
            placeholder="何か投稿してみましょう...（最大280文字）"
            maxLength={280}
            onImagesChange={(images) => {
              console.log('Selected images:', images)
            }}
          />
        </div>
        <CodeBlock code={code} />
      </div>
    </Example>
  )
}

function CustomConfigExample() {
  const [value, setValue] = useState('')
  const code = `<TextareaWithImageUploader
  value={value}
  onChange={setValue}
  placeholder="何か投稿してみましょう..."
  imageConfig={{
    maxFiles: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxTotalSize: 20 * 1024 * 1024, // 20MB
  }}
  autoUpload={true}
/>`

  return (
    <Example title="カスタム設定">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            画像アップロードの設定をカスタマイズできます。最大ファイル数、ファイルサイズ、合計サイズなどを調整できます。
          </p>
          <TextareaWithImageUploader
            value={value}
            onChange={setValue}
            placeholder="何か投稿してみましょう..."
            imageConfig={{
              maxFiles: 5,
              maxFileSize: 5 * 1024 * 1024, // 5MB
              maxTotalSize: 20 * 1024 * 1024, // 20MB
            }}
            autoUpload={true}
            onImagesChange={(images) => {
              console.log('Selected images:', images)
            }}
          />
        </div>
        <CodeBlock code={code} />
      </div>
    </Example>
  )
}
