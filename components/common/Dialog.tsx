import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import { Button, Text, XStack, YStack, useTheme } from 'tamagui';

type DialogProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: string | number;
  width?: string;
};

export const Dialog = React.memo(
  ({ visible, onClose, title, children, height = '60%', width = '90%' }: DialogProps) => {
    const theme = useTheme();

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        accessibilityViewIsModal
        onRequestClose={onClose}
      >
        <YStack flex={1} justifyContent="center" alignItems="center" paddingHorizontal="$4">
          <TouchableWithoutFeedback onPress={onClose}>
            <YStack
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              backgroundColor="rgba(0,0,0,0.5)"
            />
          </TouchableWithoutFeedback>

          <YStack
            backgroundColor="$background"
            borderRadius="$4"
            padding="$4"
            width={width}
            height={height}
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
            elevation={5}
            zIndex={1}
          >
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$3">
              <Text fontSize="$6" fontWeight="700" color="$color">
                {title}
              </Text>
              <Button
                size="$3"
                circular
                backgroundColor="$gray3"
                onPress={onClose}
                pressStyle={{
                  backgroundColor: '$gray4',
                }}
              >
                <Ionicons name="close" size={20} color={theme.color.get()} />
              </Button>
            </XStack>

            {children}
          </YStack>
        </YStack>
      </Modal>
    );
  },
);

Dialog.displayName = 'Dialog';
