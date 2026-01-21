import { INPUT_ACCESSORY_VIEW_ID } from '@/constants/inputAccessory';
import type { DiaryFormData } from '@/types/ui';
import React, { useCallback, useRef } from 'react';
import {
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Spinner, Text, YStack, useTheme } from 'tamagui';
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

// Header height estimation (padding + text + border)
const HEADER_HEIGHT = 60;

export const DiaryForm = React.memo(
  ({ formData, onFormChange, onSave, saving, children }: DiaryFormProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);
    const titleRef = useRef<View>(null);
    const contentRef = useRef<View>(null);
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

    // 共通のフォーカスハンドラー
    const handleFocus = useCallback(
      (ref: React.RefObject<View | null>, shouldScrollToTop: boolean = false) => {
        // キーボードが表示されるのを待つ
        setTimeout(() => {
          if (!scrollViewRef.current || !ref.current) return;

          // タイトルの場合は一番上にスクロール
          if (shouldScrollToTop) {
            scrollViewRef.current.scrollTo({
              y: 0,
              animated: true,
            });
            return;
          }

          ref.current.measureLayout(
            scrollViewRef.current as any,
            (x, y) => {
              // ラベルがヘッダーの下に来るように調整
              // ヘッダー高さ + セーフエリア + 少しマージン
              const offset = HEADER_HEIGHT + insets.top + 8;
              scrollViewRef.current?.scrollTo({
                y: Math.max(0, y - offset),
                animated: true,
              });
            },
            () => {
              // measureLayoutが失敗した場合は何もしない
              // (キーボードが自動的にビューを調整する)
            },
          );
        }, 100);
      },
      [insets.top],
    );

    const handleTitleFocus = useCallback(() => {
      handleFocus(titleRef, true);
    }, [handleFocus]);

    const handleContentFocus = useCallback(() => {
      handleFocus(contentRef, false);
    }, [handleFocus]);

    const handleContentNativeFocus = useCallback(() => {
      handleFocus(contentNativeRef, false);
    }, [handleFocus]);

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
          >
            <View ref={titleRef} collapsable={false}>
              <DiaryTextInput
                label="タイトル"
                value={formData.title}
                onChangeText={handleTitleChange}
                onFocus={handleTitleFocus}
                placeholder="YYYY/MM/DD"
              />
            </View>

            <View ref={contentRef} collapsable={false}>
              <DiaryTextInput
                label="内容（英語）"
                subLabel="実際に書く英語の日記"
                value={formData.content}
                onChangeText={handleContentChange}
                onFocus={handleContentFocus}
                placeholder="Today..."
                multiline
                maxLength={MAX_LENGTH_ENGLISH}
              />
            </View>

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

        {Platform.OS === 'ios' && (
          <InputAccessoryView nativeID={INPUT_ACCESSORY_VIEW_ID}>
            <View
              style={[
                styles.accessoryContainer,
                {
                  backgroundColor: theme.background?.get(),
                  borderTopColor: theme.borderColor?.get(),
                },
              ]}
            >
              <Pressable onPress={() => Keyboard.dismiss()} style={styles.doneButton}>
                <Text style={[styles.doneButtonText, { color: theme.blue10?.get() || '#007AFF' }]}>
                  完了
                </Text>
              </Pressable>
            </View>
          </InputAccessoryView>
        )}
      </KeyboardAvoidingView>
    );
  },
);

const styles = StyleSheet.create({
  accessoryContainer: {
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  doneButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

DiaryForm.displayName = 'DiaryForm';
