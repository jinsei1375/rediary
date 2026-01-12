import React from 'react';
import { Spinner, Text, YStack } from 'tamagui';

type LoadingProps = {
  message?: string;
};

export const Loading = React.memo(({ message = '読み込み中...' }: LoadingProps) => {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
      <Spinner size="large" color="$primary" />
      <Text fontSize="$4" color="$placeholderColor" marginTop="$3">
        {message}
      </Text>
    </YStack>
  );
});

Loading.displayName = 'Loading';
