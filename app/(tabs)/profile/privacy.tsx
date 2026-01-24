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
          <Text fontSize="$3" color="$color" lineHeight={24}>
            Rediary（以下「当アプリ」）は、ユーザーの皆様の個人情報保護を最重要課題と考え、以下のプライバシーポリシーに基づき適切に取り扱います。
          </Text>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              1. 収集する情報
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、以下の情報を収集します：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
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
                • アプリの使用状況に関するデータ
              </Text>
            </YStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              2. AI技術の使用について
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、OpenAI APIを使用して以下の機能を提供しています：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 日記の文章校正と提案
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 言語学習のための添削
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • ネイティブ表現の提案
              </Text>
            </YStack>
            <Text fontSize="$3" color="$color" lineHeight={24} marginTop="$2">
              ユーザーが入力した日記の内容は、AI処理のためにOpenAI社のサーバーに送信されます。OpenAI社のデータ使用に関する詳細は、OpenAI社のプライバシーポリシーをご確認ください。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              3. 情報の利用目的
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              収集した情報は以下の目的で利用します：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • サービスの提供および改善
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • ユーザーサポート
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 学習効果の分析と最適化
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • セキュリティの維持
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 法令遵守
              </Text>
            </YStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              4. 情報の第三者提供
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • ユーザーの同意がある場合
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 法令に基づく場合
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • サービス提供に必要な範囲で業務委託先（OpenAI等）に提供する場合
              </Text>
            </YStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              5. データの保管と保護
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、Supabaseを使用してデータを安全に保管しています。適切な技術的・組織的セキュリティ対策を講じ、不正アクセス、紛失、破壊、改ざん、漏洩から保護します。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              6. ユーザーの権利
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              ユーザーは以下の権利を有します：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 自己の個人情報の開示請求
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 個人情報の訂正、削除の請求
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • アカウントの削除
              </Text>
            </YStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              7. Cookieとトラッキング
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、ユーザー体験の向上のためにローカルストレージを使用します。これには認証情報や設定情報が含まれます。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              8. 子供のプライバシー
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは13歳未満のユーザーを対象としていません。13歳未満の方は保護者の同意を得てご利用ください。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              9. プライバシーポリシーの変更
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、必要に応じてプライバシーポリシーを変更することがあります。重要な変更がある場合は、アプリ内で通知します。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              10. お問い合わせ
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              プライバシーに関するご質問やご懸念がある場合は、アプリ内のサポート機能からお問い合わせください。
            </Text>
          </YStack>

          <Text fontSize="$2" color="$placeholderColor" marginTop="$4">
            最終更新日: 2026年1月24日
          </Text>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
