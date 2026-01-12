import { config } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    light: {
      background: '#fff',
      backgroundHover: '#f5f5f5',
      backgroundPress: '#ececec',
      backgroundFocus: '#f0f0f0',
      color: '#000',
      colorHover: '#333',
      colorPress: '#666',
      colorFocus: '#000',
      borderColor: '#e0e0e0',
      borderColorHover: '#ccc',
      borderColorFocus: '#007AFF',
      borderColorPress: '#999',
      placeholderColor: '#999',
      primary: '#5B8CFF',
      primaryHover: '#4A7BE8',
      primaryPress: '#3A6AD7',
      secondary: '#5856D6',
      success: '#34C759',
      warning: '#FF9500',
      error: '#FF3B30',
      blue1: '#E8F4FF',
      blue2: '#007AFF',
    },
    dark: {
      background: '#000',
      backgroundHover: '#1c1c1e',
      backgroundPress: '#2c2c2e',
      backgroundFocus: '#1c1c1e',
      color: '#fff',
      colorHover: '#e5e5e7',
      colorPress: '#c7c7cc',
      colorFocus: '#fff',
      borderColor: '#38383a',
      borderColorHover: '#48484a',
      borderColorFocus: '#0A84FF',
      borderColorPress: '#58585a',
      placeholderColor: '#8e8e93',
      primary: '#5B8CFF',
      primaryHover: '#6D9AFF',
      primaryPress: '#4A7BE8',
      secondary: '#5E5CE6',
      success: '#30D158',
      warning: '#FF9F0A',
      error: '#FF453A',
      blue1: '#1c2936',
      blue2: '#0A84FF',
    },
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
