import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { AppleNotesStyleScreen } from '../screens/editor/AppleNotesStyleScreen';

export const MainNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentScreen } = useNavigation();

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If not authenticated, always show login
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // If authenticated, show current screen
  switch (currentScreen) {
    case 'login':
      return <LoginScreen />;
    case 'home':
      return <HomeScreen />;
    case 'editor':
      return <AppleNotesStyleScreen />;
    default:
      return <HomeScreen />;
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});
