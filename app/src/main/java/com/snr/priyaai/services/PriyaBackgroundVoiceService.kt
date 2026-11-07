package com.snr.priyaai.services

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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(batteryReceiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            registerReceiver(batteryReceiver, filter)
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts.setLanguage(Locale("hi", "IN"))
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                tts.setLanguage(Locale.ENGLISH)
            }
            tts.setPitch(1.15f) // Sweet girlfriend voice pitch
            tts.setSpeechRate(0.96f)
            isTtsReady = true
        }
    }

    fun speak(text: String) {
        if (isTtsReady) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "PriyaTTS")
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onDestroy() {
        try {
            unregisterReceiver(batteryReceiver)
        } catch (e: Exception) {}
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
}
