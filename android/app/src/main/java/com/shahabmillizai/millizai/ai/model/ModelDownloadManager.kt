package com.shahabmillizai.millizai.ai.model

import android.content.Context
import android.os.Environment
import android.os.StatFs
import com.shahabmillizai.millizai.data.local.dao.ModelDao
import com.shahabmillizai.millizai.data.local.db.ModelEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.UUID
import java.util.concurrent.TimeUnit

data class DownloadProgress(
    val modelId: String,
    val modelName: String,
    val bytesDownloaded: Long,
    val totalBytes: Long,
    val percentage: Int,
    val isDownloading: Boolean,
    val isCompleted: Boolean,
    val errorMessage: String? = null
)

class ModelDownloadManager(
    private val context: Context,
    private val modelDao: ModelDao
) {
    private val _downloadState = MutableStateFlow<Map<String, DownloadProgress>>(emptyMap())
    val downloadState = _downloadState.asStateFlow()

    private val client = OkHttpClient.Builder()
        .connectTimeout(60, TimeUnit.SECONDS)
        .readTimeout(300, TimeUnit.SECONDS)
        .build()

    fun getModelsDirectory(): File {
        val dir = File(context.filesDir, "models")
        if (!dir.exists()) dir.mkdirs()
        return dir
    }

    fun getAvailableStorageBytes(): Long {
        val stat = StatFs(context.filesDir.path)
        return stat.availableBlocksLong * stat.blockSizeLong
    }

    suspend fun downloadModel(
        modelId: String,
        name: String,
        fileName: String,
        downloadUrl: String,
        expectedSizeBytes: Long,
        quantization: String,
        parameterSize: String,
        requiredRamMb: Int
    ) = withContext(Dispatchers.IO) {
        val freeBytes = getAvailableStorageBytes()
        if (freeBytes < expectedSizeBytes + (200 * 1024 * 1024)) { // 200MB safety buffer
            _downloadState.value = _downloadState.value + (modelId to DownloadProgress(
                modelId = modelId,
                modelName = name,
                bytesDownloaded = 0,
                totalBytes = expectedSizeBytes,
                percentage = 0,
                isDownloading = false,
                isCompleted = false,
                errorMessage = "Insufficient storage: Free space is ${formatBytes(freeBytes)}, but model needs ${formatBytes(expectedSizeBytes)}."
            ))
            return@withContext
        }

        val targetFile = File(getModelsDirectory(), fileName)

        try {
            _downloadState.value = _downloadState.value + (modelId to DownloadProgress(
                modelId = modelId,
                modelName = name,
                bytesDownloaded = 0,
                totalBytes = expectedSizeBytes,
                percentage = 0,
                isDownloading = true,
                isCompleted = false
            ))

            val request = Request.Builder().url(downloadUrl).build()
            val response = client.newCall(request).execute()

            if (!response.isSuccessful) {
                throw RuntimeException("HTTP download failed with code ${response.code}")
            }

            val body = response.body ?: throw RuntimeException("Empty response body")
            val totalLength = if (body.contentLength() > 0) body.contentLength() else expectedSizeBytes

            body.byteStream().use { input: InputStream ->
                FileOutputStream(targetFile).use { output ->
                    val buffer = ByteArray(16 * 1024)
                    var bytesRead: Int
                    var totalDownloaded = 0L
                    var lastUpdate = 0L

                    while (input.read(buffer).also { bytesRead = it } != -1) {
                        output.write(buffer, 0, bytesRead)
                        totalDownloaded += bytesRead

                        val now = System.currentTimeMillis()
                        if (now - lastUpdate > 300) {
                            lastUpdate = now
                            val pct = ((totalDownloaded.toDouble() / totalLength.toDouble()) * 100).toInt()
                            _downloadState.value = _downloadState.value + (modelId to DownloadProgress(
                                modelId = modelId,
                                modelName = name,
                                bytesDownloaded = totalDownloaded,
                                totalBytes = totalLength,
                                percentage = pct.coerceIn(0, 100),
                                isDownloading = true,
                                isCompleted = false
                            ))
                        }
                    }
                }
            }

            // Save to Room DB
            val entity = ModelEntity(
                id = modelId,
                name = name,
                fileName = fileName,
                filePath = targetFile.absolutePath,
                sizeBytes = targetFile.length(),
                quantization = quantization,
                parameterSize = parameterSize,
                requiredRamMb = requiredRamMb,
                isSelected = true,
                isDownloaded = true
            )
            modelDao.insertModel(entity)
            modelDao.selectModelById(modelId)

            _downloadState.value = _downloadState.value + (modelId to DownloadProgress(
                modelId = modelId,
                modelName = name,
                bytesDownloaded = targetFile.length(),
                totalBytes = targetFile.length(),
                percentage = 100,
                isDownloading = false,
                isCompleted = true
            ))
        } catch (e: Exception) {
            if (targetFile.exists()) targetFile.delete()
            _downloadState.value = _downloadState.value + (modelId to DownloadProgress(
                modelId = modelId,
                modelName = name,
                bytesDownloaded = 0,
                totalBytes = expectedSizeBytes,
                percentage = 0,
                isDownloading = false,
                isCompleted = false,
                errorMessage = e.message ?: "Download failed"
            ))
        }
    }

    suspend fun importLocalGguf(file: File, customName: String): ModelEntity {
        val modelId = UUID.randomUUID().toString()
        val entity = ModelEntity(
            id = modelId,
            name = customName.ifBlank { file.nameWithoutExtension },
            fileName = file.name,
            filePath = file.absolutePath,
            sizeBytes = file.length(),
            quantization = "Custom GGUF",
            parameterSize = "Unknown",
            requiredRamMb = (file.length() / (1024 * 1024) * 1.3).toInt(),
            isSelected = true,
            isDownloaded = true
        )
        modelDao.insertModel(entity)
        modelDao.selectModelById(modelId)
        return entity
    }

    fun formatBytes(bytes: Long): String {
        return when {
            bytes >= 1024 * 1024 * 1024 -> String.format("%.2f GB", bytes.toDouble() / (1024 * 1024 * 1024))
            bytes >= 1024 * 1024 -> String.format("%.1f MB", bytes.toDouble() / (1024 * 1024))
            else -> "$bytes B"
        }
    }
}
