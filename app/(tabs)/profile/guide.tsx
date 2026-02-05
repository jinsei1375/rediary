import { Header } from '@/components/common/Header';
import { BookOpen, Calendar, Edit3, PenTool, Sparkles, TrendingUp } from '@tamagui/lucide-icons';
import { ScrollView } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';

interface GuideSection {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  description: string;
}

const guideSections: GuideSection[] = [
  {
    icon: Edit3,
    title: '日記を書く',
    description:
      'まず母語で書きたい内容を入力し、次に学習言語で文章を書きます。日々の出来事や感じたことを自由に表現してみましょう。',
  },
  {
    icon: Sparkles,
    title: 'AI添削を受ける',
    description:
      'AIが母語と学習言語を比較して、文法や語彙、表現の改善点を提案します。ネイティブらしい表現を学ぶことができます。',
  },
  {
    icon: BookOpen,
    title: '翻訳練習で復習',
    description:
      'AI添削で見つかったネイティブ表現が自動的に翻訳練習問題として登録されます。定期的に復習して、学んだ表現を定着させましょう。',
  },
  {
    icon: Calendar,
    title: '過去の日記を振り返る',
    description:
      'カレンダービューから日付を選択して、過去の日記を簡単に閲覧できます。自分の成長を感じることができます。',
  },
  {
    icon: TrendingUp,
    title: '学習記録を確認',
    description:
      '日記を書いた日数や翻訳練習の正解率など、学習の進捗をグラフで確認できます。継続のモチベーションに繋がります。',
  },
];

interface FeatureCardProps {
  item: GuideSection;
  index: number;
}

function FeatureCard({ item, index }: FeatureCardProps) {
  const Icon = item.icon;

  return (
    <YStack backgroundColor="$backgroundStrong" borderRadius="$4" padding="$4" gap="$3">
      <XStack alignItems="center" gap="$3">
        <YStack
          backgroundColor="$primary"
          borderRadius="$8"
          width={40}
          height={40}
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={20} color="white" />
        </YStack>
        <Text fontSize="$5" fontWeight="700" color="$color">
          {index + 1}. {item.title}
        </Text>
      </XStack>
      <Text fontSize="$3" color="$color" lineHeight={22} paddingLeft="$8">
        {item.description}
      </Text>
    </YStack>
  );
}

export default function UserGuideScreen() {
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header title="利用ガイド" />
      <ScrollView>
        <YStack padding="$4" gap="$4">
          {/* Welcome Section */}
          <YStack gap="$3">
            <Text fontSize="$3" color="$color" lineHeight={22}>
              ReDiaryは、日記を書くことで言語学習を楽しく続けられるアプリです。書いた表現を繰り返し思い出すことで、「使える言語」へと変えていきましょう。
            </Text>
          </YStack>

          {/* Getting Started Section */}
          <YStack gap="$3" marginTop="$2">
            <Text fontSize="$5" fontWeight="bold" color="$color">
              基本的な使い方
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={22}>
              ReDiaryは5つのステップで言語学習をサポートします。
            </Text>
          </YStack>

          {/* Feature Cards */}
          {guideSections.map((item, index) => (
            <FeatureCard key={index} item={item} index={index} />
          ))}

          {/* Tips Section */}
          <YStack
            backgroundColor="$backgroundStrong"
            borderRadius="$4"
            padding="$4"
            gap="$3"
            marginTop="$2"
          >
            <XStack alignItems="center" gap="$2">
              <PenTool size={20} color="$primary" />
              <Text fontSize="$5" fontWeight="700" color="$color">
                継続のコツ
              </Text>
            </XStack>
            <YStack gap="$2" paddingLeft="$4">
              <Text fontSize="$3" color="$color" lineHeight={22}>
                • 毎日少しずつ書く習慣をつけましょう
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={22}>
                • 完璧を目指さず、まずは書くことを楽しみましょう
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={22}>
                • AI添削で学んだ表現を積極的に使ってみましょう
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={22}>
                • 翻訳練習を定期的に復習して、表現を定着させましょう
              </Text>
              <Text fontSize="$3" color="$color" lineHeight={22}>
                • 過去の日記を振り返って、自分の成長を実感しましょう
              </Text>
            </YStack>
          </YStack>

          {/* Bottom Message */}
          <YStack gap="$2" marginTop="$2" marginBottom="$4">
            <Text fontSize="$3" color="$color" lineHeight={22} textAlign="center">
              さあ、今日から日記を書いて、
            </Text>
            <Text fontSize="$3" color="$color" lineHeight={22} textAlign="center" fontWeight="600">
              言語学習の旅を始めましょう！
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
