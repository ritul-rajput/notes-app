# 📦 Get Your APK - Quick Guide

## 🚀 Build APK in 3 Steps (15 minutes)

---

## Step 1: Install EAS CLI

```bash
sudo npm install -g eas-cli
```

**Enter your Mac password when prompted** (it won't show as you type - that's normal!)

---

## Step 2: Login to Expo

```bash
eas login
```

**Options:**
- **Have Expo account?** Enter email & password
- **Don't have account?** Create free account at: https://expo.dev/signup
- **Or** it will prompt you to create one now

---

## Step 3: Build APK

```bash
cd "/Users/ritulkumar/Desktop/Note taking App"
eas build:configure
eas build --platform android --profile preview
```

**What happens:**
1. Asks a few questions (just press Enter for defaults)
2. Uploads your code (1-2 min)
3. Builds in cloud (8-15 min) ☕
4. Gives you download link!

---

## 📥 Download APK

**After build completes, you'll see:**
```
✔ Build finished
   https://expo.dev/artifacts/eas/abc123xyz.apk
```

**Click the link** to download your APK! 📦

**Or visit:** https://expo.dev → Your account → Builds → Download

---

## 📱 Install APK

### **On Any Android Device:**

1. **Transfer APK** to phone (email, USB, cloud)
2. **Open the APK file** on phone
3. **Allow "Install from unknown sources"** (if asked)
4. **Install** the app
5. **Open** Quick Notes! 🎉

### **Share with Friends:**

- Share the download link (works for 30 days)
- Email the APK file
- Upload to Google Drive/Dropbox
- USB transfer

---

## ⏱️ Timeline

```
Install EAS CLI: 2 minutes
Login to Expo: 1 minute
Configure build: 2 minutes
Build APK: 10-15 minutes
Download: 1 minute
────────────────────────────
Total: ~15-20 minutes ⏰
```

---

## 🎯 Copy & Paste All Commands

```bash
# 1. Install EAS (enter password when prompted)
sudo npm install -g eas-cli

# 2. Login
eas login

# 3. Navigate to project
cd "/Users/ritulkumar/Desktop/Note taking App"

# 4. Configure (first time only)
eas build:configure

# 5. Build APK
eas build --platform android --profile preview

# Wait for build to complete, then download!
```

---

## ❓ Configuration Questions

When you run `eas build:configure`, it may ask:

**Q: "Would you like to automatically create an EAS project?"**
→ Press **Y** (Yes)

**Q: "Generate a new Android Keystore?"**
→ Press **Y** (Yes)

**Q: "Create eas.json?"**
→ Press **Y** (Yes)

---

## 📊 Build Progress

You'll see updates like:
```
⠋ Uploading to EAS Build...
✔ Uploaded to EAS Build
⠋ Build is in queue...
⠋ Building Android project...
⠋ Packaging APK...
✔ Build completed!
```

**Grab a coffee! ☕ This takes 10-15 minutes.**

---

## ✅ Your APK Details

**File Info:**
- Size: ~25-35 MB
- Works on: Android 5.0+
- Package: com.quicknotes.app
- Version: 1.0.0

**What's Inside:**
- ✅ Complete Quick Notes app
- ✅ Login/Authentication
- ✅ Home screen with notes
- ✅ Editor with toolbar
- ✅ All features working!

---

## 🎉 After Download

### **Test It:**
- Install on your phone
- Test all features
- Login as guest
- Create notes
- Use editor

### **Share It:**
- Send to friends/family
- Get feedback
- Make improvements
- Build again!

---

## 💡 Pro Tips

**First Build:**
- Takes 10-15 minutes
- Be patient!
- Don't close terminal

**After Changes:**
```bash
# Just rebuild:
eas build --platform android --profile preview
# Takes 5-8 minutes
```

**Check Status:**
```bash
# See all builds:
eas build:list

# Or visit:
https://expo.dev/accounts/[your-username]/builds
```

---

## 🐛 Common Issues

### **"sudo: command not found"**
```bash
# Try without sudo:
npm install -g eas-cli --force
```

### **"Build failed"**
```bash
# Check error message
# Usually need to update packages:
npm install
# Try again
```

### **"Can't login"**
```bash
# Create account first:
# Visit: https://expo.dev/signup
# Then: eas login
```

---

## 🚀 Start Now!

**Run these 3 commands:**

```bash
# 1. Install
sudo npm install -g eas-cli

# 2. Login
eas login

# 3. Build
cd "/Users/ritulkumar/Desktop/Note taking App"
eas build:configure
eas build --platform android --profile preview
```

**Your APK will be ready in 15 minutes!** 📦✨

---

## 📞 Need Help?

**Full Guide:** [BUILD_APK.md](BUILD_APK.md)
**EAS Docs:** https://docs.expo.dev/build/setup/
**Expo Dashboard:** https://expo.dev/

---

**Ready? Run the commands above and get your APK!** 🎉
