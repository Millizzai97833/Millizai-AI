package com.shahabmillizai.millizai.data.local.db

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "models")
data class ModelEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val fileName: String,
    val filePath: String,
    val sizeBytes: Long,
    val contextLength: Int = 2048,
    val quantization: String = "Q4_K_M",
    val parameterSize: String = "1.5B",
    val requiredRamMb: Int = 1800,
    val isSelected: Boolean = false,
    val isDownloaded: Boolean = true,
    val downloadedAt: Long = System.currentTimeMillis()
)
