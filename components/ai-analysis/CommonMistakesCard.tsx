import type { CommonMistake } from '@/types/database';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Card, H4, Text, XStack, YStack, useTheme } from 'tamagui';

interface CommonMistakesCardProps {
  mistakes: CommonMistake[];
}

export function CommonMistakesCard({ mistakes }: CommonMistakesCardProps) {
  const theme = useTheme();
  return (
    <Card p="$4" bg="$background" borderWidth={1} borderColor="$borderColor" elevation={2}>
      <YStack gap="$4">
        <XStack ai="center" gap="$2">
          <YStack w={4} h={24} bg="$red10" borderRadius="$2" />
          <H4 color="$color">よく指摘されるミス TOP5</H4>
        </XStack>

        <YStack gap="$3">
          {mistakes.map((mistake, index) => (
            <YStack
              key={index}
              gap="$3"
              p="$3"
              bg="$red2"
              borderRadius="$3"
              borderLeftWidth={3}
              borderLeftColor="$red10"
            >
              <XStack jc="space-between" ai="center">
                <XStack ai="center" gap="$2" f={1}>
                  <YStack
                    minWidth={28}
                    h={28}
                    ai="center"
                    jc="center"
                    bg={index < 3 ? '$red4' : '$red3'}
                    borderRadius="$10"
                  >
                    <Text fontSize="$3" fontWeight="bold" color={index < 3 ? '$red11' : '$red10'}>
                      {index + 1}
                    </Text>
                  </YStack>
                  <Text fontWeight="600" fontSize="$4" color="$red11" f={1}>
                    {mistake.category}
                  </Text>
                </XStack>
                <YStack
                  px="$2"
                  py="$1"
                  bg="$red3"
                  borderRadius="$2"
                  ai="center"
                  jc="center"
                  minWidth={50}
                >
                  <Text color="$red11" fontSize="$2" fontWeight="600">
                    {mistake.count}回
                  </Text>
                </YStack>
              </XStack>

              {mistake.examples.length > 0 && (
                <YStack gap="$2">
                  {mistake.examples.slice(0, 2).map((ex, i) => (
                    <YStack key={i} gap="$1.5" p="$2" bg="$background" borderRadius="$2">
                      <XStack ai="center" gap="$2">
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={theme.red10?.get() ?? '#ef4444'}
                        />
                        <Text color="$red10" fontSize="$3" f={1}>
                          {ex.wrong}
                        </Text>
                      </XStack>
                      <XStack ai="center" gap="$2">
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={theme.green10?.get() ?? '#22c55e'}
                        />
                        <Text color="$green10" fontSize="$3" f={1}>
                          {ex.correct}
                        </Text>
                      </XStack>
                    </YStack>
                  ))}
                </YStack>
              )}

              <YStack p="$2" bg="$orange2" borderRadius="$2" borderWidth={1} borderColor="$orange8">
                <Text color="$orange11" fontSize="$2" fontWeight="500">
                  {mistake.how_to_improve}
                </Text>
              </YStack>
            </YStack>
          ))}
        </YStack>
      </YStack>
    </Card>
  );
}
