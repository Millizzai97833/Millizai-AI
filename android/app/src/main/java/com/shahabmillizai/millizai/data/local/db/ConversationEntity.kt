package com.shahabmillizai.millizai.data.local.db

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "conversations")
data class ConversationEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val mode: String = "online", // "online" or "offline"
    val modelName: String = "Default",
    val systemPrompt: String? = null
)
