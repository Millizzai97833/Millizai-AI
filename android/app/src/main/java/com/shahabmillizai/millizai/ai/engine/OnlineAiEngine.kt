package com.shahabmillizai.millizai.ai.engine

import com.google.gson.Gson
import com.shahabmillizai.millizai.data.local.db.MessageEntity
import com.shahabmillizai.millizai.data.remote.dto.ChatCompletionRequest
import com.shahabmillizai.millizai.data.remote.dto.ChatMessageDto
import com.shahabmillizai.millizai.data.remote.dto.StreamChatCompletionChunk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.BufferedReader
import java.io.InputStreamReader
import java.util.concurrent.TimeUnit

class OnlineAiEngine(
    private val endpointUrl: String,
    private val apiKey: String,
    private val modelName: String
) : AiEngine {

    override val engineName: String = "Online ($modelName)"
    override val isReady: Boolean = endpointUrl.isNotBlank()

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(120, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()

    private val gson = Gson()

    override fun generateStream(
        messages: List<MessageEntity>,
        systemPrompt: String,
        temperature: Float
    ): Flow<String> = flow {
        if (endpointUrl.isBlank()) {
            throw IllegalStateException("API endpoint is not configured. Please open Settings.")
        }

        val dtoList = mutableListOf<ChatMessageDto>()
        if (systemPrompt.isNotBlank()) {
            dtoList.add(ChatMessageDto(role = "system", content = systemPrompt))
        }
        for (m in messages) {
            dtoList.add(ChatMessageDto(role = m.role, content = m.content))
        }

        val requestObj = ChatCompletionRequest(
            model = modelName.ifBlank { "gpt-4o-mini" },
            messages = dtoList,
            temperature = temperature,
            stream = true
        )

        val jsonBody = gson.toJson(requestObj)
        val fullUrl = if (endpointUrl.endsWith("/chat/completions")) {
            endpointUrl
        } else {
            "${endpointUrl.trimEnd('/')}/chat/completions"
        }

        val requestBuilder = Request.Builder()
            .url(fullUrl)
            .post(jsonBody.toRequestBody("application/json; charset=utf-8".toMediaType()))

        if (apiKey.isNotBlank()) {
            requestBuilder.header("Authorization", "Bearer $apiKey")
        }

        val response = client.newCall(requestBuilder.build()).execute()
        if (!response.isSuccessful) {
            val errorBody = response.body?.string() ?: "HTTP ${response.code}"
            throw RuntimeException("Online inference server returned HTTP ${response.code}: $errorBody")
        }

        val responseStream = response.body?.byteStream()
            ?: throw RuntimeException("Empty response body from AI server")

        BufferedReader(InputStreamReader(responseStream)).use { reader ->
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                val cleanLine = line?.trim() ?: continue
                if (cleanLine.startsWith("data: ")) {
                    val data = cleanLine.substring(6).trim()
                    if (data == "[DONE]") break
                    try {
                        val chunk = gson.fromJson(data, StreamChatCompletionChunk::class.java)
                        val text = chunk.choices?.firstOrNull()?.delta?.content
                        if (!text.isNullOrEmpty()) {
                            emit(text)
                        }
                    } catch (_: Exception) {
                        // Keep parsing streaming chunks
                    }
                }
            }
        }
    }.flowOn(Dispatchers.IO)

    override suspend fun checkHealth(): Result<String> = withContext(Dispatchers.IO) {
        try {
            val fullUrl = if (endpointUrl.endsWith("/models")) {
                endpointUrl
            } else {
                "${endpointUrl.trimEnd('/')}/models"
            }
            val requestBuilder = Request.Builder().url(fullUrl).get()
            if (apiKey.isNotBlank()) {
                requestBuilder.header("Authorization", "Bearer $apiKey")
            }
            val response = client.newCall(requestBuilder.build()).execute()
            if (response.isSuccessful) {
                Result.success("Connected successfully to $endpointUrl")
            } else {
                Result.failure(RuntimeException("Server responded with code ${response.code}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
