# 🏗️ Local Android Build Setup - Complete Guide

## 🎯 What You'll Get

- ✅ **Unlimited free builds** forever
- ✅ **Faster builds** (2-5 minutes after setup)
- ✅ **Full control** over build process
- ✅ **Works offline**
- ✅ **No monthly costs**

**Setup Time:** 2-3 hours (one time)

---

## 📋 Prerequisites

- ✅ Mac computer
- ✅ ~15 GB free disk space
- ✅ Stable internet (for initial downloads)
- ✅ 2-3 hours of time

---

## 🚀 Step-by-Step Setup

## **Part 1: Install Android Studio** (45 minutes)

### **Step 1: Download Android Studio**

1. **Visit:** https://developer.android.com/studio
2. **Click:** Download Android Studio
3. **Choose:** Mac (Apple Silicon or Intel - check your Mac type)
4. **Download:** ~1.2 GB file

### **Step 2: Install Android Studio**

1. **Open** the downloaded `.dmg` file
2. **Drag** Android Studio to Applications folder
3. **Open** Android Studio from Applications
4. **First Launch:**
   - Click "Do not import settings"
   - Accept license agreements
   - Choose "Standard" installation
   - Wait for SDK download (~4 GB, 15-20 minutes)

### **Step 3: Verify Installation**

1. **Open Android Studio**
2. **Click:** More Actions → SDK Manager
3. **Verify installed:**
   - ✅ Android SDK Platform 33
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator

---

## **Part 2: Configure Environment Variables** (10 minutes)

### **Step 4: Add Android SDK to PATH**

1. **Find your Android SDK location:**
   - Android Studio → Preferences → Appearance & Behavior → System Settings → Android SDK
   - Usually: `/Users/[your-username]/Library/Android/sdk`

2. **Open terminal and edit profile:**

```bash
# Open your shell profile
nano ~/.zshrc
```

3. **Add these lines at the end:**

```bash
# Android SDK
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

4. **Save and exit:**
   - Press `Ctrl+O` (save)
   - Press `Enter` (confirm)
   - Press `Ctrl+X` (exit)

5. **Reload profile:**

```bash
source ~/.zshrc
```

6. **Verify:**

```bash
adb --version
# Should show: Android Debug Bridge version x.x.x
```

---

## **Part 3: Generate Signing Key** (10 minutes)

### **Step 5: Create Keystore**

Android apps must be signed. Create your signing key:

```bash
cd "/Users/ritulkumar/Desktop/Note taking App"

# Generate keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore quick-notes-release.keystore \
  -alias quick-notes-key \
  -keyalg RSA -keysize 2048 -validity 10000

# You'll be asked for:
# - Keystore password (create one, SAVE IT!)
# - Name: Ritul Kumar
# - Organization: (press Enter)
# - City: (press Enter)
# - State: (press Enter)
# - Country code: IN (or your country)
```

**IMPORTANT:** Save your keystore password somewhere safe! You'll need it for every build.

### **Step 6: Create gradle.properties**

Create a file to store your signing config:

```bash
# Create gradle.properties in android folder
cat > android/gradle.properties << 'EOF'
MYAPP_RELEASE_STORE_FILE=../quick-notes-release.keystore
MYAPP_RELEASE_KEY_ALIAS=quick-notes-key
MYAPP_RELEASE_STORE_PASSWORD=YOUR_PASSWORD_HERE
MYAPP_RELEASE_KEY_PASSWORD=YOUR_PASSWORD_HERE
EOF
```

Replace `YOUR_PASSWORD_HERE` with your keystore password.

---

## **Part 4: Configure Build** (30 minutes)

### **Step 7: Prebuild (Generate Android Project)**

This converts your Expo app to native Android project:

```bash
cd "/Users/ritulkumar/Desktop/Note taking App"

# Install expo-dev-client (required for local builds)
npx expo install expo-dev-client

