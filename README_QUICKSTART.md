# 🚀 Quick Start Guide - View Login Screen

## Option 1: Run with Expo (Recommended - Fastest)

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Steps

1. **Install dependencies**:
   ```bash
   cd "/Users/ritulkumar/Desktop/Note taking App"
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **View the app**:
   - Press `w` to open in web browser (instant preview!)
   - Press `i` to open iOS simulator (requires Xcode)
   - Press `a` to open Android emulator (requires Android Studio)
   - Scan QR code with Expo Go app on your phone

## Option 2: Run on Web (Quickest Preview)

```bash
cd "/Users/ritulkumar/Desktop/Note taking App"
npm install
npm run web
```

Your browser will open automatically showing the Login Screen!

## Option 3: Use Expo Snack (No Installation)

1. Go to https://snack.expo.dev
2. Create a new snack
3. Copy the contents of each file from `src/` folders
4. Preview instantly in browser or on your phone

## What You'll See

✅ Welcome message with "📝 Quick Notes"
✅ Email and password inputs with validation
✅ "Forgot Password?" link
✅ "Sign In" button (disabled until form is valid)
✅ Guest mode info box with 24-hour warning
✅ "Continue as Guest" button
✅ "Sign Up" link at bottom
✅ Automatic dark/light mode support

## Test Credentials (Mock Mode)

```
Email: test@example.com
Password: password123
```

Or just click "Continue as Guest" to test guest mode!

## Troubleshooting

### "Module not found" errors
```bash
npm install --legacy-peer-deps
```

### Can't see the app
Make sure you're in the correct directory:
```bash
cd "/Users/ritulkumar/Desktop/Note taking App"
```

### Port already in use
```bash
npm start -- --port 8081
```

## Need Help?

- Expo docs: https://docs.expo.dev
- React Native docs: https://reactnative.dev

---

**Next Steps After Preview:**
1. Test the form validation
2. Try dark mode (system settings)
3. Test on mobile device with Expo Go
4. Move on to SignUp screen implementation
