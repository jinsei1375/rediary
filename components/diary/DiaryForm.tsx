import type { DiaryFormData } from '@/types/ui';
import React, { useCallback, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Button, Spinner, Text, YStack } from 'tamagui';
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
    const scrollViewRef = useRef<ScrollView>(null);
    const contentNativeRef = useRef<View>(null);
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

    const handleContentNativeFocus = useCallback(() => {
      setTimeout(() => {
        contentNativeRef.current?.measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
        });
      }, 100);
    }, []);

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <YStack flex={1}>
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, padding: 16 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
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

            <View ref={contentNativeRef} collapsable={false}>
              <DiaryTextInput
                label="内容（日本語）"
                subLabel="本来英語として書きたかった内容"
                value={formData.content_native}
                onChangeText={handleContentNativeChange}
                onFocus={handleContentNativeFocus}
                placeholder="今日は..."
                multiline
                maxLength={MAX_LENGTH_JAPANESE}
              />
            </View>

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
