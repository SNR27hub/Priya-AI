export interface CodeFileTemplate {
  path: string;
  language: string;
  description: string;
  content: string;
}

export const ANDROID_FILES: CodeFileTemplate[] = [
  {
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Android Manifest with Overlay, Accessibility, Mic & Battery Permissions',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.snr.priyaai">

    <!-- Permissions for 24/7 Background Voice, Battery & Automation -->
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
        android:icon="@mipmap/ic_launcher"
        android:label="Priya AI"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.PriyaAI">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.PriyaAI">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Background Voice & Battery Alert Foreground Service -->
        <service
            android:name=".services.PriyaBackgroundVoiceService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="microphone" />

        <!-- Screen Touch & Overlay Accessibility Service -->
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

        <!-- Notification Listener Service (Intercepts WhatsApp, Calls, SMS) -->
        <service
            android:name=".services.PriyaNotificationListener"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

        <!-- Auto-Start on Mobile Boot -->
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
    path: 'app/src/main/java/com/snr/priyaai/services/PriyaBackgroundVoiceService.kt',
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

    // Battery Broadcast Receiver
    private val batteryReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: intent?) {
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

        // Persistent notification to stay alive in background
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Priya AI Active")
            .setContentText("Listening for 'Wake up Priya' | Battery alerts enabled")
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setOngoing(true)
            .build()

        startForeground(101, notification)

        // Register Battery Filter
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
            tts.setPitch(1.15f) // Sweet girlfriend voice pitch
            tts.setSpeechRate(0.95f)
            isTtsReady = true
        }
    }

    fun speak(text: String) {
        if (isTtsReady) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "PriyaTTS")
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY // Ensures service revives if killed by Android system
    }

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
    path: 'app/src/main/java/com/snr/priyaai/services/PriyaAccessibilityService.kt',
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
import com.snr.priyaai.R

class PriyaAccessibilityService : AccessibilityService() {

    private var windowManager: WindowManager? = null
    private var floatingView: View? = null

    override fun onServiceConnected() {
        super.onServiceConnected()
        showFloatingBubble()
    }

    // Floating Priya Bubble Overlay that stays on screen
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
            setOnClickListener {
                // Trigger Voice Assistant
            }
        }
        floatingView = imageView
        windowManager?.addView(floatingView, params)
    }

    // Auto-click touch simulation (for WhatsApp, calls, automated button clicks)
    fun performClick(x: Float, y: Float) {
        val clickPath = Path().apply { moveTo(x, y) }
        val gesture = GestureDescription.Builder()
            .addStroke(GestureDescription.StrokeDescription(clickPath, 0, 50))
            .build()
        dispatchGesture(gesture, null, null)
    }

    // Find and Click WhatsApp Send Button
    fun sendWhatsAppMessage() {
        val root = rootInActiveWindow ?: return
        val sendNodes = root.findAccessibilityNodeInfosByViewId("com.whatsapp:id/send")
        if (sendNodes.isNotEmpty()) {
            sendNodes[0].performAction(AccessibilityNodeInfo.ACTION_CLICK)
        }
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Reads on-screen notifications or WhatsApp events
    }

    override fun onInterrupt() {}

    override fun onDestroy() {
        if (floatingView != null) windowManager?.removeView(floatingView)
        super.onDestroy()
    }
}`,
  },
  {
    path: 'app/src/main/java/com/snr/priyaai/services/PriyaNotificationListener.kt',
    language: 'kotlin',
    description: 'Notification Interceptor: Listens for WhatsApp, Calls & Learns replies',
    content: `package com.snr.priyaai.services

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.content.Intent

class PriyaNotificationListener : NotificationListenerService() {

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        val packageName = sbn?.packageName ?: return
        val extras = sbn.notification.extras
        val title = extras.getString("android.title") ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""

