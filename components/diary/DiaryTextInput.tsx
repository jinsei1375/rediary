import { INPUT_ACCESSORY_VIEW_ID } from '@/constants/inputAccessory';
import React, { useCallback } from 'react';
import { Alert, Platform, StyleSheet, TextInput } from 'react-native';
import { Text, XStack, YStack, useTheme } from 'tamagui';

type DiaryTextInputProps = {
  label: string;
  subLabel?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
  onFocus?: () => void;
};

export const DiaryTextInput = React.memo(
  ({
    label,
    subLabel,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    onFocus,
    maxLength,
  }: DiaryTextInputProps) => {
    const theme = useTheme();
    const currentLength = value.length;
    const isOverThreshold = maxLength ? currentLength > maxLength * 0.8 : false;
    const isOverLimit = maxLength ? currentLength > maxLength : false;

    const handleTextChange = useCallback(
      (text: string) => {
        if (maxLength && text.length > maxLength) {
          Alert.alert('文字数制限超過', `${maxLength}文字以内で入力してください`);
          return;
        }
        onChangeText(text);
      },
      [maxLength, onChangeText],
    );

    return (
      <YStack marginBottom="$4">
        <YStack marginBottom="$2">
          <Text fontSize="$5" fontWeight="bold" lineHeight="$5">
            {label}
          </Text>
          {subLabel && (
            <Text fontSize="$2" color="$placeholderColor" lineHeight="$1">
              {subLabel}
            </Text>
          )}
        </YStack>
        {multiline ? (
          <TextInput
            value={value}
            onChangeText={handleTextChange}
            onFocus={onFocus}
            placeholder={placeholder}
            multiline
            numberOfLines={6}
            inputAccessoryViewID={Platform.OS === 'ios' ? INPUT_ACCESSORY_VIEW_ID : undefined}
            style={[
              styles.textInput,
              {
                borderColor: theme.borderColor?.get(),
                backgroundColor: theme.background?.get(),
                color: theme.color?.get(),
              },
            ]}
            placeholderTextColor={theme.placeholderColor?.get()}
          />
        ) : (
          <TextInput
            value={value}
            onChangeText={handleTextChange}
            onFocus={onFocus}
            placeholder={placeholder}
            inputAccessoryViewID={Platform.OS === 'ios' ? INPUT_ACCESSORY_VIEW_ID : undefined}
            style={[
              styles.input,
              {
                borderColor: theme.borderColor?.get(),
                backgroundColor: theme.background?.get(),
                color: theme.color?.get(),
              },
            ]}
            placeholderTextColor={theme.placeholderColor?.get()}
          />
        )}
        {maxLength !== undefined && (
          <XStack justifyContent="flex-end" marginTop="$1">
            <Text fontSize="$2">
              <Text fontSize="$2" color={isOverThreshold ? '$red10' : '$gray10'}>
                {currentLength}
              </Text>
              <Text fontSize="$2" color="$gray10">
                /{maxLength}
              </Text>
            </Text>
          </XStack>
        )}
      </YStack>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 144,
    textAlignVertical: 'top',
  },
});

DiaryTextInput.displayName = 'DiaryTextInput';
