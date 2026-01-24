import { Header } from '@/components/common/Header';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text, YStack } from 'tamagui';

export default function PrivacyPolicyScreen() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        title="プライバシーポリシー"
        onBack={() => {
          router.push('/(tabs)/profile');
        }}
      />
      <ScrollView>
        <YStack padding="$4" gap="$4">
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              1. 収集する情報
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24} marginBottom="$2">
              本アプリでは、以下の情報を収集する場合があります：
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • アカウント情報（メールアドレス、パスワード）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • プロフィール情報（Google OAuth使用時）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • 日記の内容および言語学習データ
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • 学習記録と進捗情報
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • アプリの利用状況
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • デバイス情報（OS、機種など）
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              2. 情報の利用目的
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24} marginBottom="$2">
              収集した情報は以下の目的で利用します：
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • アプリの機能提供
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • サービスの改善
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • 技術的な問題の解決
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • ユーザーサポート
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              3. 情報の第三者提供
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本アプリの運営者は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              4. データの保存期間
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              ユーザーの情報は、アプリの利用に必要な期間中保存されます。アカウントを削除した場合、データベース内の情報は削除されます。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              5. セキュリティ
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本アプリの運営者は、収集した情報の安全性を確保するため、適切な技術的・組織的措置を講じています。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              6. 外部サービス
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24} marginBottom="$2">
              本アプリは以下の外部サービスを利用しています：
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • Supabase（データベース）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • OpenAI（AI文章校正）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • Expo（アプリ開発プラットフォーム）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24} marginTop="$2">
              これらのサービスにはそれぞれのプライバシーポリシーが適用されます。当アプリは、ユーザーの日記内容、学習データ等をSupabase（米国のデータセンターを利用する場合があります）およびOpenAI（AI添削機能使用時）に送信・保存します。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              7. AI技術の使用について
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本アプリでは、OpenAI APIを使用して日記の文章校正、添削、ネイティブ表現の提案機能を提供しています。AI添削機能を使用する際、ユーザーが入力した日記の内容はOpenAI社のサーバーに送信されます。送信されたデータの取り扱いについては、OpenAI社のプライバシーポリシーに従います。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              8. お問い合わせ
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本プライバシーポリシーに関するお問い合わせは、お問い合わせフォームからご連絡ください。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              9. プライバシーポリシーの変更
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本アプリの運営者は、必要に応じて本プライバシーポリシーを変更することがあります。重要な変更がある場合は、アプリ内で通知いたします。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              10. ユーザーの権利
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • データの確認・修正・削除を要求する権利
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • データポータビリティの権利
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • サービス利用停止の権利
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              11. お問い合わせ窓口
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本アプリに関するお問い合わせは、下記の窓口までご連絡ください。{'\n'}
              運営者：ensei{'\n'}
              E-mail: jinsei1375@gmail.com
            </Text>
          </YStack>

          <YStack marginTop="$4">
            <Text fontSize="$2" color="$placeholderColor" textAlign="center">
              制定日：2026年1月24日{'\n'}
              最終更新日：2026年1月24日
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
