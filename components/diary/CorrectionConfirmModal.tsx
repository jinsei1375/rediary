import { Dialog } from '@/components/common/Dialog';
import { Button, Text, XStack, YStack } from 'tamagui';

type CorrectionConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  nativeContent: string;
  userContent: string;
};

export function CorrectionConfirmModal({ open, onConfirm, onCancel }: CorrectionConfirmModalProps) {
  return (
    <Dialog visible={open} onClose={onCancel} title="AI添削を実行しますか？" height="auto">
      <YStack gap="$4">
        <Text fontSize="$2" color="$gray10">
          ※ AI添削にはOpenAI APIを使用します
        </Text>

        <XStack gap="$3" justifyContent="flex-end" marginTop="$2">
          <Button
            onPress={onCancel}
            backgroundColor="$backgroundHover"
            color="$color"
            borderRadius="$3"
            pressStyle={{
              backgroundColor: '$backgroundPress',
            }}
          >
            キャンセル
          </Button>
          <Button
            backgroundColor="$primary"
            color="$background"
            onPress={onConfirm}
            borderRadius="$3"
            pressStyle={{
              backgroundColor: '$primaryPress',
            }}
          >
            実行
          </Button>
        </XStack>
      </YStack>
    </Dialog>
  );
}
