import { Header } from '@/components/common/Header';
import { APP_NAME } from '@/constants/app';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: `${APP_NAME}とは何ですか？`,
    answer: `${APP_NAME}は、言語学習を支援する日記アプリです。日記を書くことで言語表現を学び、AI技術を活用した添削機能により効果的に語学力を向上させることができます。`,
  },
  {
    question: 'どのような機能がありますか？',
    answer:
      '主な機能として、日記の作成・編集・削除、AI による文章校正と提案、翻訳練習問題の自動生成、カレンダービューでの日記管理、学習記録のグラフ表示などがあります。',
  },
  {
    question: 'AI添削機能はどのように使いますか？',
    answer:
      '日記を書く際に、まず母語で書きたい内容を入力し、その後学習言語で実際に文章を書きます。AI が両方の内容を比較して、文法や語彙、表現の改善点を提案します。',
  },
  {
    question: 'どの言語に対応していますか？',
    answer:
      '現在、日本語と英語に対応しています。母語と学習言語を設定することで、両言語間での学習が可能です。',
  },
  {
    question: 'AI添削の精度はどの程度ですか？',
    answer:
      'OpenAI の最新技術を使用していますが、AI が生成した内容は参考情報として扱ってください。100%の正確性を保証するものではありませんので、重要な文章の場合は専門家に確認することをお勧めします。',
  },
  {
    question: '翻訳練習問題はどのように生成されますか？',
    answer:
      'AI 添削で見つかったネイティブ表現が自動的に翻訳練習問題として登録されます。これらの問題を定期的に復習することで、学んだ表現を定着させることができます。',
  },
  {
    question: '日記のデータは安全ですか？',
    answer:
      'はい。すべてのデータは Supabase を使用して暗号化され安全に保管されます。また、適切なセキュリティ対策を講じて不正アクセスから保護しています。',
  },
  {
    question: 'AI処理のために日記の内容はどこに送信されますか？',
    answer:
      'AI 添削機能を使用する際、日記の内容は OpenAI 社のサーバーに送信されます。OpenAI 社のデータ使用ポリシーについては、OpenAI 社のプライバシーポリシーをご確認ください。',
  },
  {
    question: 'Google アカウントでログインできますか？',
    answer:
      'はい。メールアドレスとパスワードでの登録に加えて、Google OAuth を使用したログインにも対応しています。',
  },
  {
    question: '複数のデバイスで使用できますか？',
    answer: 'はい。同じアカウントでログインすれば、複数のデバイスでデータを同期して使用できます。',
  },
  {
    question: '過去の日記を検索できますか？',
    answer: 'はい。カレンダービューから日付を選択することで、過去の日記を簡単に閲覧できます。',
  },
  {
    question: '学習の進捗はどのように確認できますか？',
    answer:
      'プロフィール画面で日記を書いた日数を確認できます。また、翻訳練習の正解率や学習記録も確認可能です。',
  },
  {
    question: '日記を削除するとどうなりますか？',
    answer:
      '日記を削除すると、その日記に関連する AI 添削や翻訳練習問題も一緒に削除されます。この操作は取り消すことができませんのでご注意ください。',
  },
  {
    question: 'アカウントを削除したい場合はどうすればいいですか？',
    answer:
      'アカウントの削除をご希望の場合は、アプリ内のサポート機能からお問い合わせください。アカウントを削除すると、すべてのデータが完全に削除され、復元できなくなります。',
  },
  {
    question: '利用料金はかかりますか？',
    answer:
      '基本的な機能は無料でご利用いただけます。将来的に有料プランを追加する可能性がありますが、その際は事前にお知らせします。',
  },
  {
    question: 'オフラインでも使用できますか？',
    answer:
      '日記の閲覧など一部の機能はオフラインでも利用できますが、AI 添削や翻訳練習問題の生成にはインターネット接続が必要です。',
  },
  {
    question: 'バグや不具合を見つけた場合はどうすればいいですか？',
    answer:
      'バグや不具合を発見された場合は、アプリ内のサポート機能から詳細をお知らせください。改善にご協力いただきありがとうございます。',
  },
  {
    question: '新機能のリクエストはできますか？',
    answer:
      'はい。新機能のご要望は大歓迎です。アプリ内のサポート機能からご提案ください。すべてのリクエストを検討させていただきます。',
  },
];

function FAQItemComponent({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <YStack backgroundColor="$backgroundStrong" borderRadius="$4" overflow="hidden">
      <XStack
        padding="$4"
        alignItems="center"
        justifyContent="space-between"
        pressStyle={{ opacity: 0.7 }}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text flex={1} fontSize="$4" fontWeight="600" color="$color" paddingRight="$3">
          {item.question}
        </Text>
        {isOpen ? (
          <ChevronUp size={20} color="$color" flexShrink={0} />
        ) : (
          <ChevronDown size={20} color="$color" flexShrink={0} />
        )}
      </XStack>
      {isOpen && (
        <YStack padding="$4" paddingTop="$0">
          <Text fontSize="$3" color="$color" lineHeight={24}>
            {item.answer}
          </Text>
        </YStack>
      )}
    </YStack>
  );
}

export default function FAQScreen() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title="よくある質問" />
      <ScrollView>
        <YStack padding="$4" gap="$3">
          {faqData.map((item, index) => (
            <FAQItemComponent key={index} item={item} />
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
