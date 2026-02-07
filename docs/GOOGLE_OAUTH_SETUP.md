# Google OAuth 認証実装ガイド

## 概要

このドキュメントでは、LanDiaアプリで実装されたGoogle OAuth認証の仕組みと、Supabaseでの設定方法について説明します。

## 実装の詳細

### 変更点

1. **authService.ts の修正**
   - `skipBrowserRedirect: true` に変更し、Expo側でリダイレクトを制御
   - `redirectTo` パラメータで明示的にリダイレクトURLを指定
   - ハッシュフラグメント（`#`）からトークンを抽出（Supabaseの標準形式）
   - キャンセル、中断などのエラーケースを適切にハンドリング

2. **OAuth コールバック画面の追加**
   - `app/auth/callback.tsx` を作成
   - OAuth認証完了後のリダイレクト先として機能
   - 自動的にホーム画面にリダイレクト

3. **エラーハンドリングの改善**
   - Google認証固有のエラーメッセージを追加
   - より詳細なエラー情報をユーザーに提供

4. **コードのリファクタリング**
   - AuthContext の不要な wrapper 関数を簡素化
   - 重複コードを削減し、保守性を向上

## Supabase での Google OAuth 設定手順

### 1. Google Cloud Console での設定

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（既存のプロジェクトを使用する場合はスキップ）
3. 「APIとサービス」→「認証情報」に移動
4. 「認証情報を作成」→「OAuth 2.0 クライアント ID」を選択
5. アプリケーションの種類を選択:
   - **iOS アプリ**: iOS bundle ID を入力
   - **Android アプリ**: パッケージ名と SHA-1 証明書フィンガープリントを入力
   - **ウェブアプリケーション**: 承認済みのリダイレクト URI を追加

### 2. Supabase での設定

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. プロジェクトを選択
3. 「Authentication」→「Providers」に移動
4. 「Google」を選択して有効化
5. Google Cloud Console で取得した以下の情報を入力:
   - **Client ID**: Google OAuth クライアント ID
   - **Client Secret**: Google OAuth クライアントシークレット
6. リダイレクトURLを確認:
   - Supabaseが提供するコールバックURL（`https://<project-id>.supabase.co/auth/v1/callback`）を
     Google Cloud ConsoleのOAuth設定の「承認済みのリダイレクトURI」に追加

### 3. アプリケーション側の設定

1. **app.json の確認**

   ```json
   {
     "expo": {
       "scheme": "landia",
       ...
     }
   }
   ```

   - カスタムURLスキーム（`landia://`）が設定されていることを確認

2. **リダイレクトURLの設定**
   - authService.ts で定義されているリダイレクトURL: `landia://auth/callback`
   - このURLがSupabaseのOAuth設定と一致していることを確認

### 4. モバイルアプリでの追加設定（必要に応じて）

#### iOS

- Xcode で URL Schemes を設定（Expo が自動的に処理）

#### Android

- AndroidManifest.xml にインテントフィルタを追加（Expo が自動的に処理）

## トラブルシューティング

### エラー: "OAuth URLが取得できませんでした"

- Supabase で Google Provider が有効になっているか確認
- Client ID と Client Secret が正しく設定されているか確認

### エラー: "認証トークンが取得できませんでした"

- リダイレクトURLが正しく設定されているか確認
- Google Cloud Console の承認済みリダイレクト URI に Supabase のコールバック URL が含まれているか確認

### 認証後にアプリに戻らない

- app.json の `scheme` が正しく設定されているか確認
- iOS/Android のディープリンク設定が正しいか確認
- 開発環境では、`npx expo start --clear` でキャッシュをクリアしてから再度試す

## セキュリティに関する注意事項

1. **Client Secret の管理**
   - Client Secret は環境変数で管理し、リポジトリにコミットしない
   - Supabase Dashboard でのみ設定

2. **リダイレクト URI の検証**
   - 許可されたリダイレクト URI のみを Google Cloud Console に登録
   - 本番環境と開発環境で異なる OAuth クライアントを使用することを推奨

3. **トークンの保管**
   - セッショントークンは Supabase SDK が自動的に安全に保管
   - AsyncStorage（iOS/Android）または localStorage（Web）に暗号化されて保存

## 参考リンク

- [Supabase Auth - OAuth Providers](https://supabase.com/docs/guides/auth/social-login)
- [Supabase Auth - Native Mobile Deep Linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)
- [Expo - Authentication](https://docs.expo.dev/guides/authentication/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
