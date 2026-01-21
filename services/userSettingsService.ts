import type { UserSettings, UserSettingsInsert, UserSettingsUpdate } from '@/types/database';
import { supabase } from './supabase';

/**
 * ユーザー設定サービス
 * ユーザーの個人設定をuser_settingsテーブルで管理
 */

/**
 * ユーザー設定を取得
 */
export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // レコードが存在しない場合はnullを返す
      return null;
    }
    console.error('Failed to fetch user settings:', error);
    throw error;
  }

  return data;
}

/**
 * ユーザー設定を作成
 */
export async function createUserSettings(settings: UserSettingsInsert): Promise<UserSettings> {
  const { data, error } = await supabase.from('user_settings').insert(settings).select().single();

  if (error) {
    console.error('Failed to create user settings:', error);
    throw error;
  }

  return data;
}

/**
 * ユーザー設定を更新
 */
export async function updateUserSettings(
  userId: string,
  settings: UserSettingsUpdate,
): Promise<UserSettings> {
  const { data, error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Failed to update user settings:', error);
    throw error;
  }

  return data;
}

/**
 * ユーザー設定を保存（upsert）
 * 存在しない場合は作成、存在する場合は更新
 */
export async function saveUserSettings(
  userId: string,
  settings: Omit<UserSettingsInsert, 'user_id'>,
): Promise<UserSettings> {
  // まず既存の設定を確認
  const existing = await getUserSettings(userId);

  if (existing) {
    // 更新
    return updateUserSettings(userId, settings);
  } else {
    // 新規作成
    return createUserSettings({ ...settings, user_id: userId });
  }
}

/**
 * ユーザー設定を削除
 */
export async function deleteUserSettings(userId: string): Promise<void> {
  const { error } = await supabase.from('user_settings').delete().eq('user_id', userId);

  if (error) {
    console.error('Failed to delete user settings:', error);
    throw error;
  }
}
