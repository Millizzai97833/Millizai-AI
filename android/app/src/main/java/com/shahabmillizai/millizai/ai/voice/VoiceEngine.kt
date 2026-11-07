package com.shahabmillizai.millizai.ai.voice

import android.content.Context
import kotlinx.coroutines.flow.StateFlow
import java.io.File

enum class VoiceState {
    IDLE,
    LISTENING,
    THINKING,
    SPEAKING,
    ERROR
}

data class VoiceSessionState(
    val state: VoiceState = VoiceState.IDLE,
    val userTranscription: String = "",
    val aiResponse: String = "",
    val audioAmplitude: Float = 0f,
    val isMuted: Boolean = false,
    val isRecordingConsentGranted: Boolean = false,
    val isSpeakerOn: Boolean = true,
    val activeVoiceName: String = "Zayn (Prime Male)",
    val speed: Float = 1.0f,
    val pitch: Float = 0.95f,
    val volume: Float = 1.0f,
    val detectedLanguage: String = "Auto-Detect",
    val isOnlineNeural: Boolean = true,
    val mode: VoiceMode = VoiceMode.GENERAL,
    val comedyLevel: ComedyLevel = ComedyLevel.FRIENDLY,
    val errorMessage: String? = null
)

interface VoiceEngine {
    val sessionState: StateFlow<VoiceSessionState>

    fun startSession(mode: VoiceMode, comedyLevel: ComedyLevel = ComedyLevel.FRIENDLY)
    fun stopSession()
    fun interruptAiSpeech() // Instant Barge-in
    fun setMute(muted: Boolean)
    fun setSpeaker(speakerOn: Boolean)
    fun setSpeed(speed: Float)
    fun setPitch(pitch: Float)
    fun setVolume(volume: Float)
    fun setLanguage(languageCode: String)
    fun selectVoice(voiceId: String)
    fun toggleEngineMode(isOnline: Boolean)
    suspend fun exportCurrentAudio(outputDir: File): Result<File>
    suspend fun exportTranscript(outputDir: File): Result<File>
}
