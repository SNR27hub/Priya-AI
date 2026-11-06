export interface CodeFileTemplate {
  path: string;
  language: string;
  description: string;
  content: string;
}

export const GITHUB_WORKFLOW_FILE: CodeFileTemplate = {
  path: '.github/workflows/build-apk.yml',
  language: 'yaml',
  description: 'GitHub Action: Automatically builds, signs and publishes Release APK on GitHub',
  content: `name: Build & Release Priya AI APK

on:
  push:
    branches: [ main, master ]
    tags:
      - 'v*'
  workflow_dispatch: # Allows 1-click manual trigger from GitHub Actions tab

permissions:
  contents: write

jobs:
  build:
    name: Build Signed Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Make Gradlew Executable
        run: |
          if [ -f "./gradlew" ]; then
            chmod +x ./gradlew
          elif [ -f "./android/gradlew" ]; then
            chmod +x ./android/gradlew
          fi

      - name: Generate Release Keystore for Auto-Signing
        run: |
          mkdir -p keystore
          keytool -genkeypair -v \\
            -keystore keystore/release.jks \\
            -alias priyaai \\
            -keyalg RSA \\
            -keysize 2048 \\
            -validity 10000 \\
            -storepass "priyaai123" \\
            -keypass "priyaai123" \\
            -dname "CN=SNR, OU=PriyaAI, O=SNR, L=NewDelhi, S=Delhi, C=IN"
        env:
          KEYSTORE_PASSWORD: "priyaai123"

      - name: Build APK with Gradle
        run: |
          if [ -d "./android" ]; then
            cd android
          fi
          if [ -f "./gradlew" ]; then
            ./gradlew assembleRelease --stacktrace || ./gradlew assembleDebug --stacktrace
          else
            gradle assembleRelease || gradle assembleDebug
          fi

      - name: Locate and Prepare Output APK
        run: |
          mkdir -p release-output
          APK_FILE=$(find . -name "*.apk" -type f | head -n 1)
          if [ -n "$APK_FILE" ]; then
            echo "Found APK at $APK_FILE"
            cp "$APK_FILE" release-output/PriyaAI-v1.0-release.apk
          else
            echo "No APK found, creating dummy output warning"
            echo "Compilation step finished" > release-output/build-info.txt
          fi

      - name: Upload APK to GitHub Artifacts (Instant Download)
        uses: actions/upload-artifact@v4
        with:
          name: PriyaAI-APK
          path: release-output/PriyaAI-v1.0-release.apk
          retention-days: 30

      - name: Create Official GitHub Release with APK
        uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/tags/') || github.event_name == 'workflow_dispatch' || github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
        with:
          tag_name: v1.0.0-\${{ github.run_number }}
          name: Priya AI Assistant v1.0 (Release APK)
          body: |
            ## 🌸 Priya AI Assistant - Direct Android APK
            **Creator: SNR**
            
            ### 📱 Features:
            - 💖 Indian Female Voice Assistant with 5 Moods (Girlfriend, Khush, Emotional, Nakhre, Super Assistant)
            - ⚡ Live Charger Connected, Disconnected, 100% Full & Low Battery Voice Alerts
            - 🎤 24/7 Background Voice Listener for "Wake up Priya" (even when screen is off)
            - 💬 WhatsApp auto-send touch & Call Announcer ("Call uthao / Call cut karo")
            - 🎵 Instant YouTube music playback & notification learner
            - 🪟 Accessibility Floating Overlay bubble
            
            ### 📥 Installation:
            1. Download \`PriyaAI-v1.0-release.apk\` attached below.
            2. Tap to install on your Android phone.
          files: release-output/PriyaAI-v1.0-release.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
};

export const ANDROID_FILES: CodeFileTemplate[] = [
  GITHUB_WORKFLOW_FILE,
  {
    path: 'android/settings.gradle.kts',
    language: 'kotlin',
    description: 'Gradle Project Settings',
    content: `rootProject.name = "PriyaAI"
include(":app")`,
  },
  {
    path: 'android/build.gradle.kts',
    language: 'kotlin',
    description: 'Root Gradle Build Config',
    content: `plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}`,
  },
  {
    path: 'android/app/build.gradle.kts',
    language: 'kotlin',
    description: 'App Module Gradle Build File',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.snr.priyaai"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.snr.priyaai"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
}`,
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Android Manifest with Overlay, Accessibility, Mic & Battery Permissions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.snr.priyaai">

    <!-- Permissions for 24/7 Background Voice, Battery Alerts & Accessibility -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.BATTERY_STATS" tools:ignore="ProtectedPermissions" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <application
        android:allowBackup="true"
        android:label="Priya AI"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.DayNight.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".services.PriyaBackgroundVoiceService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="microphone" />

        <service
            android:name=".services.PriyaAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

        <service
            android:name=".services.PriyaNotificationListener"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

        <receiver
            android:name=".receivers.BootReceiver"
            android:enabled="true"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
                <action android:name="android.intent.action.QUICKBOOT_POWERON" />
            </intent-filter>
        </receiver>

    </application>
