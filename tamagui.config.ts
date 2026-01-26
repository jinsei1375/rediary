import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    light: {
      // Tamagui標準の変数（互換性のため残す）
      background: '#ffffff',
      backgroundHover: '#f5f5f5',
      backgroundPress: '#ececec',
      backgroundFocus: '#f0f0f0',
      backgroundStrong: '#f9fafb',
      backgroundTransparent: 'rgba(255, 255, 255, 0)',
      color: '#111827',
      colorHover: '#374151',
      colorPress: '#6b7280',
      colorFocus: '#111827',
      colorTransparent: 'rgba(17, 24, 39, 0)',
      borderColor: '#e5e7eb',
      borderColorHover: '#d1d5db',
      borderColorFocus: '#5B8CFF',
      borderColorPress: '#9ca3af',
      placeholderColor: '#9ca3af',
      primary: '#5B8CFF',
      primaryHover: '#4A7BE8',
      primaryPress: '#3A6AD7',
      secondary: '#5856D6',
      secondaryHover: '#4745C5',
      secondaryPress: '#3634B4',
      success: '#10B981',
      successHover: '#059669',
      successPress: '#047857',
      warning: '#F59E0B',
      warningHover: '#D97706',
      warningPress: '#B45309',
      error: '#EF4444',
      errorHover: '#DC2626',
      errorPress: '#B91C1C',

      // カスタム変数（わかりやすい名前）
      // テキスト
      textPrimary: '#111827',
      textSecondary: '#6b7280',
      textTertiary: '#9ca3af',
      textInverse: '#ffffff',

      // 背景
      bgPrimary: '#ffffff',
      bgSecondary: '#f9fafb',
      bgTertiary: '#f5f5f5',

      // カード
      cardBg: '#f9fafb',
      cardBorder: '#e5e7eb',

      // ボタン
      btnPrimaryBg: '#5B8CFF',
      btnPrimaryText: '#ffffff',
      btnSecondaryBg: '#f9fafb',
      btnSecondaryText: '#111827',
      btnCancelBg: '#e5e7eb',
      btnCancelText: '#374151',

      // アクセント
      accentBlue: '#5B8CFF',
      accentGreen: '#10B981',
      accentRed: '#EF4444',
      accentYellow: '#F59E0B',

      // その他の色定義
      blue1: '#EFF6FF',
      blue2: '#DBEAFE',
      blue10: '#3B82F6',
      green2: '#D1FAE5',
      green7: '#15803d',
      green8: '#10B981',
      green10: '#10B981',
      purple2: '#F3E8FF',
      purple10: '#7C3AED',
      red2: '#FEE2E2',
      red7: '#dc2626',
      red8: '#EF4444',
      red10: '#EF4444',
      gray3: '#f3f4f6',
      gray6: '#d1d5db',
      gray9: '#6b7280',
      gray10: '#4b5563',
      gray11: '#374151',
      gray12: '#1f2937',
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowColorStrong: 'rgba(0, 0, 0, 0.2)',
    },
    dark: {
      // Tamagui標準の変数（互換性のため残す）
      background: '#111827',
      backgroundHover: '#1f2937',
      backgroundPress: '#374151',
      backgroundFocus: '#1f2937',
      backgroundStrong: '#1f2937',
      backgroundTransparent: 'rgba(17, 24, 39, 0)',
      color: '#f9fafb',
      colorHover: '#e5e7eb',
      colorPress: '#d1d5db',
      colorFocus: '#f9fafb',
      colorTransparent: 'rgba(249, 250, 251, 0)',
      borderColor: '#374151',
      borderColorHover: '#4b5563',
      borderColorFocus: '#5B8CFF',
      borderColorPress: '#6b7280',
      placeholderColor: '#9ca3af',
      primary: '#5B8CFF',
      primaryHover: '#4A7BE8',
      primaryPress: '#3A6AD7',
      secondary: '#5856D6',
      secondaryHover: '#4745C5',
      secondaryPress: '#3634B4',
      success: '#34D399',
      successHover: '#10B981',
      successPress: '#059669',
      warning: '#FBBF24',
      warningHover: '#F59E0B',
      warningPress: '#D97706',
      error: '#F87171',
      errorHover: '#EF4444',
      errorPress: '#DC2626',

      // カスタム変数（わかりやすい名前）
      // テキスト
      textPrimary: '#f9fafb',
      textSecondary: '#d1d5db',
      textTertiary: '#9ca3af',
      textInverse: '#111827',

      // 背景
      bgPrimary: '#111827',
      bgSecondary: '#1f2937',
      bgTertiary: '#374151',

      // カード
      cardBg: '#1f2937',
      cardBorder: '#374151',

      // ボタン
      btnPrimaryBg: '#5B8CFF',
      btnPrimaryText: '#ffffff',
      btnSecondaryBg: '#1f2937',
      btnSecondaryText: '#f9fafb',
      btnCancelBg: '#374151',
      btnCancelText: '#d1d5db',

      // アクセント
      accentBlue: '#5B8CFF',
      accentGreen: '#34D399',
      accentRed: '#F87171',
      accentYellow: '#FBBF24',

      // その他の色定義
      blue1: '#1e3a5f',
      blue2: '#1e40af',
      blue10: '#60A5FA',
      green2: '#064e3b',
      green7: '#4ade80',
      green8: '#34D399',
      green10: '#34D399',
      purple2: '#4c1d95',
      purple10: '#A78BFA',
      red2: '#7f1d1d',
      red7: '#f87171',
      red8: '#F87171',
      red10: '#F87171',
      gray3: '#374151',
      gray6: '#4b5563',
      gray9: '#9ca3af',
      gray10: '#d1d5db',
      gray11: '#e5e7eb',
      gray12: '#f3f4f6',
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowColorStrong: 'rgba(0, 0, 0, 0.5)',
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