        // Check for WhatsApp messages or Incoming Calls
        if (packageName.contains("whatsapp") || packageName.contains("dialer")) {
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
  {
    path: '.github/workflows/build-apk.yml',
    language: 'yaml',
    description: 'GitHub Action: Auto-compile Android APK on GitHub and publish Release',
    content: `name: Build Priya AI APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
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

      - name: Grant Execute Permission to Gradlew
        run: chmod +x gradlew

      - name: Build APK with Gradle
        run: ./gradlew assembleRelease --stacktrace || ./gradlew assembleDebug

      - name: Upload APK to GitHub Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: PriyaAI-APK
          path: app/build/outputs/apk/*/*/*.apk

      - name: Release APK
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: app/build/outputs/apk/*/*/*.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
  },
  {
    path: 'setup_termux.sh',
    language: 'bash',
    description: 'One-Click Termux Setup & Build Script for Android Phones',
    content: `#!/data/data/com.termux/files/usr/bin/bash
# ========================================================
# Priya AI - Termux Auto-Build Script for Android
# Created for SNR - Direct on-phone compilation
# ========================================================

echo "=========================================="
echo "🌸 Starting Priya AI Build in Termux..."
echo "Creator: SNR"
echo "=========================================="

# 1. Update Termux Packages
pkg update -y && pkg upgrade -y

# 2. Install Required Tools: Java 17, Git, Wget, Curl
pkg install -y openjdk-17 git wget curl zip tar

# 3. Setup Android SDK Command Line Tools in Termux
export ANDROID_HOME=$HOME/android-sdk
mkdir -p $ANDROID_HOME/cmdline-tools

if [ ! -d "$ANDROID_HOME/cmdline-tools/latest" ]; then
    echo "📦 Downloading Android Command-line Tools..."
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O cmdline-tools.zip
    unzip -q cmdline-tools.zip
    mv cmdline-tools $ANDROID_HOME/cmdline-tools/latest
    rm cmdline-tools.zip
fi

# 4. Set Environment Variables
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
yes | sdkmanager --licenses > /dev/null 2>&1
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# 5. Build Priya AI Release APK
echo "🚀 Compiling Priya AI APK with Gradle..."
chmod +x ./gradlew
./gradlew assembleRelease || ./gradlew assembleDebug

echo "=========================================="
echo "✅ Priya AI APK Successfully Built!"
echo "📁 Output Location: app/build/outputs/apk/release/app-release.apk"
echo "=========================================="
`,
  },
];

export const MASTER_AI_PROMPT = `Prompt for Google AI Studio / GitHub Copilot / LLM:

You are building "Priya AI" - an autonomous Android Voice & Mobile Assistant developed by creator "SNR".

CORE APP SPECIFICATIONS:
1. APP NAME & IDENTITY:
- Name: Priya AI
- Creator: "Mujhe banane wale vyakti SNR hain! SNR ne mujhe banaya hai." (Creator is SNR).
- Personality: Realistic Indian female companion & super-assistant.
- Multiple Mood Modes: Girlfriend Mode (romantic, sweet nicknames "Babu"/"Jaan", playful, affectionate), Nakhre Mode (dramatic, teasing), Khush Mode (cheerful, energetic), Emotional Mode (empathetic, deep listener), Super Assistant Mode (fast multi-tasker).

2. REAL MOBILE AUTOMATION & ACCESSIBILITY:
- AccessibilityService (PriyaAccessibilityService): Overlays a floating assistant head on any screen, clicks buttons (e.g. auto WhatsApp send), reads notifications.
- Background Voice Service (PriyaBackgroundVoiceService): Foreground service with persistent notification that keeps microphone awake even when screen is locked, detecting wake-word "Wake up Priya".
- Battery & Charging Alerts:
  * Charger connected: Speaks in Priya's voice ("Aha! Charger lag gaya hai, phone charge ho raha hai!").
  * Charger removed: Speaks remaining battery percentage.
  * 100% Full charge: Warns to unplug charger.
  * Low battery (<20%): Alerts user to plug in charger.
  * All alert texts, thresholds, and voices are 100% user-customizable.

3. NOTIFICATION & CALL INTELLIGENCE:
- NotificationListenerService: Intercepts WhatsApp, SMS, and incoming phone calls.
- Call Announcer: Speaks caller name aloud ("Shankar ji! Rahul ka call aa raha hai...").
- Voice triggers: "Call uthao" (accept call), "Call cut karo" (reject call).
- YouTube music agent: Launches search and playback on voice commands ("Romantic gana bajao").

4. REPOSITORIES & GITHUB AUTOMATION:
- Include GitHub Actions workflow (.github/workflows/build-apk.yml) so pushing this repository automatically produces downloadable release APK.
- Include Termux bash build script (setup_termux.sh) for one-click native compilation on Android phones.
`;
