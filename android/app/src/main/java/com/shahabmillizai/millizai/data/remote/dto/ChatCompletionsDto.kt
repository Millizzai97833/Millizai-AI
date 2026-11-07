package com.shahabmillizai.millizai.data.remote.dto

import com.google.gson.annotations.SerializedName

data class ChatCompletionRequest(
    @SerializedName("model") val model: String,
    @SerializedName("messages") val messages: List<ChatMessageDto>,
    @SerializedName("temperature") val temperature: Float = 0.7f,
    @SerializedName("stream") val stream: Boolean = false,
    @SerializedName("max_tokens") val maxTokens: Int = 2048
)

data class ChatMessageDto(
    @SerializedName("role") val role: String,
    @SerializedName("content") val content: String
)

data class ChatCompletionResponse(
    @SerializedName("id") val id: String?,
    @SerializedName("choices") val choices: List<ChatChoiceDto>?,
    @SerializedName("usage") val usage: UsageDto?
)

data class ChatChoiceDto(
    @SerializedName("index") val index: Int,
    @SerializedName("message") val message: ChatMessageDto?,
    @SerializedName("finish_reason") val finishReason: String?
)

data class UsageDto(
    @SerializedName("prompt_tokens") val promptTokens: Int,
    @SerializedName("completion_tokens") val completionTokens: Int,
    @SerializedName("total_tokens") val totalTokens: Int
)

data class StreamChatCompletionChunk(
    @SerializedName("id") val id: String?,
    @SerializedName("choices") val choices: List<StreamChoiceDto>?
)

data class StreamChoiceDto(
    @SerializedName("delta") val delta: StreamDeltaDto?,
    @SerializedName("finish_reason") val finishReason: String?
)

data class StreamDeltaDto(
    @SerializedName("content") val content: String?
)
