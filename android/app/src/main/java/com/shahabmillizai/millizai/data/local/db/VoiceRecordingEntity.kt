package com.shahabmillizai.millizai.data.local.db

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "voice_recordings")
data class VoiceRecordingEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val mode: String, // "general", "palmistry", "mental_comedy", "mature_18"
    val audioPath: String?,
    val transcript: String,
    val durationSeconds: Int = 0,
    val timestamp: Long = System.currentTimeMillis(),
    val language: String = "en",
    val isConsentGranted: Boolean = true
)
