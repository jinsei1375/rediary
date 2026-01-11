// ============================================
// Navigation Types (Expo Router)
// ============================================

export type RootStackParamList = {
  '(tabs)': undefined;
  login: undefined;
  'diary/[date]': { date: string };
};

export type TabParamList = {
  index: undefined;
  calendar: undefined;
  settings: undefined;
};
