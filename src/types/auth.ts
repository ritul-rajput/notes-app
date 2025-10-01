export interface User {
  id: string;
  email: string;
  displayName?: string;
  isPremium: boolean;
  isGuest: boolean;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthError {
  code: string;
  message: string;
}