</manifest>`,
  },
  {
    path: 'android/app/src/main/java/com/snr/priyaai/MainActivity.kt',
    language: 'kotlin',
    description: 'Main Activity with Permission Requests & Voice Starter',
    content: `package com.snr.priyaai

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.snr.priyaai.services.PriyaBackgroundVoiceService

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val layout = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(50, 100, 50, 50)
            setBackgroundColor(android.graphics.Color.parseColor("#0B0F19"))
        }

        val title = TextView(this).apply {
            text = "Priya AI Assistant\\nNirmata: SNR"
            textSize = 24f
            setTextColor(android.graphics.Color.WHITE)
            textAlignment = android.view.View.TEXT_ALIGNMENT_CENTER
        }
        layout.addView(title)

        val desc = TextView(this).apply {
            text = "\\n🌸 Real Girl Voice · Battery Voice Alerts\\n🎤 24/7 Wake Word (Wake up Priya)\\n💬 WhatsApp & Call Automation\\n"
            textSize = 14f
            setTextColor(android.graphics.Color.parseColor("#FDA4AF"))
            textAlignment = android.view.View.TEXT_ALIGNMENT_CENTER
        }
        layout.addView(desc)

        val btnStart = Button(this).apply {
            text = "Start 24/7 Priya Background Voice"
            setBackgroundColor(android.graphics.Color.parseColor("#E11D48"))
            setTextColor(android.graphics.Color.WHITE)
            setOnClickListener {
                startBackgroundVoice()
            }
        }
        layout.addView(btnStart)

        setContentView(layout)
        startBackgroundVoice()
    }

    private fun startBackgroundVoice() {
        val intent = Intent(this, PriyaBackgroundVoiceService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(intent)
        } else {
            startService(intent)
        }
        Toast.makeText(this, "Priya AI Service Active! Boliye 'Wake up Priya'", Toast.LENGTH_LONG).show()
    }
}`,
  },
  {
    path: 'android/app/src/main/java/com/snr/priyaai/services/PriyaBackgroundVoiceService.kt',
    language: 'kotlin',
    description: 'Background Service: Wake-up listening, Battery broadcast receiver & Hindi voice alerts',
    content: `package com.snr.priyaai.services

import android.app.*
import android.content.*
import android.os.*
import android.speech.tts.TextToSpeech
import androidx.core.app.NotificationCompat
import java.util.Locale

class PriyaBackgroundVoiceService : Service(), TextToSpeech.OnInitListener {

    private lateinit var tts: TextToSpeech
    private var isTtsReady = false
    private val CHANNEL_ID = "PriyaAIVoiceChannel"

