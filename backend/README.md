# Quick Notes Backend API

RESTful API server for the Quick Notes mobile app. Built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📋 Prerequisites

### Optional: MongoDB (for persistent storage)
If you want persistent storage, install MongoDB:

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Then update .env:
MONGODB_URI=mongodb://localhost:27017/quick-notes
```

**Note:** The API works without MongoDB, but data won't persist between restarts.

### Optional: Firebase Admin (for auth verification)
1. Go to Firebase Console → Project Settings → Service Accounts
2. Generate new private key (downloads JSON file)
3. Save as `firebase-admin-sdk.json` in backend folder
4. Update `.env`:
   ```
   FIREBASE_ADMIN_SDK_PATH=./firebase-admin-sdk.json
   ```

## 🔌 API Endpoints

### Health Check
```bash
GET /health
```

### Notes API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes for user |
| GET | `/api/notes?pinned=true` | Get pinned notes |
| GET | `/api/notes?notebookId=xxx` | Get notes in notebook |
| GET | `/api/notes?limit=10` | Get recent notes (limited) |
| GET | `/api/notes/search?q=query` | Search notes |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create new note |
| PUT | `/api/notes/:id` | Update note |
| PATCH | `/api/notes/:id/pin` | Toggle pin status |
| DELETE | `/api/notes/:id` | Delete note |

### Notebooks API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notebooks` | Get all notebooks (tree structure) |
| POST | `/api/notebooks` | Create new notebook |
| PUT | `/api/notebooks/:id` | Update notebook |
| DELETE | `/api/notebooks/:id` | Delete notebook |

## 🧪 Testing with cURL

### Create a Note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{
    "title": "My First Note",
    "content": "This is a test note",
    "contentType": "text"
  }'
```

### Get All Notes
```bash
curl http://localhost:3000/api/notes \
  -H "x-user-id: test-user"
```

### Create a Notebook
```bash
curl -X POST http://localhost:3000/api/notebooks \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{
    "name": "Work Notes",
    "color": "#34C759",
    "icon": "💼"
  }'
```

### Get Notebooks Tree
```bash
curl http://localhost:3000/api/notebooks \
  -H "x-user-id: test-user"
```

### Search Notes
```bash
curl "http://localhost:3000/api/notes/search?q=test" \
  -H "x-user-id: test-user"
```

## 🔑 Authentication

### For Testing (Simple)
Include `x-user-id` header with any user ID:
```bash
-H "x-user-id: test-user"
```

### For Production (Firebase)
Include Firebase ID token:
```bash
-H "Authorization: Bearer <firebase-id-token>"
```

The API automatically extracts user ID from the token.

## 📁 Project Structure

```
backend/
├── src/
│   ├── models/
│   │   ├── Note.ts          # Note database model
│   │   └── Notebook.ts      # Notebook database model
│   ├── routes/
│   │   ├── notes.ts         # Notes API routes
│   │   └── notebooks.ts     # Notebooks API routes
│   ├── middleware/
│   │   └── auth.ts          # Authentication middleware
│   └── server.ts            # Main server file
├── .env                     # Environment configuration
├── package.json
└── tsconfig.json
```

## 🛠️ Available Scripts

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Run tests (to be implemented)
npm test
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port (default: 3000) | No |
| MONGODB_URI | MongoDB connection string | No |
| FIREBASE_ADMIN_SDK_PATH | Path to Firebase Admin SDK JSON | No |
| ALLOWED_ORIGINS | CORS allowed origins (comma-separated) | No |

## 📱 Connecting from React Native App

Update your app's API configuration to point to the backend:

```typescript
// In your React Native app
const API_URL = 'http://localhost:3000/api';

// For Android emulator, use:
const API_URL = 'http://10.0.2.2:3000/api';

// For physical device on same network:
const API_URL = 'http://192.168.x.x:3000/api';
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `brew services list`
- Check connection string in `.env`
- Try without MongoDB first (data won't persist)

### CORS Errors
- Update `ALLOWED_ORIGINS` in `.env`
- Add your app's URL to allowed origins

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process: `lsof -ti:3000 | xargs kill`

## 📝 API Response Format

### Success Response
```json
{
  "id": "note-123",
  "title": "My Note",
  "content": "Note content",
  ...
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## 🚢 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Set these in your hosting platform:
- `NODE_ENV=production`
- `MONGODB_URI=<production-mongodb-uri>`
- `FIREBASE_ADMIN_SDK_PATH=<path-to-sdk>`
- `ALLOWED_ORIGINS=<your-app-domains>`

## 📄 License

Proprietary - Part of Quick Notes App
