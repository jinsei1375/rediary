import { Header } from '@/components/common/Header';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text, YStack } from 'tamagui';

export default function TermsScreen() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        title="利用規約"
        onBack={() => {
          router.push('/(tabs)/profile');
        }}
      />
      <ScrollView>
        <YStack padding="$4" gap="$4">
          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第1条（適用）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本利用規約（以下「本規約」といいます。）は、Rediary（以下「本アプリ」といいます。）の利用条件を定めるものです。ユーザーの皆さま（以下「ユーザー」といいます。）には、本規約に従って、本アプリをご利用いただきます。本アプリは本アプリの運営者（以下「運営者」といいます。）が提供します。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第2条（利用登録）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本アプリの利用にあたって、ユーザーはメールアドレスとパスワード、またはGoogle アカウントによる登録が必要です。登録されたアカウント情報は適切に管理する責任があります。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第3条（禁止事項）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24} marginBottom="$2">
              ユーザーは、本アプリの利用にあたり、以下の行為をしてはなりません。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • 法令または公序良俗に違反する行為
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • 犯罪行為に関連する行為
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • 他のユーザーに対する迷惑行為
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • 知的財産権を侵害する行為
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • 本アプリのサーバーまたはネットワークを妨害する行為
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • その他、運営者が不適切と判断する行為
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第4条（本アプリの提供の停止等）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24} marginBottom="$2">
              運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本アプリの全部または一部の提供を停止または中断することができるものとします。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • システムの保守点検または更新を行う場合
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • 地震、落雷、火災、停電等により提供が困難な場合
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              • その他、運営者が必要と判断した場合
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第5条（AI技術の利用）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本アプリは、OpenAI社のAPIを使用してAI添削機能を提供しています。AI機能によって生成された内容は参考情報であり、その正確性や適切性を保証するものではありません。ユーザーは、AI機能の利用に際して、自己の責任において判断し行動するものとします。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第6条（著作権）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              ユーザーが投稿したコンテンツの著作権は、ユーザーに帰属します。ただし、運営者は、サービスの提供、改善、プロモーション等の目的で、無償で使用する権利を有します。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第7条（個人情報の取り扱い）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              運営者は、ユーザーから取得した個人情報をプライバシーポリシーに従って適切に取り扱います。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第8条（免責事項）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              運営者は、本アプリに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。運営者は、本アプリの利用によってユーザーに生じたあらゆる損害について一切の責任を負いません。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第9条（利用停止・削除）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              ユーザーが本規約に違反した場合、運営者は事前通知なくアカウントの停止または削除を行うことがあります。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第10条（サービス内容の変更）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              運営者は、ユーザーへの事前の告知をもって、本アプリの内容を変更、追加または廃止することがあります。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$5" fontWeight="600" color="$color">
              第11条（準拠法・裁判管轄）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              本規約は日本法に準拠します。本アプリに関して紛争が生じた場合、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
            </Text>
          </YStack>

          <YStack marginTop="$4">
            <Text fontSize="$2" color="$placeholderColor" textAlign="center">
              制定日：2026/1/24
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
