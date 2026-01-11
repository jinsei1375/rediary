import type { DiaryFormData } from '@/types';
import React, { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DiaryTextInput } from './DiaryTextInput';

type DiaryFormProps = {
  formData: DiaryFormData;
  onFormChange: (field: keyof DiaryFormData, value: string) => void;
  onSave: () => void;
  saving: boolean;
};

export const DiaryForm = React.memo(({ formData, onFormChange, onSave, saving }: DiaryFormProps) => {
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
    <>
      <ScrollView style={styles.scrollView}>
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

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={onSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>保存</Text>
        )}
      </TouchableOpacity>
    </>
  );
});

DiaryForm.displayName = 'DiaryForm';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
