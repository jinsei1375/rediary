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
          <Text fontSize="$3" color="$color" lineHeight={24}>
            本利用規約（以下「本規約」）は、Rediary（以下「当アプリ」）が提供するサービスの利用条件を定めるものです。ユーザーの皆様には、本規約に同意の上、当アプリをご利用いただきます。
          </Text>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第1条（適用）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              1. 本規約は、ユーザーと当アプリとの間の当アプリの利用に関わる一切の関係に適用されます。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              2. 当アプリが当アプリ上で掲載する規約やルールは、本規約の一部を構成するものとします。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第2条（利用登録）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              1. 登録希望者が当アプリの定める方法によって利用登録を申請し、当アプリがこれを承認することによって、利用登録が完了するものとします。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              2. 当アプリは、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 利用登録の申請に際して虚偽の事項を届け出た場合
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 本規約に違反したことがある者からの申請である場合
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • その他、当アプリが利用登録を相当でないと判断した場合
              </Text>
            </YStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第3条（アカウント管理）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              1. ユーザーは、自己の責任において、当アプリのアカウント情報を適切に管理するものとします。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              2. ユーザーは、いかなる場合にも、アカウント情報を第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              3. アカウント情報の管理不十分、使用上の過誤、第三者の使用等によって生じた損害に関する責任はユーザーが負うものとします。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第4条（サービスの内容）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、言語学習を支援する日記アプリとして、以下の機能を提供します：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 日記の作成、編集、削除機能
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • AI技術を活用した文章校正と提案機能
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 翻訳練習問題の提供
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 学習記録の管理と分析
              </Text>
            </YStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第5条（AI技術の利用）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              1. 当アプリは、OpenAI社のAPIを使用してAI機能を提供しています。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              2. AI機能によって生成された内容は参考情報であり、その正確性や適切性を保証するものではありません。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              3. ユーザーは、AI機能の利用に際して、自己の責任において判断し行動するものとします。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第6条（禁止事項）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              ユーザーは、当アプリの利用にあたり、以下の行為をしてはなりません：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 法令または公序良俗に違反する行為
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 犯罪行為に関連する行為
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 当アプリのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 当アプリの運営を妨害するおそれのある行為
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 他のユーザーに関する個人情報等を収集または蓄積する行為
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 不正アクセスをし、またはこれを試みる行為
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 他のユーザーに成りすます行為
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 当アプリが許諾しない自動化されたアクセス
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • その他、当アプリが不適切と判断する行為
              </Text>
            </YStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第7条（サービスの提供の停止等）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • サービスに係るコンピュータシステムの保守点検または更新を行う場合
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 地震、落雷、火災、停電または天災などの不可抗力により、サービスの提供が困難となった場合
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • コンピュータまたは通信回線等が事故により停止した場合
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • その他、当アプリがサービスの提供が困難と判断した場合
              </Text>
            </YStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第8条（著作権）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              1. ユーザーは、自ら著作権等の必要な知的財産権を有するか、または必要な権利者の許諾を得た情報のみ、当アプリに投稿することができます。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              2. ユーザーが投稿したコンテンツの著作権は、ユーザーに帰属します。ただし、当アプリは、サービスの提供、改善、プロモーション等の目的で、無償で使用する権利を有します。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第9条（利用制限および登録抹消）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします：
            </Text>
            <YStack paddingLeft="$3" gap="$2">
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 本規約のいずれかの条項に違反した場合
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • 登録事項に虚偽の事実があることが判明した場合
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={24}>
                • その他、当アプリがサービスの利用を適当でないと判断した場合
              </Text>
            </YStack>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第10条（免責事項）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              1. 当アプリは、本サービスに事実上または法律上の瑕疵がないことを保証するものではありません。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              2. 当アプリは、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。ただし、当アプリに故意または重過失がある場合はこの限りではありません。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              3. AI機能によって提供される情報は参考情報であり、その完全性、正確性、有用性等について、当アプリは一切保証しません。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第11条（サービス内容の変更等）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあります。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第12条（利用規約の変更）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              当アプリは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の本規約は、当アプリウェブサイトまたはアプリ内に掲示された時点から効力を生じるものとします。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第13条（通知または連絡）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              ユーザーと当アプリとの間の通知または連絡は、当アプリの定める方法によって行うものとします。
            </Text>
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$6" fontWeight="bold" color="$color">
              第14条（準拠法・裁判管轄）
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              1. 本規約の解釈にあたっては、日本法を準拠法とします。
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={24}>
              2. 本サービスに関して紛争が生じた場合には、当アプリの所在地を管轄する裁判所を専属的合意管轄とします。
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
