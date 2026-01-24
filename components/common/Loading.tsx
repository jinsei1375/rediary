import React from 'react';
import { Spinner, Text, YStack } from 'tamagui';

type LoadingProps = {
  message?: string;
};

export const Loading = React.memo(({ message = '読み込み中...' }: LoadingProps) => {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$bgPrimary">
      <Spinner size="large" color="$blue10" />
      <Text fontSize="$4" color="$gray11" marginTop="$4">
        {message}
      </Text>
    </YStack>
  );
});

Loading.displayName = 'Loading';
