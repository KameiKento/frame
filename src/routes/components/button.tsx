import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Example, ExampleWrapper } from '@/components/example'
import {
  PlusIcon,
  DownloadIcon,
  ArrowRightIcon,
  SearchIcon,
} from 'lucide-react'

export const Route = createFileRoute('/components/button')({
  component: ButtonPage,
})

function ButtonPage() {
  return (
    <ExampleWrapper>
      <VariantsExample />
      <SizesExample />
      <IconExamples />
      <DisabledExample />
    </ExampleWrapper>
  )
}

function VariantsExample() {
  return (
    <Example title="バリアント">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="default">送信</Button>
        <Button variant="outline">キャンセル</Button>
        <Button variant="secondary">次へ</Button>
        <Button variant="ghost">編集</Button>
        <Button variant="destructive">削除</Button>
        <Button variant="link">詳細を見る</Button>
      </div>
    </Example>
  )
}

function SizesExample() {
  return (
    <Example title="サイズ">
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
    </Example>
  )
}

function IconExamples() {
  return (
    <Example title="アイコン付き">
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
    </Example>
  )
}

function DisabledExample() {
  return (
    <Example title="無効状態">
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
    </Example>
  )
}

