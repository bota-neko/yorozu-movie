# Vimeoパスワード保護動画サイト

Vimeoの動画IDを登録するだけで、パスワード保護された動画閲覧ページを自動生成するNext.jsアプリケーションです。

## 特徴
- **パスワード保護**: 一般ユーザーは共通のパスワードを入力することで全ての動画を閲覧できます。
- **管理画面**: 管理者は動画の登録、編集、削除、公開状態の切り替え、閲覧パスワードの変更が可能です。
- **Vimeo連携**: 動画IDを入力するだけで埋め込みプレイヤーが表示されます。
- **レスポンシブデザイン**: PC、スマホ両方で快適に動作します。

## 技術スタック
- **Framework**: Next.js (App Router)
- **Database**: Vercel Postgres / Drizzle ORM
- **Auth**: セッションクッキー (bcryptによるハッシュ化)
- **Styling**: Vanilla CSS / CSS Modules

## セットアップ手順

### 1. 環境変数の設定
`.env.example` をコピーして `.env.local` を作成し、必要な情報を入力してください。

```bash
cp .env.example .env.local
```

主要な環境変数:
- `POSTGRES_URL`: Vercel Postgresの接続URL
- `JWT_SECRET`: 任意の長い文字列（管理用セッションに使用）
- `ADMIN_USERNAME`: 初期の管理者ユーザー名
- `ADMIN_PASSWORD`: 初期の管理者パスワード
- `INITIAL_VIEWER_PASSWORD`: 初期の一般閲覧用パスワード

### 2. 依存関係のインストール
```bash
npm install
```

### 3. データベースの初期化
Drizzleを使用してテーブルを作成し、初期データを投入します。

```bash
# スキーマをデータベースに反映
npx drizzle-kit push

# 初期データ（管理者・初期パスワード）の登録
npx tsx src/scripts/setup-db.ts
```

### 4. ローカル開発サーバーの起動
```bash
npm run dev
```

起動後、以下のURLにアクセスできます：
- 一般公開サイト: `http://localhost:3000`
- 管理画面ログイン: `http://localhost:3000/admin/login`

## Vercelへのデプロイ方法

1. GitHubリポジトリにプッシュします。
2. Vercelでプロジェクトを新規作成し、リポジトリを連携します。
3. Vercelのコンソールで **Storage** から **Postgres** を追加します。
4. 環境変数 (`POSTGRES_URL`, `JWT_SECRET` 等) をVercelの設定画面で登録します。
5. デプロイ後、Vercelのプロジェクト設定からデータベースの初期化コマンドを実行するか、ローカルから本番DBに向けて `setup-db.ts` を実行してください。

## 注意事項
- Vimeoの動画設定で「埋め込みを許可するドメイン」を制限している場合は、デプロイ後のドメインを追加してください。
- パスワードは必ずハッシュ化して保存されます。
