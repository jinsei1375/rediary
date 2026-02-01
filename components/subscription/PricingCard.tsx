import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Button, Text, XStack, YStack } from 'tamagui';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  isCurrentPlan?: boolean;
  hideButton?: boolean;
}

export const PricingCard = React.memo(
  ({
    title,
    price,
    features,
    onPress,
    loading = false,
    disabled = false,
    isCurrentPlan = false,
    hideButton = false,
  }: PricingCardProps) => {
    return (
      <YStack
        backgroundColor="$cardBg"
        borderRadius="$6"
        borderWidth={2}
        borderColor={isCurrentPlan ? '$primary' : '$gray6'}
        padding="$6"
        gap="$4"
        opacity={isCurrentPlan ? 0.8 : 1}
      >
        <YStack gap="$2" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$textPrimary">
            {title}
          </Text>
          <Text fontSize="$9" fontWeight="bold" color="$primary">
            {price}
          </Text>
        </YStack>

        <YStack gap="$2">
          {features.map((feature, index) => (
            <XStack key={index} alignItems="center" gap="$1">
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text fontSize="$4" color="$textPrimary">
                {feature}
              </Text>
            </XStack>
          ))}
        </YStack>

        {!hideButton &&
          (isCurrentPlan ? (
            <Button
              size="$5"
              borderRadius="$3"
              backgroundColor="$gray6"
              disabled={true}
              marginTop="$2"
            >
              <Text fontSize="$5" fontWeight="bold" color="$gray11">
                現在利用中
              </Text>
            </Button>
          ) : (
            <PrimaryButton onPress={onPress} marginTop="$2" disabled={loading || disabled}>
              <Text fontSize="$5" fontWeight="bold" color="$btnPrimaryText">
                {loading ? '処理中...' : '登録する'}
              </Text>
            </PrimaryButton>
          ))}
      </YStack>
    );
  },
);

PricingCard.displayName = 'PricingCard';
