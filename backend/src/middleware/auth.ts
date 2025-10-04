import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

let firebaseInitialized = false;

// Initialize Firebase Admin (optional)
export const initializeFirebaseAdmin = () => {
  try {
    const serviceAccountPath = process.env.FIREBASE_ADMIN_SDK_PATH;
    
    if (serviceAccountPath && !firebaseInitialized) {
      const serviceAccount = require(`../../${serviceAccountPath}`);
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      firebaseInitialized = true;
      console.log('✅ Firebase Admin initialized');
    } else {
      console.log('⚠️  Firebase Admin not initialized (optional)');
    }
  } catch (error) {
    console.log('⚠️  Firebase Admin initialization failed (optional):', error);
  }
};

// Auth middleware (optional Firebase token verification)
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const userId = req.headers['x-user-id'] as string;

    // For testing: allow requests with just x-user-id header
    if (userId && !authHeader) {
      return next();
    }

    // If Firebase is initialized and token is provided, verify it
    if (firebaseInitialized && authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.headers['x-user-id'] = decodedToken.uid;
        return next();
      } catch (error) {
        return res.status(401).json({ error: 'Invalid Firebase token' });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};