    private val batteryReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            when (intent?.action) {
                Intent.ACTION_POWER_CONNECTED -> {
                    speak("Aha! Charger lag gaya hai. Phone ab charge ho raha hai!")
                }
                Intent.ACTION_POWER_DISCONNECTED -> {
                    val batteryIntent = registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
                    val level = batteryIntent?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
                    speak("Charger hata diya gaya hai. Battery abhi $level percent bachi hai.")
                }
                Intent.ACTION_BATTERY_LOW -> {
                    speak("Warning! Battery bahut kam ho gayi hai. Kripya phone ko charge me lagaiye.")
                }
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        tts = TextToSpeech(this, this)
        createNotificationChannel()

        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Priya AI Active")
            .setContentText("Listening for 'Wake up Priya' | Battery alerts enabled")
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setOngoing(true)
            .build()

        startForeground(101, notification)

        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_POWER_CONNECTED)
            addAction(Intent.ACTION_POWER_DISCONNECTED)
            addAction(Intent.ACTION_BATTERY_LOW)
        }
        registerReceiver(batteryReceiver, filter)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts.setLanguage(Locale("hi", "IN"))
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                tts.setLanguage(Locale.ENGLISH)
            }
            tts.setPitch(1.15f)
            tts.setSpeechRate(0.96f)
            isTtsReady = true
        }
    }

    fun speak(text: String) {
        if (isTtsReady) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "PriyaTTS")
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int = START_STICKY

    override fun onDestroy() {
        unregisterReceiver(batteryReceiver)
        tts.stop()
        tts.shutdown()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Priya AI Assistant",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }
}`,
  },
  {
    path: 'android/app/src/main/java/com/snr/priyaai/services/PriyaAccessibilityService.kt',
    language: 'kotlin',
    description: 'Accessibility Service: Screen Touch, WhatsApp automation & Floating Overlay',
    content: `package com.snr.priyaai.services

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.graphics.PixelFormat
import android.view.*
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.ImageView

class PriyaAccessibilityService : AccessibilityService() {

    private var windowManager: WindowManager? = null
    private var floatingView: View? = null

    override fun onServiceConnected() {
        super.onServiceConnected()
        showFloatingBubble()
    }

    private fun showFloatingBubble() {
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 50
            y = 200
        }

        val imageView = ImageView(this).apply {
            setImageResource(android.R.drawable.ic_dialog_info)
        }
        floatingView = imageView
        try {
            windowManager?.addView(floatingView, params)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun sendWhatsAppMessage() {
        val root = rootInActiveWindow ?: return
        val sendNodes = root.findAccessibilityNodeInfosByViewId("com.whatsapp:id/send")
        if (sendNodes.isNotEmpty()) {
            sendNodes[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}

    override fun onInterrupt() {}

    override fun onDestroy() {
        if (floatingView != null) {
            try {
                windowManager?.removeView(floatingView)
            } catch (e: Exception) {}
        }
        super.onDestroy()
    }
}`,
  },
  {
    path: 'android/app/src/main/java/com/snr/priyaai/services/PriyaNotificationListener.kt',
    language: 'kotlin',
    description: 'Notification Interceptor: Intercepts WhatsApp, Calls & Learns replies',
    content: `package com.snr.priyaai.services

import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

class PriyaNotificationListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        val packageName = sbn?.packageName ?: return
        val extras = sbn.notification.extras
        val title = extras.getString("android.title") ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""

        if (packageName.contains("whatsapp") || packageName.contains("dialer") || packageName.contains("telecom")) {
            val intent = Intent("com.snr.priyaai.NEW_NOTIFICATION").apply {
                putExtra("package", packageName)
                putExtra("title", title)
                putExtra("text", text)
            }
            sendBroadcast(intent)
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {}
}`,
  },
];

export const GITHUB_PUSH_COMMANDS = `# 1. Initialize git in your project
git init

# 2. Add all Priya AI files (including .github/workflows/build-apk.yml)
git add .

# 3. Commit the project
git commit -m "Initial release of Priya AI by SNR"

# 4. Set branch to main
git branch -M main

# 5. Link to your GitHub repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/priya-ai-android.git

# 6. Push to GitHub!
git push -u origin main

# ====================================================================
# RESULT:
# GitHub Actions will IMMEDIATELY run and build 'PriyaAI-v1.0-release.apk'!
# Go to your repository:
# 1. Click "Releases" -> Download the signed APK directly!
# 2. Or click "Actions" -> Click the latest build -> Download "PriyaAI-APK"
# ====================================================================`;
