export const LightTheme = {
  dark: false,
  colors: {
    primary: '#9EEA9E',
    background: '#FFFFFF',
    textPrimary: '#000000',
    textSecondary: '#555555',
    success: '#9EEA9E',
    error: '#dc2626',
    mortar: '#374151',
    card: '#EDEEEF',
    inputBorder: '#E5E7EB',
    placeholder: '#9CA3AF',
    buttonText: '#000000',
    locationCardBackground: '#E8F7EF',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    tabIconActive: '#0B0B0B',
    tabIconInactive: '#6B7280',
    tabTextActive: '#0B0B0B',
    tabTextInactive: '#6B7280',
    // NEW: explicit border color used across components
    border: '#E5E7EB',
  },
};

export const DarkTheme = {
  dark: true,
  colors: {
    primary: '#9EEA9E',
    background: '#0B0B0B',
    textPrimary: '#FFFFFF',
    textSecondary: '#B3B3B3',
    success: '#9EEA9E',
    error: '#ef4444',
    mortar: '#6B7280',
    card: '#151515',
    inputBorder: '#262626',
    placeholder: '#9CA3AF',
    buttonText: '#000000',
    locationCardBackground: '#0F1F14',
    tabBarBackground: '#0E0E0E',
    tabBarBorder: '#1F2937',
    tabIconActive: '#FFFFFF',
    tabIconInactive: '#6B7280',
    tabTextActive: '#0B0B0B',
    tabTextInactive: '#6B7280',
    // NEW: explicit border color for dark theme
    border: '#262626',
  },
};

export type ThemeType = typeof LightTheme; 

