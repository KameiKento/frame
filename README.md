# Frame - デザインシステム

TanStack Start + shadcn/ui を使用したデザインシステムとコンポーネントライブラリです。

## 概要

Frameは、shadcn/uiのコンポーネントをベースにしたカスタムデザインシステムです。コンポーネントのドキュメント、プレビュー、そしてshadcn/uiのregistryとして機能します。

## 機能

- 📚 コンポーネントのドキュメントとプレビュー
- 🎨 shadcn/uiベースのカスタムコンポーネント
- 📦 shadcn/ui registryとしての機能
- 🌙 ダークモード対応
- 📱 レスポンシブデザイン

## セットアップ

### 必要な環境

- Node.js 18以上
- npm, yarn, pnpm, または bun

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

開発サーバーは `http://localhost:3000` で起動します。

## Registryとしての使用方法

Frameはshadcn/uiのregistryとして機能します。以下のコマンドでコンポーネントをインストールできます。

### Buttonコンポーネントのインストール

```bash
npx shadcn@latest add <registry-url>/r/button.json
```

**ローカル開発環境の場合:**

```bash
npx shadcn@latest add http://localhost:3000/r/button.json
```

**本番環境の場合:**

```bash
npx shadcn@latest add https://your-domain.com/r/button.json
```

### 利用可能なコンポーネント

現在、以下のコンポーネントがregistryに登録されています：

- **Button** - ユーザーアクションをトリガーするためのクリック可能な要素

## 開発

### コマンド

```bash
# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview

# リント
npm run lint

# フォーマット
npm run format

# リントとフォーマットのチェック
npm run check
```

## デプロイ

### Vercel

1. [Vercel](https://vercel.com)にプロジェクトをインポート
2. ビルドコマンド: `npm run build`
3. 出力ディレクトリ: `.output/public` (TanStack Startのデフォルト)
4. 環境変数は不要（基本的な設定で動作）

### Netlify

1. [Netlify](https://netlify.com)にプロジェクトを接続
2. ビルドコマンド: `npm run build`
3. 公開ディレクトリ: `.output/public`

### その他のプラットフォーム

TanStack StartはNitroを使用しているため、以下のプラットフォームでもデプロイ可能です：

- Cloudflare Pages
- AWS Lambda
- Node.jsサーバー
- その他Nitroがサポートするプラットフォーム

詳細は[TanStack Startのドキュメント](https://tanstack.com/router/latest/docs/framework/react/start/overview)を参照してください。

## Registryの設定

デプロイ後、`registry.json`と`public/r/`ディレクトリ内のファイルが公開されていることを確認してください。

registry.jsonの`homepage`フィールドを実際のデプロイURLに更新してください：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "frame",
  "homepage": "https://your-actual-domain.com",
  ...
}
```

## ライセンス

MIT

## 貢献

プルリクエストやイシューの報告を歓迎します。
