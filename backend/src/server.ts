import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import notesRouter from './routes/notes';
import notebooksRouter from './routes/notebooks';
import { authMiddleware, initializeFirebaseAdmin } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Firebase Admin (optional)
initializeFirebaseAdmin();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API routes with auth middleware
app.use('/api/notes', authMiddleware, notesRouter);
app.use('/api/notebooks', authMiddleware, notebooksRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB connected');
    } else {
      console.log('⚠️  MongoDB URI not provided, using in-memory storage');
      console.log('   Set MONGODB_URI in .env for persistent storage');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('   Continuing without database (API will fail)');
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log('\n🚀 Quick Notes Backend Server');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 Notes API: http://localhost:${PORT}/api/notes`);
    console.log(`📚 Notebooks API: http://localhost:${PORT}/api/notebooks`);
    console.log('\n💡 Send x-user-id header with requests for testing');
    console.log('   Example: curl -H "x-user-id: test-user" http://localhost:3000/api/notes\n');
  });
};

startServer();
