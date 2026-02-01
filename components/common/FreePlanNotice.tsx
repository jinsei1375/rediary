import { router } from 'expo-router';
import React from 'react';
import { Text, YStack } from 'tamagui';

type FreePlanNoticeProps = {
  title: string;
  message: string;
  upgradeText: string;
  showWarningIcon?: boolean;
};

export const FreePlanNotice: React.FC<FreePlanNoticeProps> = ({
  title,
  message,
  upgradeText,
  showWarningIcon = true,
}) => {
  return (
    <YStack
      backgroundColor="$yellow3"
      padding="$3"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$yellow7"
      gap="$2"
    >
      <Text fontSize="$3" fontWeight="600" color="$yellow11">
        {showWarningIcon && '⚠️ '}
        {title}
      </Text>
      <Text fontSize="$2" color="$yellow11">
        {message}
      </Text>
      <Text
        fontSize="$2"
        color="$blue10"
        fontWeight="600"
        textDecorationLine="underline"
        onPress={() => router.push('/(tabs)/profile/subscription')}
      >
        {upgradeText}
      </Text>
    </YStack>
  );
};
