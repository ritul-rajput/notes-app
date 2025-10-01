/**
 * Quick Notes App
 * Main App Entry Point - Complete Flow Integration
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationProvider } from './src/context/NavigationContext';
import { MainNavigator } from './src/navigation/MainNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <StatusBar barStyle="dark-content" />
        <MainNavigator />
      </NavigationProvider>
    </AuthProvider>
  );
}
