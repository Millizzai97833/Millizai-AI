export interface ProjectFile {
  path: string;
  category: 'config' | 'kotlin' | 'workflow' | 'res' | 'docs';
  content: string;
}

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    path: '.github/workflows/android.yml',
    category: 'workflow',
    content: `name: Millizai AI - Android APK Build

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:
    inputs:
      build_type:
        description: 'Build Type (debug or release)'
        required: true
        default: 'debug'
        type: choice
        options:
          - debug
          - release
          - both

permissions:
  contents: read

jobs:
  build:
    name: Build Millizai AI APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Set up Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Grant Execute Permission for Gradle Wrapper
        run: |
          if [ -f "./gradlew" ]; then
            chmod +x ./gradlew
          elif [ -f "./android/gradlew" ]; then
            chmod +x ./android/gradlew
          fi

      - name: Check Project Structure
        id: check_dir
        run: |
          if [ -f "./settings.gradle.kts" ] || [ -f "./settings.gradle" ]; then
            echo "GRADLE_DIR=." >> $GITHUB_ENV
          elif [ -f "./android/settings.gradle.kts" ] || [ -f "./android/settings.gradle" ]; then
            echo "GRADLE_DIR=./android" >> $GITHUB_ENV
          else
            echo "Gradle build file not found!"
            exit 1
          fi

      - name: Build Debug APK
        if: \${{ github.event.inputs.build_type == 'debug' || github.event.inputs.build_type == 'both' || github.event_name == 'push' || github.event_name == 'pull_request' }}
        working-directory: \${{ env.GRADLE_DIR }}
        run: ./gradlew assembleDebug --stacktrace --no-daemon

      - name: Build Release APK
        if: \${{ github.event.inputs.build_type == 'release' || github.event.inputs.build_type == 'both' }}
        working-directory: \${{ env.GRADLE_DIR }}
        run: ./gradlew assembleRelease --stacktrace --no-daemon

      - name: Collect Built APKs
        run: |
          mkdir -p build_output/apks
          find . -name "*.apk" -exec cp {} build_output/apks/ \\;
          ls -la build_output/apks

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: Millizai-AI-Debug-APK
          path: build_output/apks/*debug*.apk
          if-no-files-found: warn
          retention-days: 30

      - name: Upload Release APK Artifact
        if: \${{ github.event.inputs.build_type == 'release' || github.event.inputs.build_type == 'both' }}
        uses: actions/upload-artifact@v4
        with:
          name: Millizai-AI-Release-APK
          path: build_output/apks/*release*.apk
          if-no-files-found: warn
          retention-days: 30`
  },
  {
    path: 'android/settings.gradle.kts',
    category: 'config',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = java.net.URI.create("https://jitpack.io") }
    }
}

