# 📦 Build APK for Your Quick Notes App

## 🎯 Get Your APK File

Build an installable APK that you can:
- Install on any Android device
- Share with friends/testers
- Distribute without Play Store

---

## 🚀 Quick Method: Using EAS Build (Recommended)

### **Step 1: Install EAS CLI**

```bash
npm install -g eas-cli
```

### **Step 2: Login to Expo**

```bash
eas login
```

If you don't have an Expo account:
- It will prompt you to create one (free!)
- Or create at: https://expo.dev/signup

### **Step 3: Configure Build**

```bash
cd "/Users/ritulkumar/Desktop/Note taking App"
eas build:configure
```

This creates an `eas.json` file with build settings.

### **Step 4: Build APK**

```bash
eas build --platform android --profile preview
```

**What happens:**
1. Your code uploads to Expo servers
2. Builds in the cloud (5-10 minutes)
3. Gives you a download link!

**Timeline:**
- First build: 8-15 minutes
- Subsequent builds: 5-8 minutes

---

## 📥 Download Your APK

### **After Build Completes:**

You'll see output like:
```
✔ Build finished
   https://expo.dev/artifacts/eas/abc123xyz.apk
```

**Options:**
1. **Click the link** in terminal - downloads APK
2. **Go to:** https://expo.dev/accounts/[your-username]/projects/quick-notes-app/builds
3. **Download** the APK file

---

## 📱 Install APK on Android Device

### **Method 1: Direct Install**

1. **Transfer APK** to your phone (email, Airdrop, USB)
2. **Open APK** file on phone
3. **Allow installation** from unknown sources (if prompted)
4. **Install** and enjoy!

### **Method 2: Share Link**

The Expo download link works for 30 days:
- Share the link with testers
- They download and install
- No Google Play needed!

---

## ⚙️ Build Configuration

### **Your `eas.json` will look like:**

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### **Build Profiles:**

**preview** - For testing
- Creates APK file
- Can install directly
- Good for sharing

**production** - For Play Store
- Creates AAB (App Bundle)
- Optimized & smaller
- Required for Play Store

---

## 🎯 Complete Commands

```bash
# 1. Install EAS CLI (one time)
npm install -g eas-cli

# 2. Login (one time)
eas login

# 3. Configure (one time)
cd "/Users/ritulkumar/Desktop/Note taking App"
eas build:configure

# 4. Build APK (every time you want new build)
eas build --platform android --profile preview

# 5. Check build status
eas build:list
```

---

## ⏱️ Build Timeline

**First Build:**
```
Upload code: 1-2 min
Build in cloud: 8-15 min
Total: ~10-17 min ⏰
```

**Subsequent Builds:**
```
Upload code: 1 min
Build in cloud: 5-8 min
Total: ~6-9 min ⏰
```

---

## 📊 Build Progress

### **You'll see:**

```
✔ Compiling JavaScript
✔ Downloading dependencies
✔ Building Android project
✔ Packaging APK
✔ Build completed successfully!
```

### **Check Build Status:**

```bash
# In another terminal while building:
eas build:list

# Or visit:
https://expo.dev/accounts/[your-username]/builds
```

---

## 🎨 APK Details

**File Info:**
- **Name:** quick-notes-app.apk
- **Size:** ~25-35 MB
- **Min Android:** 5.0 (Lollipop)
- **Target Android:** 13

**What's Included:**
- ✅ All your code
- ✅ All dependencies
- ✅ Assets (icons, images)
- ✅ Complete app bundle

---

## 🔄 Alternative: Local Build (Advanced)

If you want to build locally (requires more setup):

```bash
# 1. Install all Android SDK tools
# 2. Generate keystore
# 3. Configure gradle
# 4. Build locally

# Not recommended for beginners
# EAS Build is much easier!
```

---

## 💰 Cost

**EAS Build:**
- **Free tier:** 30 builds/month
- **Hobby:** Unlimited builds ($29/month)
- **First month:** Usually free trial

**Your first APK:** FREE! ✨

---

## 📱 Testing Your APK

### **Before Sharing:**

1. **Install on your device**
2. **Test all features:**
   - [ ] Login works
   - [ ] Guest mode works
   - [ ] Notes load
   - [ ] Can create notes
   - [ ] Editor works
   - [ ] Navigation smooth
   - [ ] No crashes

3. **Share with testers**
4. **Get feedback**
5. **Make improvements**
6. **Build again!**

---

## 🚀 Quick Start (Copy & Paste)

```bash
# Run these commands in order:

# 1. Install EAS
npm install -g eas-cli

# 2. Login
eas login

# 3. Go to project
cd "/Users/ritulkumar/Desktop/Note taking App"

# 4. Configure
eas build:configure

# 5. Build APK
eas build --platform android --profile preview

# Wait 10-15 minutes, then download your APK!
```

---

## 🎯 What Happens Next

### **After Running Commands:**

1. **Creates Expo account** (if needed)
2. **Uploads your code** (~1 min)
3. **Builds in cloud** (8-15 min)
4. **Gives download link**
5. **You get APK file!** 📦

### **Share Your APK:**
- Email to friends
- Upload to website
- Send via messaging apps
- USB transfer to devices

---

## 🐛 Common Issues

### **"eas command not found"**
```bash
npm install -g eas-cli
# If still not working:
sudo npm install -g eas-cli
```

### **"Authentication failed"**
```bash
eas logout
eas login
# Enter credentials again
```

### **"Build failed"**
```bash
# Check error message
# Usually: update packages
npm install
# Try again
eas build --platform android --profile preview
```

---

## 📞 Need Help?

**EAS Build Docs:** https://docs.expo.dev/build/introduction/
**Expo Dashboard:** https://expo.dev/
**Support:** https://forums.expo.dev/

---

## ✅ Summary

**To get your APK:**

1. Run: `npm install -g eas-cli`
2. Run: `eas login`
3. Run: `eas build:configure`
4. Run: `eas build --platform android --profile preview`
5. Wait 10-15 minutes
6. Download APK from link
7. Install on any Android device! 🎉

**Your APK will be ready in ~15 minutes!** ⏰

---

**Ready to build? Run the commands above!** 🚀📦
