import type { DiaryFormData } from '@/types/ui';
import React, { useCallback } from 'react';
import { Button, ScrollView, Spinner, Text, YStack } from 'tamagui';
import { DiaryTextInput } from './DiaryTextInput';

type DiaryFormProps = {
  formData: DiaryFormData;
  onFormChange: (field: keyof DiaryFormData, value: string) => void;
  onSave: () => void;
  saving: boolean;
};

export const DiaryForm = React.memo(
  ({ formData, onFormChange, onSave, saving }: DiaryFormProps) => {
    const handleTitleChange = useCallback(
      (text: string) => onFormChange('title', text),
      [onFormChange]
    );

    const handleContentChange = useCallback(
      (text: string) => onFormChange('content', text),
      [onFormChange]
    );

    const handleContentNativeChange = useCallback(
      (text: string) => onFormChange('content_native', text),
      [onFormChange]
    );

    return (
      <YStack flex={1}>
        <ScrollView
          flex={1}
          padding="$4"
          contentContainerStyle={{
            paddingBottom: '$4',
          }}
        >
          <DiaryTextInput
            label="タイトル"
            value={formData.title}
            onChangeText={handleTitleChange}
            placeholder="YYYY/MM/DD"
          />

          <DiaryTextInput
            label="内容（英語）"
            subLabel="実際に書く英語の日記"
            value={formData.content}
            onChangeText={handleContentChange}
            placeholder="Today..."
            multiline
          />

          <DiaryTextInput
            label="内容（日本語）"
            subLabel="本来英語として書きたかった内容"
            value={formData.content_native}
            onChangeText={handleContentNativeChange}
            placeholder="今日は..."
            multiline
          />
        </ScrollView>

        <Button
          backgroundColor={saving ? '$backgroundPress' : '$primary'}
          margin="$4"
          height="$5"
          borderRadius="$3"
          onPress={onSave}
          disabled={saving}
          alignItems="center"
          justifyContent="center"
          pressStyle={{
            backgroundColor: '$primaryPress',
          }}
        >
          {saving ? (
            <Spinner color="$background" />
          ) : (
            <Text color="$background" fontSize="$5" fontWeight="bold">
              保存
            </Text>
          )}
        </Button>
      </YStack>
    );
  }
);

DiaryForm.displayName = 'DiaryForm';
