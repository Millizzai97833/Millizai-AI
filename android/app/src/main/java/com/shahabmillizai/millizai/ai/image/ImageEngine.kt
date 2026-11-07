package com.shahabmillizai.millizai.ai.image

import java.io.File

interface ImageEngine {
    val engineName: String
    val isReady: Boolean

    suspend fun generateImage(
        prompt: String,
        negativePrompt: String?,
        width: Int,
        height: Int,
        steps: Int,
        seed: Long,
        outputDir: File,
        onProgress: (Int, String) -> Unit
    ): Result<File>
}
