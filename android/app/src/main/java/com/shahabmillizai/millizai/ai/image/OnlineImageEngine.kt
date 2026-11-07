package com.shahabmillizai.millizai.ai.image

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.FileOutputStream
import java.net.URLEncoder
import java.util.UUID
import java.util.concurrent.TimeUnit

class OnlineImageEngine(
    private val endpointUrl: String,
    private val apiKey: String? = null
) : ImageEngine {

    override val engineName: String = "Online Image Synthesizer"
    override val isReady: Boolean = true

    private val client = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(180, TimeUnit.SECONDS)
        .build()

    override suspend fun generateImage(
        prompt: String,
        negativePrompt: String?,
        width: Int,
        height: Int,
        steps: Int,
        seed: Long,
        outputDir: File,
        onProgress: (Int, String) -> Unit
    ): Result<File> = withContext(Dispatchers.IO) {
        try {
            onProgress(15, "Connecting to image generation server...")

            val encodedPrompt = URLEncoder.encode(prompt, "UTF-8")
            val effectiveSeed = if (seed <= 0) (1000..999999).random() else seed

            val targetUrl = when {
                endpointUrl.contains("pollinations.ai") -> {
                    "$endpointUrl/$encodedPrompt?width=$width&height=$height&seed=$effectiveSeed&nologo=true"
                }
                endpointUrl.contains("openai.com") || endpointUrl.contains("/v1/images/generations") -> {
                    endpointUrl
                }
                else -> {
                    // Standard prompt URL endpoint
                    "$endpointUrl?prompt=$encodedPrompt&width=$width&height=$height&seed=$effectiveSeed"
                }
            }

            onProgress(35, "Synthesizing latent diffusion representations...")

            val requestBuilder = Request.Builder().url(targetUrl).get()
            if (!apiKey.isNullOrBlank()) {
                requestBuilder.header("Authorization", "Bearer $apiKey")
            }

            onProgress(60, "Denoising diffusion steps (steps: $steps)...")

            val response = client.newCall(requestBuilder.build()).execute()
            if (!response.isSuccessful) {
                return@withContext Result.failure(
                    RuntimeException("Image server responded with error HTTP ${response.code}")
                )
            }

            onProgress(85, "Encoding bitmap and writing to local disk...")

            val body = response.body ?: return@withContext Result.failure(
                RuntimeException("Empty image response from server")
            )

            if (!outputDir.exists()) {
                outputDir.mkdirs()
            }

            val outputFile = File(outputDir, "millizai_img_${System.currentTimeMillis()}_${UUID.randomUUID().toString().take(6)}.jpg")
            FileOutputStream(outputFile).use { outStream ->
                body.byteStream().copyTo(outStream)
            }

            onProgress(100, "Image generated successfully!")
            Result.success(outputFile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
