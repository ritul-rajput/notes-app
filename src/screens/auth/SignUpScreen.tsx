import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TextField } from '../../components/form/TextField';
import { PrimaryButton } from '../../components/form/PrimaryButton';
import { colors, spacing, typography, borderRadius } from '../../theme';
import { validateEmail, validatePassword, getEmailError, getPasswordError } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';

export const SignUpScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const { signUp, isLoading } = useAuth();
  const { navigateTo } = useNavigation();

  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const handleNameChange = (text: string) => {
    setName(text);
    if (nameError) {
      setNameError(null);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      setPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      setConfirmPasswordError(null);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }

    // Validate email
    const emailErr = getEmailError(email);
    setEmailError(emailErr);
    if (emailErr) isValid = false;

    // Validate password
    const passwordErr = getPasswordError(password);
    setPasswordError(passwordErr);
    if (passwordErr) isValid = false;

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await signUp(email, password, name.trim());
      navigateTo('home');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Please try again');
    }
  };

  const handleBackToLogin = () => {
    navigateTo('login');
  };

  const isFormValid = 
    name.trim().length > 0 &&
    validateEmail(email) && 
    validatePassword(password) &&
    password === confirmPassword;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={[styles.appTitle, { color: theme.primary }]}>
            📝 Quick Notes
          </Text>
          <Text style={[styles.welcomeTitle, { color: theme.text }]}>
            Create Account
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
            Sign up to sync your notes across all devices
          </Text>
        </View>

        {/* Sign Up Form */}
        <View style={styles.formSection}>
          <TextField
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={handleNameChange}
            autoCapitalize="words"
            autoComplete="name"
            error={nameError}
          />

          <TextField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={emailError}
          />

          <TextField
            label="Password"
            placeholder="Create a password (min. 6 characters)"
            value={password}
            onChangeText={handlePasswordChange}
            isPassword
            autoCapitalize="none"
            autoComplete="password"
            error={passwordError}
          />

          <TextField
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            isPassword
            autoCapitalize="none"
            autoComplete="password"
            error={confirmPasswordError}
          />

          <PrimaryButton
            title="Create Account"
            onPress={handleSignUp}
            disabled={!isFormValid}
            loading={isLoading}
            style={styles.signUpButton}
          />
        </View>

        {/* Info Box */}
        <View style={[styles.infoBox, { backgroundColor: theme.surface }]}>
          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>

        {/* Back to Login */}
        <View style={styles.loginSection}>
          <Text style={[styles.loginText, { color: theme.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text style={[styles.loginLink, { color: theme.primary }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  appTitle: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
  welcomeTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    fontSize: typography.fontSize.md,
    textAlign: 'center',
    lineHeight: typography.lineHeight.lg,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  signUpButton: {
    marginTop: spacing.md,
  },
  infoBox: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
  },
  infoText: {
    fontSize: typography.fontSize.xs,
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: typography.fontSize.md,
  },
  loginLink: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
