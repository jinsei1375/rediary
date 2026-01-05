# Rediary - React Native 日記アプリ

## コンセプト

- 「書いた言語表現を、時間を置いてもう一度思い出すことで「使える言語」にする日記アプリ

## レイヤー分離アーキテクチャ

```
app/                    # Expo Router画面（ルーティング専用）
components/             # UIコンポーネント
services/               # データアクセス層
hooks/                  # ビジネスロジック
utils/                  # 純粋関数
stores/                 # 状態管理
contexts/               # React Context
types/                  # 型定義
```

### サービス層パターン (`services/supabaseService.ts`)

全てのデータベース操作は`SupabaseService`クラスに集約：

## UI スタイル

- Tailwind CSS +
- 基本的にはクラス名でスタイリング

## 開発方針

- 画面は Expo Router でファイルベースルーティング
- コンポーネントを使ってパフォーマンスと再利用性を向上

## 機能

## フッターメニュー

## 多言語対応（MVP 開発時は未着手で良い）

- i18next を使用
- 翻訳ファイルは`i18n/locales/`に配置
- コンポーネント内で`useTranslation`フックを使用して翻訳を取得
- 今後、新しいテキストを追加する際は、対応する翻訳ファイルにも必ず追加し、設定画面で言語切り替えが正しく動作することを確認すること
- 今後はインドネシア語、フランス語、中国語、韓国語など追加予定