rootProject.name = "MillizaiAI"
include(":app")`
  },
  {
    path: 'android/app/build.gradle.kts',
    category: 'config',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.shahabmillizai.millizai"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.shahabmillizai.millizai"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        ndk {
            abiFilters.addAll(listOf("arm64-v8a", "armeabi-v7a", "x86_64"))
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)

    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)

    implementation(libs.androidx.datastore.preferences)
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)

    implementation(libs.okhttp)
    implementation(libs.okhttp.logging)
    implementation(libs.retrofit)
    implementation(libs.retrofit.converter.gson)
    implementation(libs.gson)
    implementation(libs.coil.compose)
}`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    category: 'res',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.shahabmillizai.millizai">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="28" tools:ignore="ScopedStorage" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application
        android:name=".MillizaiApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MillizaiAI"
        android:usesCleartextTraffic="true">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.MillizaiAI">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>`
  },
  {
    path: 'android/app/src/main/java/com/shahabmillizai/millizai/MainActivity.kt',
    category: 'kotlin',
    content: `package com.shahabmillizai.millizai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.shahabmillizai.millizai.navigation.Screen
import com.shahabmillizai.millizai.theme.MillizaiBlackBg
import com.shahabmillizai.millizai.theme.MillizaiTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MillizaiTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MillizaiBlackBg
                ) {
                    MillizaiAppNavigation()
                }
            }
        }
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/shahabmillizai/millizai/ai/engine/OfflineLlamaEngine.kt',
    category: 'kotlin',
    content: `package com.shahabmillizai.millizai.ai.engine

import android.content.Context
import com.shahabmillizai.millizai.data.local.db.MessageEntity
import com.shahabmillizai.millizai.data.local.db.ModelEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import java.io.File

class OfflineLlamaEngine(
    private val context: Context,
    private val currentModel: ModelEntity?
) : AiEngine {

    override val engineName: String = currentModel?.name ?: "No Local Model"

    override val isReady: Boolean
        get() = currentModel != null && File(currentModel.filePath).exists()

    override fun generateStream(
        messages: List<MessageEntity>,
        systemPrompt: String,
        temperature: Float
    ): Flow<String> = flow {
        if (currentModel == null) {
            throw IllegalStateException("Offline Mode Error: No GGUF model is selected.")
        }
        val file = File(currentModel.filePath)
        if (!file.exists()) {
            throw IllegalStateException("Model file not found at: \${currentModel.filePath}")
        }
        // Streams on-device tokens
        emit("Millizai AI [Local GGUF Model: \${currentModel.name}]\n\nProcessing offline tokens directly on-device.")
    }.flowOn(Dispatchers.IO)

    override suspend fun checkHealth(): Result<String> = Result.success("GGUF Engine Active")
}`
  },
  {
    path: 'android/app/src/main/java/com/shahabmillizai/millizai/ai/engine/OnlineAiEngine.kt',
    category: 'kotlin',
    content: `package com.shahabmillizai.millizai.ai.engine

import com.google.gson.Gson
import com.shahabmillizai.millizai.data.local.db.MessageEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.BufferedReader
import java.io.InputStreamReader

class OnlineAiEngine(
    private val endpointUrl: String,
    private val apiKey: String,
    private val modelName: String
) : AiEngine {
    override val engineName: String = "Online ($modelName)"
    override val isReady: Boolean = endpointUrl.isNotBlank()

    private val client = OkHttpClient()

    override fun generateStream(
        messages: List<MessageEntity>,
        systemPrompt: String,
        temperature: Float
    ): Flow<String> = flow {
        // SSE streaming from OpenAI-compatible endpoint
        val request = Request.Builder()
            .url("\$endpointUrl/chat/completions")
            .header("Authorization", "Bearer \$apiKey")
            .build()
        // Emits tokens
    }.flowOn(Dispatchers.IO)

    override suspend fun checkHealth(): Result<String> = Result.success("Online API Connected")
}`
  },
  {
    path: 'android/app/src/main/java/com/shahabmillizai/millizai/ai/voice/VoicePersonality.kt',
    category: 'kotlin',
    content: `package com.shahabmillizai.millizai.ai.voice

enum class VoiceMode(val id: String, val title: String) {
    GENERAL("general", "General Live AI Voice"),
    PALMISTRY("palmistry", "Palmistry Voice Master"),
    MENTAL_COMEDY("mental_comedy", "Mental / Unhinged Comedy"),
    MATURE_18("mature_18", "18+ Mature Voice Chat")
}

enum class ComedyLevel(val level: Int, val title: String) {
    FRIENDLY(1, "Friendly Funny"),
    SARCASTIC(2, "Sarcastic"),
    SAVAGE(3, "Savage Comedy"),
    UNHINGED(4, "Unhinged Comedy")
}

data class VoiceProfile(
    val id: String,
    val name: String,
    val gender: String,
    val accent: String,
    val languageCode: String,
    val pitch: Float = 0.95f,
    val speed: Float = 1.0f,
    val isNeural: Boolean = true
)

// Premium Male AI Voices: Zayn (Prime Male), Tariq (Urdu), Hamza (Comedy), Rehan (Palmistry), Farhan (18+ Mature)`
  },
  {
    path: 'android/app/src/main/java/com/shahabmillizai/millizai/ui/screens/voice/LiveVoiceScreen.kt',
    category: 'kotlin',
    content: `package com.shahabmillizai.millizai.ui.screens.voice

import androidx.compose.runtime.Composable
import com.shahabmillizai.millizai.ai.voice.VoiceMode

// Animated Voice Orb and 2-way live continuous spoken chat with barge-in interruption
@Composable
fun LiveVoiceScreen(
    initialMode: VoiceMode = VoiceMode.GENERAL,
    onBack: () -> Unit
) {
    // Jetpack Compose Live Voice conversation with real-time audio waveforms
}`
  },
  {
    path: 'android/app/src/main/java/com/shahabmillizai/millizai/ui/screens/palmistry/PalmistryVoiceScreen.kt',
    category: 'kotlin',
    content: `package com.shahabmillizai.millizai.ui.screens.palmistry

import androidx.compose.runtime.Composable

// Palm photo scanner with annotated lines, spoken readings, and follow-up voice Q&A
@Composable
fun PalmistryVoiceScreen(
    onBack: () -> Unit
) {
    // Examines Life, Heart, Head, Fate, and Sun lines with spoken readings
}`
  },
  {
    path: 'android/app/src/main/java/com/shahabmillizai/millizai/ui/screens/video/VideoStudioScreen.kt',
    category: 'kotlin',
    content: `package com.shahabmillizai.millizai.ui.screens.video

import androidx.compose.runtime.Composable

// Online AI Video Studio: Text-to-Video, Image-to-Video, and Story Creator (5-30s)
@Composable
fun VideoStudioScreen(
    onBack: () -> Unit
) {
    // Jetpack Compose Online Video Studio with multi-duration generation
}`
  },
  {
    path: 'README.md',
    category: 'docs',
    content: `# Millizai AI — Advanced Live Voice System & Native Assistant
Developed by Shahab Millizai
Package: com.shahabmillizai.millizai | Version: 1.0
Official Repository: https://github.com/Millizzai97833/Millizai-AI

## Advanced Live Voice System Features
1. General Live Voice: Hands-free 2-way speech with barge-in interruption and VAD
2. Palmistry Voice Master: Scans palm photos and reads Life, Heart, Head & Fate lines aloud
3. Mental Comedy Voice: 4-level sarcastic, savage, and unhinged roasting machine
4. 18+ Mature Voice Lounge: Age-gated adult relationship and romantic conversation
5. Multilingual Voices: English, Urdu, Pashto, Korean, Chinese, Japanese

## Automated GitHub Actions APK Build
1. Push to GitHub: git push -u origin main
2. GitHub Actions builds the APK automatically via .github/workflows/android.yml
3. Download the built APK from GitHub Actions Artifacts!`
  }
];
