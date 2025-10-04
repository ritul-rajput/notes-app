import auth from '@react-native-firebase/auth';
import { User, SignInCredentials, SignUpCredentials, AuthError } from '../types/auth';

/**
 * Firebase Authentication Service
 * Real authentication with Firebase
 */
class AuthService {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInCredentials): Promise<User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(credentials: SignUpCredentials): Promise<User> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );
      
      // Set display name if provided
      if (credentials.displayName) {
        await userCredential.user.updateProfile({
          displayName: credentials.displayName,
        });
      }
      
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Continue as guest (creates anonymous user)
   */
  async continueAsGuest(): Promise<User> {
    try {
      const userCredential = await auth().signInAnonymously();
      
      return this.mapFirebaseUser(userCredential.user);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): User | null {
    const firebaseUser = auth().currentUser;
    return firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return auth().currentUser !== null;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return auth().onAuthStateChanged((firebaseUser) => {
      const user = firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
      callback(user);
    });
  }

  // Helper methods
  private mapFirebaseUser(firebaseUser: any): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || 'User',
      isPremium: false,
      isGuest: firebaseUser.isAnonymous,
      createdAt: firebaseUser.metadata.creationTime 
        ? new Date(firebaseUser.metadata.creationTime) 
        : new Date(),
    };
  }

  private createAuthError(code: string, message: string): AuthError {
    return { code, message };
  }

  private handleAuthError(error: any): AuthError {
    if (error.code && error.message) {
      // Map Firebase error codes to user-friendly messages
      const errorMessages: Record<string, string> = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/email-already-in-use': 'An account already exists with this email',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/network-request-failed': 'Network error. Please check your connection',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
        'auth/operation-not-allowed': 'This sign-in method is not enabled',
      };

      const message = errorMessages[error.code] || error.message || 'An unexpected error occurred';
      return this.createAuthError(error.code, message);
    }
    
    return this.createAuthError('auth/unknown', error.message || 'An unexpected error occurred');
  }
}

export default new AuthService();
