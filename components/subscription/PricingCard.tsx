import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, XStack, YStack } from 'tamagui';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  onPress: () => void;
  loading?: boolean;
}

export const PricingCard = React.memo(
  ({ title, price, features, onPress, loading = false }: PricingCardProps) => {
    return (
      <YStack
        backgroundColor="$cardBg"
        borderRadius="$6"
        borderWidth={2}
        borderColor="$primary"
        padding="$6"
        gap="$4"
      >
        <YStack gap="$2" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$textPrimary">
            {title}
          </Text>
          <Text fontSize="$9" fontWeight="bold" color="$primary">
            {price}
          </Text>
        </YStack>

        <YStack gap="$3">
          {features.map((feature, index) => (
            <XStack key={index} alignItems="center" gap="$2">
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text fontSize="$4" color="$textPrimary">
                {feature}
              </Text>
            </XStack>
          ))}
        </YStack>

        <PrimaryButton onPress={onPress} marginTop="$2" disabled={loading}>
          <Text fontSize="$5" fontWeight="bold" color="$btnPrimaryText">
            {loading ? '処理中...' : '登録する'}
          </Text>
        </PrimaryButton>
      </YStack>
    );
  },
);

PricingCard.displayName = 'PricingCard';
