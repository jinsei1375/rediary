import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type DiaryTextInputProps = {
  label: string;
  subLabel?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
};

export const DiaryTextInput = React.memo(
  ({ label, subLabel, value, onChangeText, placeholder, multiline = false }: DiaryTextInputProps) => {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>{label}</Text>
        {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
        <TextInput
          style={multiline ? styles.textArea : styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          scrollEnabled={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    );
  }
);

DiaryTextInput.displayName = 'DiaryTextInput';

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 150,
    backgroundColor: '#fff',
  },
});
