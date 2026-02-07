import { Dialog } from '@/components/common/Dialog';
import { useState } from 'react';
import { Button, Input, Text, XStack, YStack } from 'tamagui';

type DeleteExpressionDialogProps = {
  visible: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  expressionText: string;
  translationText: string;
};

export function DeleteExpressionDialog({
  visible,
  onClose,
  onDelete,
  expressionText,
  translationText,
}: DeleteExpressionDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

  return (
    <Dialog visible={visible} onClose={onClose} height={450} title="削除">
      <YStack gap="$4" padding="$4">
        <Text fontSize="$3" color="$textSecondary" lineHeight={22}>
          この表現を削除してもよろしいですか？
        </Text>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="600" color="$textPrimary">
            ネイティブ表現
          </Text>
          <Input
            value={translationText}
            editable={false}
            fontSize="$4"
            backgroundColor="$gray3"
            borderWidth={1}
            borderColor="$borderColor"
            padding="$3"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            color="$textPrimary"
          />
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="600" color="$textPrimary">
            翻訳
          </Text>
          <Input
            value={expressionText}
            editable={false}
            fontSize="$4"
            backgroundColor="$gray3"
            borderWidth={1}
            borderColor="$borderColor"
            padding="$3"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            color="$textPrimary"
          />
        </YStack>

        <Text fontSize="$2" color="$textTertiary">
          ※ この操作は取り消せません
        </Text>

        <XStack gap="$3" marginTop="$2">
          <Button flex={1} backgroundColor="$bgSecondary" onPress={onClose} disabled={deleting}>
            キャンセル
          </Button>
          <Button
            flex={1}
            backgroundColor="$error"
            color="white"
            onPress={handleDelete}
            disabled={deleting}
            opacity={deleting ? 0.5 : 1}
          >
            削除
          </Button>
        </XStack>
      </YStack>
    </Dialog>
  );
}
