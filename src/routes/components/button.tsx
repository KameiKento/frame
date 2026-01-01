import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Example, ExampleWrapper } from '@/components/example'
import { CodeBlock } from '@/components/ui/code-block'

export const Route = createFileRoute('/components/button')({
  component: ButtonPage,
})

function ButtonPage() {
  return (
    <ExampleWrapper>
      <OverviewSection />
      <InstallationSection />
      <RelatedComponentsSection />
      <VariantsExample />
      <SizesExample />
      <IconExamples />
      <DisabledExample />
    </ExampleWrapper>
  )
}

function OverviewSection() {
  return (
    <Example title="概要">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold mb-2">Button</h3>
          <p className="text-sm text-muted-foreground">
            Buttonコンポーネントは、ユーザーアクションをトリガーするためのクリック可能な要素です。様々なバリアントとサイズをサポートし、アイコンとの組み合わせも可能です。
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            Buttonコンポーネントは、フォーム送信、ナビゲーション、アクション実行など、様々な用途で使用できます。
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              6種類のバリアント（default, outline, secondary, ghost,
              destructive, link）
            </li>
            <li>
              8種類のサイズ（xs, sm, default, lg, icon-xs, icon-sm, icon,
              icon-lg）
            </li>
            <li>アイコンとの組み合わせ対応</li>
            <li>無効状態のサポート</li>
          </ul>
        </div>
      </div>
    </Example>
  )
}

function InstallationSection() {
  const registryUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/r/button.json`
      : 'http://localhost:3000/r/button.json'
  const command = `npx shadcn@latest add ${registryUrl}`

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
  }

  return (
    <Example title="インストール">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          以下のコマンドを実行して、Buttonコンポーネントをプロジェクトに追加できます。
        </p>
        <div className="flex items-center gap-2">
          <Input readOnly value={command} className="font-mono text-sm" />
          <Button size="icon" variant="outline" onClick={handleCopy}>
            <CopyIcon />
            <span className="sr-only">コピー</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          このコマンドは、Buttonコンポーネントのコードをプロジェクトにコピーします。
        </p>
      </div>
    </Example>
  )
}

function RelatedComponentsSection() {
  const relatedComponents = [
    {
      title: 'AlertDialog',
      url: '/components/alert-dialog',
      description: 'Buttonを使用してダイアログを開く',
    },
    {
      title: 'Card',
      url: '/components/card',
      description: 'Buttonを使用してアクションを実行',
    },
    {
      title: 'Combobox',
      url: '/components/combobox',
      description: 'Buttonを使用してコンボボックスを開く',
    },
    {
      title: 'DropdownMenu',
      url: '/components/dropdown-menu',
      description: 'Buttonを使用してドロップダウンメニューを開く',
    },
  ]

  return (
    <Example title="関連コンポーネント">
      <div className="grid gap-3 sm:grid-cols-2">
        {relatedComponents.map((component) => (
          <Link key={component.url} to={component.url} className="group">
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{component.title}</CardTitle>
                  <ExternalLinkIcon className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <CardDescription className="text-xs">
                  {component.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </Example>
  )
}

function VariantsExample() {
  const code = `<Button variant="default">送信</Button>
<Button variant="outline">キャンセル</Button>
<Button variant="secondary">次へ</Button>
<Button variant="ghost">編集</Button>
<Button variant="destructive">削除</Button>
<Button variant="link">詳細を見る</Button>`

  return (
    <Example title="バリアント">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">送信</Button>
          <Button variant="outline">キャンセル</Button>
          <Button variant="secondary">次へ</Button>
          <Button variant="ghost">編集</Button>
          <Button variant="destructive">削除</Button>
          <Button variant="link">詳細を見る</Button>
        </div>
        <CodeBlock code={code} />
      </div>
    </Example>
  )
}

function SizesExample() {
  const code = `<Button size="xs">タグ</Button>
<Button size="sm">保存</Button>
<Button size="default">送信</Button>
<Button size="lg">新規作成</Button>

<Button size="icon-xs">
  <SearchIcon />
</Button>
<Button size="icon-sm">
  <SearchIcon />
</Button>
<Button size="icon">
  <SearchIcon />
</Button>
<Button size="icon-lg">
  <SearchIcon />
</Button>`

  return (
    <Example title="サイズ">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">タグ</Button>
          <Button size="sm">保存</Button>
          <Button size="default">送信</Button>
          <Button size="lg">新規作成</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon-xs">
            <SearchIcon />
          </Button>
          <Button size="icon-sm">
            <SearchIcon />
          </Button>
          <Button size="icon">
            <SearchIcon />
          </Button>
          <Button size="icon-lg">
            <SearchIcon />
          </Button>
        </div>
        <CodeBlock code={code} />
      </div>
    </Example>
  )
}

function IconExamples() {
  const code = `<Button>
  <PlusIcon data-icon="inline-start" />
  新規作成
</Button>
<Button>
  次へ
  <ArrowRightIcon data-icon="inline-end" />
</Button>
<Button>
  <DownloadIcon data-icon="inline-start" />
  エクスポート
  <ArrowRightIcon data-icon="inline-end" />
</Button>
<Button size="icon">
  <SearchIcon />
</Button>`

  return (
    <Example title="アイコン付き">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <PlusIcon data-icon="inline-start" />
            新規作成
          </Button>
          <Button>
            次へ
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button>
            <DownloadIcon data-icon="inline-start" />
            エクスポート
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          <Button size="icon">
            <SearchIcon />
          </Button>
        </div>
        <CodeBlock code={code} />
      </div>
    </Example>
  )
}

function DisabledExample() {
  const code = `<Button disabled variant="default">送信</Button>
<Button disabled variant="outline">キャンセル</Button>
<Button disabled variant="secondary">次へ</Button>
<Button disabled variant="ghost">編集</Button>
<Button disabled variant="destructive">削除</Button>
<Button disabled variant="link">詳細を見る</Button>`

  return (
    <Example title="無効状態">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled variant="default">
            送信
          </Button>
          <Button disabled variant="outline">
            キャンセル
          </Button>
          <Button disabled variant="secondary">
            次へ
          </Button>
          <Button disabled variant="ghost">
            編集
          </Button>
          <Button disabled variant="destructive">
            削除
          </Button>
          <Button disabled variant="link">
            詳細を見る
          </Button>
        </div>
        <CodeBlock code={code} />
      </div>
    </Example>
  )
}
