import type { AiCorrection, CorrectionPoint, NativeExpression } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import { H5, Separator, Text, useTheme, XStack, YStack } from 'tamagui';

type CorrectionResultDisplayProps = {
  correction: AiCorrection;
};

export function CorrectionResultDisplay({ correction }: CorrectionResultDisplayProps) {
  const theme = useTheme();
  const correctionPoints = correction.correction_points as unknown as CorrectionPoint[];
  const nativeExpressions = correction.native_expressions as unknown as NativeExpression[];

  const getCorrectionTypeLabel = (type: CorrectionPoint['type']) => {
    const labels = {
      grammar: '文法',
      vocabulary: '語彙',
      style: 'スタイル',
      other: 'その他',
    };
    return labels[type] || type;
  };

  const getCorrectionTypeColor = (type: CorrectionPoint['type']) => {
    const colors = {
      grammar: theme.error.get(),
      vocabulary: theme.blue10.get(),
      style: theme.purple10.get(),
      other: theme.gray10.get(),
    };
    return colors[type] || theme.gray10.get();
  };

  return (
    <YStack gap="$5" paddingTop="$2">
      {/* 添削後の自然な英語 */}
      <YStack gap="$3">
        <XStack gap="$2" alignItems="center">
          <Ionicons name="checkmark-circle" size={20} color={theme.success.get()} />
          <H5 fontWeight="800" fontSize="$7" color="$color">
            添削後の自然な英語
          </H5>
        </XStack>
        <YStack
          padding="$3"
          backgroundColor="$green2"
          borderLeftWidth={4}
          borderLeftColor="$success"
          borderRadius="$3"
        >
          <Text fontSize="$5" lineHeight="$6" color="$gray12">
            {correction.corrected_content}
          </Text>
        </YStack>
      </YStack>

      <Separator borderColor="$borderColor" />

      {/* 添削ポイント */}
      <YStack gap="$3">
        <XStack gap="$2" alignItems="center">
          <Ionicons name="bulb" size={20} color={theme.warning.get()} />
          <H5 fontWeight="700" fontSize="$7" color="$color">
            添削ポイント
          </H5>
        </XStack>

        {correctionPoints && correctionPoints.length > 0 ? (
          <YStack gap="$4">
            {correctionPoints.map((point, index) => (
              <YStack key={index} gap="$2">
                <XStack gap="$2" alignItems="center">
                  <Text
                    fontSize="$2"
                    paddingHorizontal="$3"
                    paddingVertical="$1.5"
                    backgroundColor={getCorrectionTypeColor(point.type)}
                    borderRadius="$6"
                    color="$background"
                    fontWeight="600"
                  >
                    {getCorrectionTypeLabel(point.type)}
                  </Text>
                </XStack>

                <YStack gap="$2">
                  <XStack gap="$2" alignItems="flex-start">
                    <Text fontSize="$3" color="$gray11" fontWeight="600" minWidth={50}>
                      元
                    </Text>
                    <Text fontSize="$4" color="$red10" flex={1}>
                      {point.original}
                    </Text>
                  </XStack>

                  <XStack gap="$2" alignItems="flex-start">
                    <Text fontSize="$3" color="$gray11" fontWeight="600" minWidth={50}>
                      修正
                    </Text>
                    <Text fontSize="$4" color="$green10" flex={1}>
                      {point.corrected}
                    </Text>
                  </XStack>

                  <YStack padding="$3" backgroundColor="$gray3" borderRadius="$3" marginTop="$1">
                    <Text fontSize="$3" color="$gray11" lineHeight="$4">
                      {point.explanation}
                    </Text>
                  </YStack>
                </YStack>

                {index < correctionPoints.length - 1 && (
                  <Separator marginVertical="$2" borderColor="$gray6" />
                )}
              </YStack>
            ))}
          </YStack>
        ) : (
          <Text color="$gray10">添削ポイントはありません</Text>
        )}
      </YStack>

      <Separator borderColor="$borderColor" />

      {/* ネイティブがよく使う表現 */}
      <YStack gap="$3">
        <XStack gap="$2" alignItems="center">
          <Ionicons name="language" size={20} color={theme.purple10.get()} />
          <H5 fontWeight="700" fontSize="$7" color="$color">
            ネイティブ表現
          </H5>
        </XStack>

        {nativeExpressions && nativeExpressions.length > 0 ? (
          <YStack gap="$3">
            {nativeExpressions.map((expr, index) => (
              <YStack
                key={index}
                gap="$3"
                padding="$3"
                backgroundColor="$purple2"
                borderLeftWidth={3}
                borderLeftColor="$purple10"
                borderRadius="$3"
              >
                <Text fontSize="$5" fontWeight="700" color="$purple10" lineHeight="$5">
                  {expr.expression}
                </Text>

                <YStack gap="$2">
                  <Text fontSize="$3" color="$gray11" lineHeight="$4">
                    <Text fontWeight="600">意味：</Text>
                    {expr.meaning}
                  </Text>

                  <YStack gap="$1">
                    <Text fontSize="$2" color="$gray10" fontWeight="600">
                      使用例
                    </Text>
                    <Text fontSize="$3" fontStyle="italic" color="$gray11" lineHeight="$4">
                      "{expr.usage_example}"
                    </Text>
                    {expr.usage_example_translation && (
                      <Text fontSize="$3" color="$gray10" lineHeight="$4" marginTop="$1">
                        {expr.usage_example_translation}
                      </Text>
                    )}
                  </YStack>

                  {expr.context && (
                    <XStack gap="$2" alignItems="flex-start">
                      <Ionicons name="information-circle" size={16} color={theme.purple10.get()} />
                      <Text fontSize="$2" color="$gray10" flex={1} lineHeight="$1">
                        {expr.context}
                      </Text>
                    </XStack>
                  )}
                </YStack>
              </YStack>
            ))}
          </YStack>
        ) : (
          <Text color="$gray10">ネイティブ表現の提案はありません</Text>
        )}
      </YStack>
    </YStack>
  );
}
