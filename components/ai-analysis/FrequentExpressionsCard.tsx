import type { FrequentExpression } from '@/types/database';
import React from 'react';
import { Card, H4, Text, XStack, YStack } from 'tamagui';

interface FrequentExpressionsCardProps {
  expressions: FrequentExpression[];
}

export function FrequentExpressionsCard({ expressions }: FrequentExpressionsCardProps) {
  return (
    <Card p="$4" bg="$background" borderWidth={1} borderColor="$borderColor" elevation={2}>
      <YStack gap="$4">
        <XStack ai="center" gap="$2">
          <YStack w={4} h={24} bg="$blue10" borderRadius="$2" />
          <H4 color="$color">よく使う表現 TOP5</H4>
        </XStack>

        <YStack gap="$3">
          {expressions.map((expr, index) => (
            <YStack
              key={index}
              gap="$2"
              p="$3"
              bg="$blue2"
              borderRadius="$3"
              borderLeftWidth={3}
              borderLeftColor="$blue10"
            >
              <XStack jc="space-between" ai="center">
                <XStack ai="center" gap="$2" f={1}>
                  <YStack
                    minWidth={28}
                    h={28}
                    ai="center"
                    jc="center"
                    bg={index < 3 ? '$blue4' : '$gray4'}
                    borderRadius="$10"
                  >
                    <Text fontSize="$3" fontWeight="bold" color={index < 3 ? '$blue11' : '$gray11'}>
                      {index + 1}
                    </Text>
                  </YStack>
                  <Text fontWeight="600" fontSize="$4" f={1}>
                    {expr.expression}
                  </Text>
                </XStack>
                <YStack
                  px="$2"
                  py="$1"
                  bg="$blue3"
                  borderRadius="$2"
                  ai="center"
                  jc="center"
                  minWidth={50}
                >
                  <Text color="$blue11" fontSize="$2" fontWeight="600">
                    {expr.count}回
                  </Text>
                </YStack>
              </XStack>

              {expr.alternative_suggestions.length > 0 && (
                <YStack gap="$1">
                  <Text color="$gray11" fontSize="$2" fontWeight="600">
                    代替表現
                  </Text>
                  <Text color="$gray11" fontSize="$3">
                    {expr.alternative_suggestions.join(' / ')}
                  </Text>
                </YStack>
              )}

              {expr.usage_note && (
                <YStack p="$2" bg="$blue2" borderRadius="$2" borderWidth={1} borderColor="$blue8">
                  <Text color="$blue11" fontSize="$2">
                    {expr.usage_note}
                  </Text>
                </YStack>
              )}
            </YStack>
          ))}
        </YStack>
      </YStack>
    </Card>
  );
}
