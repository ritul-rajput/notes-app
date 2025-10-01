export const colors = {
  light: {
    primary: '#007AFF',
    primaryDark: '#0051D5',
    secondary: '#5856D6',
    background: '#FFFFFF',
    surface: '#F2F2F7',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    card: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    primary: '#0A84FF',
    primaryDark: '#0051D5',
    secondary: '#5E5CE6',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    card: '#1C1C1E',
    shadow: 'rgba(255, 255, 255, 0.1)',
  },
};

export type ColorScheme = keyof typeof colors;
export type ThemeColors = typeof colors.light;
