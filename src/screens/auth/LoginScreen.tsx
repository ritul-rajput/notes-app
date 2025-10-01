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

export const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { signIn, continueAsGuest, isLoading } = useAuth();
  const { navigateTo } = useNavigation();
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

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

  const validateForm = (): boolean => {
    const emailErr = getEmailError(email);
    const passwordErr = getPasswordError(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    return !emailErr && !passwordErr;
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await signIn(email, password);
      navigateTo('home');
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message || 'Please try again');
    }
  };

  const handleGuestMode = async () => {
    setIsGuestLoading(true);
    try {
      await continueAsGuest();
      navigateTo('home');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start guest mode');
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Navigate to forgot password screen
    Alert.alert('Forgot Password', 'This feature will be implemented soon');
  };

  const handleSignUp = () => {
    // TODO: Navigate to sign up screen
    Alert.alert('Sign Up', 'This feature will be implemented soon');
  };

  const isFormValid = validateEmail(email) && validatePassword(password);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.appTitle, { color: theme.primary }]}>
            📝 Quick Notes
          </Text>
          <Text style={[styles.welcomeTitle, { color: theme.text }]}>
            Welcome Back!
          </Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
            Sign in to access your notes across all devices
          </Text>
        </View>

        {/* Sign In Form */}
        <View style={styles.formSection}>
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
            placeholder="Enter your password"
            value={password}
            onChangeText={handlePasswordChange}
            isPassword
            autoCapitalize="none"
            autoComplete="password"
            error={passwordError}
          />

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <PrimaryButton
            title="Sign In"
            onPress={handleSignIn}
            disabled={!isFormValid}
            loading={isLoading}
            style={styles.signInButton}
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Text style={[styles.dividerText, { color: theme.textSecondary }]}>
            OR
          </Text>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
        </View>

        {/* Guest Mode Section */}
        <View style={styles.guestSection}>
          <View style={[styles.guestInfoBox, { backgroundColor: theme.surface }]}>
            <Text style={[styles.guestInfoTitle, { color: theme.text }]}>
              ⏰ Try Guest Mode
            </Text>
            <Text style={[styles.guestInfoText, { color: theme.textSecondary }]}>
              Use the app without an account. All notes in guest mode will be{' '}
              <Text style={[styles.guestInfoHighlight, { color: theme.warning }]}>
                automatically deleted after 24 hours
              </Text>
              .
            </Text>
          </View>

          <PrimaryButton
            title="Continue as Guest"
            onPress={handleGuestMode}
            variant="outline"
            loading={isGuestLoading}
            style={styles.guestButton}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpSection}>
          <Text style={[styles.signUpText, { color: theme.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={[styles.signUpLink, { color: theme.primary }]}>
              Sign Up
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
  welcomeSection: {
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  signInButton: {
    marginTop: spacing.sm,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  guestSection: {
    marginBottom: spacing.xl,
  },
  guestInfoBox: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  guestInfoTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  guestInfoText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.md,
  },
  guestInfoHighlight: {
    fontWeight: typography.fontWeight.semibold,
  },
  guestButton: {
    marginTop: spacing.sm,
  },
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: typography.fontSize.md,
  },
  signUpLink: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
  },
});
