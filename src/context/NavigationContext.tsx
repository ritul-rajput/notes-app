import React, { createContext, useContext, useState, ReactNode } from 'react';

type Screen = 'login' | 'signup' | 'home' | 'editor';

interface Note {
  id: string;
  title: string;
  content: string;
  notebookId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface NavigationContextType {
  currentScreen: Screen;
  navigateTo: (screen: Screen, params?: any) => void;
  goBack: () => void;
  navigationParams: any;
  screenHistory: Screen[];
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [navigationParams, setNavigationParams] = useState<any>({});
  const [screenHistory, setScreenHistory] = useState<Screen[]>(['login']);

  const navigateTo = (screen: Screen, params?: any) => {
    setCurrentScreen(screen);
    setNavigationParams(params || {});
    setScreenHistory((prev) => [...prev, screen]);
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = screenHistory.slice(0, -1);
      setScreenHistory(newHistory);
      setCurrentScreen(newHistory[newHistory.length - 1]);
      setNavigationParams({});
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentScreen,
        navigateTo,
        goBack,
        navigationParams,
        screenHistory,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
