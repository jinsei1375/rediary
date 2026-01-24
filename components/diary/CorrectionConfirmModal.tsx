import { Dialog } from '@/components/common/Dialog';
import { Button, Text, XStack, YStack } from 'tamagui';

type CorrectionConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  nativeContent: string;
  userContent: string;
};

export function CorrectionConfirmModal({
  open,
  onConfirm,
  onCancel,
  nativeContent,
  userContent,
}: CorrectionConfirmModalProps) {
  return (
    <Dialog visible={open} onClose={onCancel} title="AI添削を実行しますか？" height="auto">
      <YStack gap="$4">
        <Text color="$gray11" fontSize="$4">
          以下の内容でAIが添削を行います。
        </Text>

        <YStack gap="$2">
          <Text fontWeight="600" fontSize="$3" color="$color">
            書きたかった内容（日本語）：
          </Text>
          <Text fontSize="$3" color="$gray11" numberOfLines={3}>
            {nativeContent}
          </Text>
        </YStack>

        <YStack gap="$2">
          <Text fontWeight="600" fontSize="$3" color="$color">
            実際に書いた内容（英語）：
          </Text>
          <Text fontSize="$3" color="$gray11" numberOfLines={3}>
            {userContent}
          </Text>
        </YStack>

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
