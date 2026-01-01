# デプロイ手順

## Vercelへのデプロイ

### 1. Vercelにプロジェクトをインポート

1. [Vercel](https://vercel.com)にログイン
2. "Add New Project"をクリック
3. GitHubリポジトリを選択（またはGitリポジトリを接続）
4. プロジェクト設定：
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `.output/public`
   - Install Command: `npm install`

### 2. デプロイ

"Deploy"ボタンをクリックしてデプロイを開始します。

### 3. Registry URLの更新

デプロイが完了したら、実際のURLを取得して`registry.json`の`homepage`フィールドを更新してください。

例：

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "frame",
  "homepage": "https://your-project.vercel.app",
  ...
}
```

### 4. 変更をコミット・プッシュ

```bash
git add registry.json
git commit -m "Update registry homepage URL"
git push
```

Vercelが自動的に再デプロイします。

## Netlifyへのデプロイ

### 1. Netlifyにプロジェクトを接続

1. [Netlify](https://netlify.com)にログイン
2. "Add new site" > "Import an existing project"
3. Gitリポジトリを選択

### 2. ビルド設定

- Build command: `npm run build`
- Publish directory: `.output/public`

### 3. デプロイ

"Deploy site"をクリックしてデプロイを開始します。

### 4. Registry URLの更新

デプロイ完了後、NetlifyのURLを取得して`registry.json`を更新してください。

## デプロイ後の確認

デプロイ後、以下のURLがアクセス可能であることを確認してください：

- `https://your-domain.com/r/button.json` - Buttonコンポーネントのregistry-item
- `https://your-domain.com/r/registry.json` - Registryのインデックス（存在する場合）

## Registryの使用方法（デプロイ後）

デプロイ後、以下のコマンドでコンポーネントをインストールできます：

```bash
npx shadcn@latest add https://your-domain.com/r/button.json
```

## トラブルシューティング

### Registryファイルにアクセスできない

- `public/r/`ディレクトリ内のファイルが正しくデプロイされているか確認
- 静的ファイルの配信設定を確認
- ビルド出力に`public/r/`が含まれているか確認

### 404エラーが発生する

- `registry.json`の`homepage`フィールドが正しいURLになっているか確認
- 各registry-item.jsonファイルのパスが正しいか確認
