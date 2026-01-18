import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { Input, Label, Text, TextArea, XStack, YStack } from 'tamagui';

type DiaryTextInputProps = {
  label: string;
  subLabel?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
};

export const DiaryTextInput = React.memo(
  ({
    label,
    subLabel,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    maxLength,
  }: DiaryTextInputProps) => {
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
          <Label fontSize="$5" fontWeight="bold" lineHeight="$5">
            {label}
          </Label>
          {subLabel && (
            <Text fontSize="$2" color="$placeholderColor" lineHeight="$1">
              {subLabel}
            </Text>
          )}
        </YStack>
        {multiline ? (
          <TextArea
            value={value}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            size="$4"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$3"
            padding="$3"
            backgroundColor="$background"
            numberOfLines={6}
            focusStyle={{
              borderColor: '$borderColorFocus',
            }}
          />
        ) : (
          <Input
            value={value}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            size="$4"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius="$3"
            padding="$3"
            backgroundColor="$background"
            focusStyle={{
              borderColor: '$borderColorFocus',
            }}
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

DiaryTextInput.displayName = 'DiaryTextInput';
