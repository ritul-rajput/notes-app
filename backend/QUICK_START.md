# 🚀 Quick Start Guide

Get the backend running in under 2 minutes!

## Step 1: Install Dependencies (30 seconds)
```bash
cd backend
npm install
```

## Step 2: Start the Server (5 seconds)
```bash
npm run dev
```

You should see:
```
✅ MongoDB connected (or warning if not using MongoDB)
🚀 Quick Notes Backend Server
📡 Server running on http://localhost:3000
```

## Step 3: Test the API (30 seconds)

### Option A: Using the Test Script (Recommended)
```bash
chmod +x test-api.sh
./test-api.sh
```

### Option B: Manual Test
```bash
# Health check
curl http://localhost:3000/health

# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "x-user-id: test-user" \
  -d '{"title":"My First Note","content":"Hello World!"}'

# Get all notes
curl http://localhost:3000/api/notes -H "x-user-id: test-user"
```

## ✅ That's It!

Your backend is now running and ready to accept requests from your React Native app!

## 📱 Connect from React Native App

Update your app's API base URL:

**For iOS Simulator:**
```typescript
const API_URL = 'http://localhost:3000/api';
```

**For Android Emulator:**
```typescript
const API_URL = 'http://10.0.2.2:3000/api';
```

**For Physical Device (on same WiFi):**
```typescript
// Find your IP: ifconfig | grep "inet " | grep -v 127.0.0.1
const API_URL = 'http://YOUR_LOCAL_IP:3000/api';
```

## 🔧 Optional: Add MongoDB

For persistent storage (otherwise data is lost on restart):

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Update .env
echo "MONGODB_URI=mongodb://localhost:27017/quick-notes" >> .env

# Restart server
npm run dev
```

## 📚 Next Steps

- Read [README.md](README.md) for full API documentation
- Run `./test-api.sh` to see all endpoints in action
- Check [API Endpoints](#api-endpoints) section

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
# Change port in .env
echo "PORT=3001" >> .env
```

**Can't connect from app?**
- Check firewall settings
- Ensure device and computer are on same network
- Use correct IP address for your setup

## 🎉 Happy Coding!

Your backend is ready. Start building amazing features! 🚀
