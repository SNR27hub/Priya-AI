# Proguard rules for Priya AI
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.snr.priyaai.** { *; }
