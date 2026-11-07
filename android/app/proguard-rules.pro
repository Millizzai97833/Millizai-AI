# Millizai AI Proguard Rules
-keep class com.shahabmillizai.millizai.data.remote.dto.** { *; }
-keep class com.shahabmillizai.millizai.data.local.db.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# llama.cpp native JNI methods
-keepclasseswithmembernames class * {
    native <methods>;
}
-keep class com.shahabmillizai.millizai.ai.engine.LlamaCppBridge { *; }
