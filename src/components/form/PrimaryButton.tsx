import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    if (variant === 'primary') {
      return {
        backgroundColor: isDisabled ? theme.border : theme.primary,
      };
    }
    if (variant === 'secondary') {
      return {
        backgroundColor: isDisabled ? theme.border : theme.secondary,
      };
    }
    return {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDisabled ? theme.border : theme.primary,
    };
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return isDisabled ? theme.textSecondary : theme.primary;
    }
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  text: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
