package com.shahabmillizai.millizai.ai.engine

import com.shahabmillizai.millizai.data.local.db.MessageEntity
import kotlinx.coroutines.flow.Flow

interface AiEngine {
    val engineName: String
    val isReady: Boolean

    /**
     * Streams responses chunk by chunk for realistic typing and instant feedback.
     */
    fun generateStream(
        messages: List<MessageEntity>,
        systemPrompt: String,
        temperature: Float
    ): Flow<String>

    suspend fun checkHealth(): Result<String>
}
