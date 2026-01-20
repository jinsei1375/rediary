import type { DiaryFormData } from '@/types/ui';
import React, { useCallback } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Button, ScrollView, Spinner, Text, YStack } from 'tamagui';
import { DiaryTextInput } from './DiaryTextInput';

type DiaryFormProps = {
  formData: DiaryFormData;
  onFormChange: (field: keyof DiaryFormData, value: string) => void;
  onSave: () => void;
  saving: boolean;
  children?: React.ReactNode;
};

const MAX_LENGTH_ENGLISH = 1500;
const MAX_LENGTH_JAPANESE = 1000;

export const DiaryForm = React.memo(
  ({ formData, onFormChange, onSave, saving, children }: DiaryFormProps) => {
    const isContentOverLimit = formData.content.length > MAX_LENGTH_ENGLISH;
    const isContentNativeOverLimit = formData.content_native.length > MAX_LENGTH_JAPANESE;
    const isSaveDisabled = saving || isContentOverLimit || isContentNativeOverLimit;

    const handleTitleChange = useCallback(
      (text: string) => onFormChange('title', text),
      [onFormChange],
    );

    const handleContentChange = useCallback(
      (text: string) => onFormChange('content', text),
      [onFormChange],
    );

    const handleContentNativeChange = useCallback(
      (text: string) => onFormChange('content_native', text),
      [onFormChange],
    );

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <YStack flex={1}>
          <ScrollView
            flex={1}
            padding="$4"
            contentContainerStyle={{
              paddingBottom: '$4',
            }}
            keyboardShouldPersistTaps="handled"
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
              maxLength={MAX_LENGTH_ENGLISH}
            />

            <DiaryTextInput
              label="内容（日本語）"
              subLabel="本来英語として書きたかった内容"
              value={formData.content_native}
              onChangeText={handleContentNativeChange}
              placeholder="今日は..."
              multiline
              maxLength={MAX_LENGTH_JAPANESE}
            />

            {children}
          </ScrollView>

          <Button
            backgroundColor={isSaveDisabled ? '$gray8' : '$primary'}
            margin="$4"
            height="$5"
            borderRadius="$3"
            onPress={onSave}
            disabled={isSaveDisabled}
            alignItems="center"
            justifyContent="center"
            pressStyle={{
              backgroundColor: isSaveDisabled ? '$gray8' : '$primaryPress',
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
      </KeyboardAvoidingView>
    );
  },
);

DiaryForm.displayName = 'DiaryForm';
