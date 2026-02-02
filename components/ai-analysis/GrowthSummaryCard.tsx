import type { GrowthSummary } from '@/types/database';
import React from 'react';
import { Card, H4, Separator, Text, XStack, YStack } from 'tamagui';

interface GrowthSummaryCardProps {
  summary: GrowthSummary;
}

export function GrowthSummaryCard({ summary }: GrowthSummaryCardProps) {
  return (
    <Card p="$4" bg="$background" borderWidth={1} borderColor="$borderColor" elevation={2}>
      <YStack gap="$4">
        <XStack ai="center" gap="$2">
          <YStack w={4} h={24} bg="$green10" borderRadius="$2" />
          <H4 color="$color">この期間の成長</H4>
        </XStack>

        <YStack gap="$4">
          {/* 改善点 */}
          <YStack gap="$2">
            <XStack ai="center" gap="$2">
              <YStack px="$2" py="$1" bg="$green3" borderRadius="$2">
                <Text fontWeight="700" fontSize="$2" color="$green11">
                  改善点
                </Text>
              </YStack>
            </XStack>
            <YStack gap="$2">
              {summary.improvements.map((item, i) => (
                <XStack key={i} gap="$2" ai="flex-start">
                  <YStack w={6} h={6} mt="$1.5" bg="$green9" borderRadius="$10" flexShrink={0} />
                  <Text fontSize="$3" f={1} lineHeight="$1">
                    {item}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </YStack>

          <Separator />

          {/* 継続的な課題 */}
          <YStack gap="$2">
            <XStack ai="center" gap="$2">
              <YStack px="$2" py="$1" bg="$orange3" borderRadius="$2">
                <Text fontWeight="700" fontSize="$2" color="$orange11">
                  継続的な課題
                </Text>
              </YStack>
            </XStack>
            <YStack gap="$2">
              {summary.ongoing_challenges.map((item, i) => (
                <XStack key={i} gap="$2" ai="flex-start">
                  <YStack w={6} h={6} mt="$1.5" bg="$orange9" borderRadius="$10" flexShrink={0} />
                  <Text fontSize="$3" f={1} lineHeight="$1">
                    {item}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </YStack>

          <Separator />

          {/* 総合評価 */}
          <YStack p="$3" bg="$blue2" borderRadius="$3" borderWidth={1} borderColor="$blue8">
            <Text color="$blue11" fontSize="$3" lineHeight="$1">
              {summary.overall_assessment}
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </Card>
  );
}
