package com.shahabmillizai.millizai.ui.screens.downloads

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.FileUpload
import androidx.compose.material.icons.filled.SdCard
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.RadioButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.shahabmillizai.millizai.data.local.db.ModelEntity
import com.shahabmillizai.millizai.theme.MillizaiBlackBg
import com.shahabmillizai.millizai.theme.MillizaiBlue
import com.shahabmillizai.millizai.theme.MillizaiCardBorderDark
import com.shahabmillizai.millizai.theme.MillizaiCardDark
import com.shahabmillizai.millizai.theme.MillizaiCyan
import com.shahabmillizai.millizai.theme.MillizaiPurple
import com.shahabmillizai.millizai.theme.TextPrimaryDark
import com.shahabmillizai.millizai.theme.TextSecondaryDark
import java.util.UUID

@Composable
fun ModelDownloadsScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current

    val downloadedModels = remember {
        mutableStateListOf(
            ModelEntity(
                id = "llama-3.2-1b-local",
                name = "Llama-3.2-1B-Instruct-Q4_K_M",
                fileName = "Llama-3.2-1B-Instruct-Q4_K_M.gguf",
                filePath = "/data/user/0/com.shahabmillizai.millizai/files/models/Llama-3.2-1B-Instruct-Q4_K_M.gguf",
                sizeBytes = 817889280L,
                contextLength = 4096,
                quantization = "Q4_K_M",
                parameterSize = "1.23B",
                requiredRamMb = 1200,
                isSelected = true,
                isDownloaded = true
            ),
            ModelEntity(
                id = "qwen2.5-0.5b-local",
                name = "Qwen2.5-0.5B-Instruct-Q4_K_M",
                fileName = "qwen2.5-0.5b-instruct-q4_k_m.gguf",
                filePath = "/data/user/0/com.shahabmillizai.millizai/files/models/qwen2.5-0.5b-instruct-q4_k_m.gguf",
                sizeBytes = 440401920L,
                contextLength = 2048,
                quantization = "Q4_K_M",
                parameterSize = "0.49B",
                requiredRamMb = 650,
                isSelected = false,
                isDownloaded = true
            )
        )
    }

    var selectedModelId by remember { mutableStateOf("llama-3.2-1b-local") }
    var isSimulatingDownload by remember { mutableStateOf(false) }
    var downloadPct by remember { mutableStateOf(45) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MillizaiBlackBg)
            .padding(16.dp)
    ) {
        item {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = TextPrimaryDark
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(
                        text = "Model Downloads & Storage",
                        color = TextPrimaryDark,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "GGUF Binary Management & SAF Importer",
                        color = MillizaiCyan,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Storage Overview Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.SdCard, contentDescription = null, tint = MillizaiCyan, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text("Internal Device Storage", color = TextPrimaryDark, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Text("24.8 GB Free • 1.25 GB Used by Millizai AI", color = TextSecondaryDark, fontSize = 12.sp)
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    LinearProgressIndicator(
                        progress = { 0.28f },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = MillizaiPurple,
                        trackColor = Color(0xFF0F172A),
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Import Custom .GGUF Button
            OutlinedButton(
                onClick = {
                    val newModel = ModelEntity(
                        id = UUID.randomUUID().toString(),
                        name = "Custom-Imported-Model.gguf",
                        fileName = "custom_model.gguf",
                        filePath = "/sdcard/Download/custom_model.gguf",
                        sizeBytes = 650000000L,
                        contextLength = 2048,
                        quantization = "Custom Q4",
                        parameterSize = "1B",
                        requiredRamMb = 1100,
                        isSelected = true,
                        isDownloaded = true
                    )
                    downloadedModels.add(newModel)
                    selectedModelId = newModel.id
                    Toast.makeText(context, "Imported custom GGUF model successfully!", Toast.LENGTH_SHORT).show()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(46.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.FileUpload, contentDescription = null, tint = MillizaiCyan)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Import .GGUF from Device Storage", color = MillizaiCyan, fontSize = 13.sp)
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text("Installed Models on Device", color = TextPrimaryDark, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(10.dp))
        }

        items(downloadedModels) { model ->
            val isSelected = selectedModelId == model.id
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
                    .border(
                        1.dp,
                        if (isSelected) MillizaiPurple else MillizaiCardBorderDark,
                        RoundedCornerShape(14.dp)
                    ),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(14.dp)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(
                        selected = isSelected,
                        onClick = { selectedModelId = model.id },
                        colors = RadioButtonDefaults.colors(selectedColor = MillizaiPurple)
                    )

                    Spacer(modifier = Modifier.width(8.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(model.name, color = TextPrimaryDark, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            if (isSelected) {
                                Spacer(modifier = Modifier.width(6.dp))
                                Icon(Icons.Default.CheckCircle, contentDescription = "Active", tint = MillizaiCyan, modifier = Modifier.size(16.dp))
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${formatBytes(model.sizeBytes)} • Context: ${model.contextLength} tokens",
                            color = TextSecondaryDark,
                            fontSize = 11.sp
                        )
                        Text(
                            text = "Path: ${model.filePath.takeLast(35)}...",
                            color = Color(0xFF64748B),
                            fontSize = 10.sp
                        )
                    }

                    IconButton(onClick = {
                        downloadedModels.remove(model)
                        Toast.makeText(context, "Deleted ${model.name}", Toast.LENGTH_SHORT).show()
                    }) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color(0xFFEF4444))
                    }
                }
            }
        }
    }
}

private fun formatBytes(bytes: Long): String {
    return when {
        bytes >= 1024 * 1024 * 1024 -> String.format("%.2f GB", bytes.toDouble() / (1024 * 1024 * 1024))
        bytes >= 1024 * 1024 -> String.format("%.1f MB", bytes.toDouble() / (1024 * 1024))
        else -> "$bytes B"
    }
}
