package com.snr.priyaai

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
        
        // Simple programmatic UI for instant zero-dependency compilation
        val layout = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(50, 100, 50, 50)
            setBackgroundColor(android.graphics.Color.parseColor("#0B0F19"))
        }

        val title = TextView(this).apply {
            text = "Priya AI Assistant\nNirmata: SNR"
            textSize = 24f
            setTextColor(android.graphics.Color.WHITE)
            textAlignment = android.view.View.TEXT_ALIGNMENT_CENTER
        }
        layout.addView(title)

        val desc = TextView(this).apply {
            text = "\n🌸 Real Girl Voice · Battery Voice Alerts\n🎤 24/7 Wake Word (Wake up Priya)\n💬 WhatsApp & Call Automation\n"
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

        val btnOverlay = Button(this).apply {
            text = "Grant Floating Overlay & Accessibility"
            setBackgroundColor(android.graphics.Color.parseColor("#2563EB"))
            setTextColor(android.graphics.Color.WHITE)
            setOnClickListener {
                requestPermissions()
            }
        }
        layout.addView(btnOverlay)

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

    private fun requestPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName"))
            startActivity(intent)
        } else {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            startActivity(intent)
        }
    }
}