# Generate native Android project
npx expo prebuild --platform android
```

**What this does:**
- Creates `android/` folder
- Generates native Android code
- Configures gradle build

**Time:** 5-10 minutes

### **Step 8: Configure Signing in build.gradle**

```bash
# Open the file
nano android/app/build.gradle
```

Find the `android {` section and add signing config:

```gradle
android {
    ...
    
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

Save and exit (Ctrl+O, Enter, Ctrl+X).

---

## **Part 5: Build Your First APK** (10 minutes)

### **Step 9: Build Release APK**

```bash
cd "/Users/ritulkumar/Desktop/Note taking App/android"

# Clean previous builds
./gradlew clean

# Build release APK
./gradlew assembleRelease
```

**First build:** 10-15 minutes (downloading dependencies)
**After that:** 2-5 minutes!

### **Step 10: Find Your APK**

Your APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

**Copy it to easy location:**
```bash
cp android/app/build/outputs/apk/release/app-release.apk ~/Desktop/QuickNotes.apk
```

**Your APK is ready!** 🎉

---

## 🎯 Quick Build Commands (After Setup)

Once setup is complete, building is easy:

```bash
# Go to android folder
cd "/Users/ritulkumar/Desktop/Note taking App/android"

# Build APK
./gradlew assembleRelease

# APK is at:
# android/app/build/outputs/apk/release/app-release.apk
```

**Time:** 2-5 minutes per build!

---

## 🔄 Alternative: Build Script

Create a convenient build script:

```bash
# Create build script
cat > build-apk.sh << 'EOF'
#!/bin/bash
echo "🏗️  Building Quick Notes APK..."
cd android
./gradlew clean
./gradlew assembleRelease
cp app/build/outputs/apk/release/app-release.apk ../QuickNotes-$(date +%Y%m%d).apk
echo "✅ APK built successfully!"
echo "📦 Location: QuickNotes-$(date +%Y%m%d).apk"
EOF

# Make it executable
chmod +x build-apk.sh

# Use it:
./build-apk.sh
```

---

## 📊 Build Types

### **Debug Build** (for testing)
```bash
./gradlew assembleDebug
# Faster, larger file, debuggable
```

### **Release Build** (for distribution)
```bash
./gradlew assembleRelease
# Optimized, smaller, signed
```

---

## 🐛 Troubleshooting

### **"gradlew: Permission denied"**
```bash
chmod +x android/gradlew
```

### **"SDK location not found"**
```bash
# Create local.properties
echo "sdk.dir=$HOME/Library/Android/sdk" > android/local.properties
```

### **"Build failed: Keystore not found"**
```bash
# Check keystore location
ls -la quick-notes-release.keystore

# Update path in android/gradle.properties
```

### **"Out of memory"**
```bash
# Increase gradle memory
echo "org.gradle.jvmargs=-Xmx4096m" >> android/gradle.properties
```

### **Build is slow**
```bash
# Enable parallel builds
echo "org.gradle.parallel=true" >> android/gradle.properties
echo "org.gradle.daemon=true" >> android/gradle.properties
```

---

## ⚡ Optimization Tips

### **Speed Up Builds:**

1. **Enable Gradle Daemon:**
```bash
echo "org.gradle.daemon=true" >> android/gradle.properties
```

2. **Parallel Builds:**
```bash
echo "org.gradle.parallel=true" >> android/gradle.properties
```

3. **Increase Memory:**
```bash
echo "org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m" >> android/gradle.properties
```

4. **Cache:**
```bash
# Gradle caches automatically
# Don't delete .gradle folder
```

---

## 📱 Install APK on Device

### **Method 1: USB Cable**
```bash
# Connect phone via USB
adb devices

# Install APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

### **Method 2: Transfer File**
- Email to yourself
- Google Drive/Dropbox
- USB transfer
- Bluetooth

---

## 🎯 Complete Setup Checklist

- [ ] Android Studio installed
- [ ] SDK downloaded
- [ ] Environment variables set
- [ ] `adb --version` works
- [ ] Keystore generated
- [ ] gradle.properties created
- [ ] `npx expo prebuild` completed
- [ ] build.gradle configured
- [ ] First APK built successfully
- [ ] APK tested on device

---

## 💰 Cost Comparison

### **Local Build (What you're doing):**
```
Setup time: 2-3 hours (one time)
Per build: 2-5 minutes
Cost: $0 forever ✅
Builds: Unlimited ✅
Internet: Not needed ✅
```

### **EAS Build:**
```
Setup time: 5 minutes
Per build: 10-15 minutes
Cost: $0 (30 builds/month) → $29/month ⚠️
Builds: Limited ⚠️
Internet: Required ❌
```

**You save: $348/year!** 💰

---

## 🚀 Next Steps After Setup

### **1. Test Your Build:**
```bash
# Build APK
cd android
./gradlew assembleRelease

# Install on device
adb install app/build/outputs/apk/release/app-release.apk
```

### **2. Update Your Code:**
```bash
# After code changes
cd android
./gradlew assembleRelease
# New APK ready in 2-5 minutes!
```

### **3. Version Your App:**
```bash
# Update version in app.json
"version": "1.0.1"

# Rebuild
npx expo prebuild --clean
cd android
./gradlew assembleRelease
```

---

## 📚 Resources

**Official Docs:**
- Android Studio: https://developer.android.com/studio
- Gradle: https://gradle.org/
- Expo Prebuild: https://docs.expo.dev/workflow/prebuild/

**Help:**
- Android Studio Issues: https://developer.android.com/studio/intro/troubleshooting
- Gradle Issues: https://docs.gradle.org/current/userguide/troubleshooting.html

---

## ✅ Summary

**You've chosen the professional path!**

**Time Investment:** 2-3 hours (one time)
**Reward:** Free unlimited builds forever

**After setup:**
- Build APK in 2-5 minutes
- No internet needed
- No monthly costs
- Full control

**Ready to start?** Let's begin with Step 1! 🚀
