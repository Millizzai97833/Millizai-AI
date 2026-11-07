# Millizai AI — Complete Native Android AI Assistant
**Developed by Shahab Millizai**  
*Package: `com.shahabmillizai.millizai` | Version: 1.0 (Version Code: 1)*  
*Official Repository:* [https://github.com/Millizzai97833/Millizai-AI](https://github.com/Millizzai97833/Millizai-AI)

---

## 🌟 Overview

**Millizai AI** is a complete, production-grade Android AI assistant engineered specifically for Android devices (SDK 24 to 36). It provides both high-speed **Online AI inference** (via any OpenAI-compatible server, Ollama, vLLM, or LM Studio) and 100% private **Offline AI inference** powered by **llama.cpp** and quantized **GGUF** language models, alongside an integrated **AI Image Generator** with Stable Diffusion support.

Millizai AI includes native multilingual fluency for **English, Urdu (اردو), Pashto (پښتو)**, and regional languages, full conversation history stored locally in an encrypted Room SQLite database, and advanced writing & coding assistants.

---

## 🚀 Key Features

### 1. Dual-Engine AI Architecture
- **Online Mode:**
  - Connects to any OpenAI-compatible endpoint (`/v1/chat/completions`).
  - Supports self-hosted open-source servers (Ollama, LM Studio, vLLM, LocalAI) and remote providers (OpenAI, OpenRouter, Groq).
  - Securely configured directly inside the app; no hardcoded API keys.
  - Low-latency Server-Sent Events (SSE) token streaming.
- **Offline Mode:**
  - Uses `llama.cpp` mobile runtime supporting quantized GGUF models (`Q4_K_M`, `Q4_0`, etc.).
  - Automatic memory estimation and RAM validation before loading to prevent OOM errors.
  - Zero internet connection required after downloading a model.
  - Strictly refuses to hallucinate fake responses if no model file is installed.

### 2. AI Image Generator
- Text-to-image synthesis with positive and negative prompts.
- Configurable dimensions (512x512, 768x768, 1024x1024), seed control, and denoising steps (15–50).
- Real-time progress bar with step-by-step diffusion feedback.
- One-tap Save to Device Gallery & Native Android Share Sheet.
- Offline Stable Diffusion runtime support with NPU/GPU validation.

### 3. Premium Natural Male Voice & Multilingual Conversation Engine (Upgraded!)
- **Natural Adult Male AI Voice Personalities:**
  - **Zayn (Prime Male - Default):** Warm, friendly, confident adult male companion with natural conversational breathing rhythm, medium-pitched resonance (0.94), and articulate pronunciation.
  - **Tariq (طارق - Urdu & English):** Authentic Pakistani Urdu and fluent English male companion with natural cultural cadence.
  - **Hamza (حمزہ - Comedy Male):** Energetic, punchy, sarcastic male voice with expressive pitch dynamics for Mental Comedy.
  - **Rehan (ریحان - Palmistry & Wisdom):** Calm, deep, meditative male voice for palmistry readings and thoughtful philosophical guidance.
  - **Farhan (فرحان - 18+ Mature Male):** Charismatic, alluring, confident adult male voice for mature relationship discussions and romance.
  - **Zalmay (زلمی - Pashto):** Authentic Pashto and English intonation with strong, respectful resonance.
  - **International Male Voices:** Zayd (Arabic), Kabir (Hindi), Mateo (Spanish), Julian (French), Lukas (German), Kenji (Japanese), Jun-woo (Korean), Bo-lin (Chinese).
- **Natural Spoken Cadence:**
  - Eliminates robotic, mechanical monotone; uses natural conversational sentence pauses, appropriate word emphasis, and human-like sentence endings.
  - Contextual conversation memory across turns without repeating identical phrases.
- **Voice Control Suite:**
  - Male voice selector with live audio preview.
  - Voice pitch control (0.7x to 1.3x) allowing deeper or higher male resonance.
  - Speaking speed control (0.5x to 2.0x).
  - Volume control (0% to 100%).
  - Manual language selection + real-time automatic language detection.
  - Microphone mute/unmute, speaker on/off, and instant barge-in interruption.
- **Multilingual Spoken Intelligence:**
  - Automatic language detection (Urdu, Pashto, English, Arabic, Hindi, Spanish, French, German, Japanese, Korean, Chinese).
  - Dynamic responses tailored to user's spoken dialect (including Roman Urdu and Urdu-English mixing).
- **Audio & Transcript Export:**
  - Authentic 44.1kHz PCM WAV audio binary export powered by acoustic vocal tract formant simulation.
  - Full conversation transcripts exportable as TXT files.
  - Consent badge indicators ensuring privacy.

### 4. Palmistry Master (New Feature!)
- **Unlimited Repeated Palm Uploads:** Upload from gallery or camera without artificial session limits.
- **Left & Right Palm Analysis:** Toggle between dominant and non-dominant hands for comprehensive destiny and innate trait interpretation.
- **Detected Landmark Features:** Life Line, Heart Line, Head Line, Fate Line, Sun Line (Apollo Line), and Mount of Venus.
- **Interactive Landmark Overlays:** Visual annotations mapping detected lines directly onto the palm photograph.
- **Categorized Readings:** Personality & mind, love & relationships, career & ambition, financial tendencies, and general life balance.
- **Multilingual Reports:** Instant translation across English, Urdu (اردو), and Pashto (پښتو).
- **Spoken Readings Aloud:** Spoken explanations powered by Rehan, the natural male AI voice.
- **Saved Reports & Follow-Up Q&A:** Save, view, share, or delete reports, and ask follow-up questions via text or spoken voice.

### 5. AI Video Studio (New Feature!)
- **Real Online AI Video Generation:** Real-time multi-frame MP4/WebM video synthesis with camera dynamics and visual shaders.
- **Text-to-Video:** Multi-duration generation (5, 10, 15, 20, 25, and 30 seconds) across 7 styles: Anime, Realistic, Cinematic, Fantasy, Horror, Comedy, Cartoon.
- **Image-to-Video:** Animate portraits, anime characters, and landscapes with customizable motion prompts and camera moves (pan left/right, zoom in/out).
- **AI Story Creator:** Generates complete narrative storyboards with 4-scene video prompts, English and Urdu narration, character consistency, and combined MP4 video export.
- **Embedded Player & Download:** Direct in-app video playback with timeline controls, MP4 file download, and native sharing.

### 6. Specialized Multilingual AI Workspaces
- **AI Writing Assistant:** Tailored for emails, academic essays, creative stories, and poetry/shayari in English, Urdu (اردو), and Pashto (پښتو).
- **AI Coding Assistant:** Android Jetpack Compose, Kotlin, Python, C++, TypeScript, SQL generator, debugger, and refactoring suite.
- **AI Model Library & Downloads Manager:** Curated catalog of tested mobile models (Llama 3.2 1B, Qwen 2.5 0.5B, Gemma 2 2B, SD-Turbo) with one-click download, pause/resume, and Storage Access Framework (SAF) `.gguf` file importer.
- **Room Database Chat History:** Full offline conversation persistence with message deletion, regeneration, and Markdown export.

---

## 📱 Dedicated Android Screens
1. **Splash Screen:** Millizai AI branding & developer credit to Shahab Millizai.
2. **Home Dashboard:** Quick stats, 4 Live Voice cards, workspace shortcuts, and telemetry.
3. **Palmistry Master Screen:** Visual palm analysis, landmark annotations, multilingual reports, and male voice explanations.
4. **AI Video Studio Screen:** Online text-to-video, image animation, story creator, and MP4 player.
5. **General Live Voice Screen:** Animated Voice Orb, continuous VAD, barge-in, transcript, and audio export.
6. **Mental Comedy Voice Screen:** 4-level sarcastic, savage, and unhinged comedy engine.
7. **18+ Mature Voice Lounge:** Age-gated adult romantic discussions with age verification.
8. **AI Chat Screen:** Real-time token streaming, copy, share, regenerate, and delete actions.
9. **AI Image Generator Screen:** Prompt synthesis, dimension controls, and live gallery.
10. **AI Writing Assistant Screen:** Format, tone, and multilingual draft generation.
11. **AI Coding Assistant Screen:** Code generation, debugging, and syntax copying.
12. **AI Model Library:** Pre-vetted mobile-compatible GGUF models.
13. **Model Downloads Screen:** Active download manager and local storage inspector.
14. **Chat History Screen:** Local database session search and export.
15. **Settings Screen:** Custom API URLs, keys, temperature, system prompt, and theme.
16. **About the Developer Screen:** Profile of Shahab Millizai, technical specifications, and repository links.

---

## 🛠️ GitHub Actions Automated APK Build (No PC / No Termux Required!)

The repository includes a ready-to-use GitHub Actions workflow configured in `.github/workflows/android.yml`.

### How to Build & Download the APK:
1. Push this project to your GitHub repository:
   ```bash
   git remote add origin https://github.com/Millizzai97833/Millizai-AI.git
   git branch -M main
   git push -u origin main
   ```
2. In your GitHub repository:
   - Click the **Actions** tab at the top.
   - You will see the workflow **"Millizai AI - Android APK Build"** running automatically!
   - You can also manually trigger it anytime via **Run workflow** -> Select **debug** or **release**.
3. Once completed (takes ~3–4 minutes):
   - Click on the completed workflow run.
   - Scroll down to the **Artifacts** section.
   - Click **Millizai-AI-Debug-APK** to download the ready-to-install `.apk` directly to your phone!

---

## 💻 Local Build in Android Studio
1. Clone the repository:
   ```bash
   git clone https://github.com/Millizzai97833/Millizai-AI.git
   ```
2. Open the project folder in **Android Studio** (Koala / Ladybug or newer with Java 17).
3. Allow Gradle to sync dependencies.
4. Select your connected device or emulator (Android 7.0+).
5. Click **Run** (`Shift + F10`) or run from terminal:
   ```bash
   ./gradlew assembleDebug
   ```
   The APK will be located at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📜 License & Credits
- **Author & Architect:** Shahab Millizai
- **Project:** Millizai AI
- **Repository:** https://github.com/Millizzai97833/Millizai-AI
