import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string | null;
  helperText?: string;
  isPassword?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  helperText,
  isPassword = false,
  value,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const hasError = Boolean(error);
  const showHelperText = error || helperText;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.surface,
              color: theme.text,
              borderColor: hasError ? theme.error : theme.border,
            },
          ]}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={isPassword && !isPasswordVisible}
          value={value}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Text style={{ color: theme.textSecondary, fontSize: 20 }}>
              {isPasswordVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {showHelperText && (
        <Text
          style={[
            styles.helperText,
            { color: hasError ? theme.error : theme.textSecondary },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
  },
  eyeIcon: {
    position: 'absolute',
    right: spacing.md,
    top: 15,
  },
  helperText: {
    fontSize: typography.fontSize.xs,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
