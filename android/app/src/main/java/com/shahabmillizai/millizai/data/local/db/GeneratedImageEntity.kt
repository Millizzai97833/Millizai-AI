package com.shahabmillizai.millizai.data.local.db

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "generated_images")
data class GeneratedImageEntity(
    @PrimaryKey
    val id: String,
    val prompt: String,
    val negativePrompt: String? = null,
    val imagePath: String, // Local storage file path or cache URI
    val width: Int = 512,
    val height: Int = 512,
    val steps: Int = 20,
    val seed: Long = 0L,
    val modelUsed: String = "SD-Turbo",
    val mode: String = "online", // "online" or "offline"
    val createdAt: Long = System.currentTimeMillis()
)
