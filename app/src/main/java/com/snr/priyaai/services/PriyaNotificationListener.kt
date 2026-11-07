package com.snr.priyaai.services

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
}
