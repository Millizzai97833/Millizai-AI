package com.shahabmillizai.millizai.ui.screens.models

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
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.shahabmillizai.millizai.theme.MillizaiBlackBg
import com.shahabmillizai.millizai.theme.MillizaiBlue
import com.shahabmillizai.millizai.theme.MillizaiCardBorderDark
import com.shahabmillizai.millizai.theme.MillizaiCardDark
import com.shahabmillizai.millizai.theme.MillizaiCyan
import com.shahabmillizai.millizai.theme.MillizaiPurple
import com.shahabmillizai.millizai.theme.TextPrimaryDark
import com.shahabmillizai.millizai.theme.TextSecondaryDark

data class CatalogModel(
    val id: String,
    val name: String,
    val family: String,
    val sizeDisplay: String,
    val sizeBytes: Long,
    val ramRequiredMb: Int,
    val quantization: String,
    val description: String,
    val isRecommended: Boolean = false,
    val downloadUrl: String
)

@Composable
fun ModelLibraryScreen(
    onBack: () -> Unit,
    onDownloadSelected: (CatalogModel) -> Unit
) {
    val catalog = listOf(
        CatalogModel(
            id = "llama-3.2-1b-q4",
            name = "Llama 3.2 1B Instruct",
            family = "Meta AI",
            sizeDisplay = "780 MB",
            sizeBytes = 817889280L,
            ramRequiredMb = 1200,
            quantization = "Q4_K_M",
            description = "Optimized for mobile Snapdragon & MediaTek processors. Fast token streaming and multilingual comprehension.",
            isRecommended = true,
            downloadUrl = "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf"
        ),
        CatalogModel(
            id = "qwen2.5-0.5b-q4",
            name = "Qwen 2.5 0.5B Instruct",
            family = "Alibaba Cloud",
            sizeDisplay = "420 MB",
            sizeBytes = 440401920L,
            ramRequiredMb = 650,
            quantization = "Q4_K_M",
            description = "Ultra-lightweight model running smoothly even on budget Android phones with 3GB RAM.",
            isRecommended = true,
            downloadUrl = "https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf"
        ),
        CatalogModel(
            id = "gemma-2-2b-q4",
            name = "Gemma 2 2B IT",
            family = "Google",
            sizeDisplay = "1.4 GB",
            sizeBytes = 1503238550L,
            ramRequiredMb = 2200,
            quantization = "Q4_K_M",
            description = "High accuracy reasoning and natural conversational flow built with Google DeepMind architecture.",
            isRecommended = false,
            downloadUrl = "https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q4_K_M.gguf"
        ),
        CatalogModel(
            id = "sd-turbo-mobile-q4",
            name = "Stable Diffusion Turbo Mobile",
            family = "Stability AI",
            sizeDisplay = "1.6 GB",
            sizeBytes = 1717986918L,
            ramRequiredMb = 2600,
            quantization = "Q4 UNet",
            description = "Single-step adversarial diffusion distillation for on-device image synthesis without cloud servers.",
            isRecommended = false,
            downloadUrl = "https://huggingface.co/stabilityai/sd-turbo/resolve/main/sd-turbo.safetensors"
        )
    )

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
                        text = "AI Model Library",
                        color = TextPrimaryDark,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Curated GGUF & Diffusion Models for Mobile",
                        color = MillizaiCyan,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Notice
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MillizaiPurple.copy(alpha = 0.4f), RoundedCornerShape(14.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(14.dp)
            ) {
                Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Memory, contentDescription = null, tint = MillizaiCyan, modifier = Modifier.size(24.dp))
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "Models are stored directly on your phone storage. You can chat 100% offline with zero cloud telemetry once downloaded.",
                        color = TextSecondaryDark,
                        fontSize = 11.sp,
                        lineHeight = 16.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))
        }

        items(catalog) { model ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp)
                    .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(model.name, color = TextPrimaryDark, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                            Text(model.family, color = MillizaiCyan, fontSize = 12.sp)
                        }

                        if (model.isRecommended) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0xFF065F46))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text("RECOMMENDED", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(model.description, color = TextSecondaryDark, fontSize = 12.sp, lineHeight = 17.sp)

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Size: ${model.sizeDisplay} • ${model.quantization}", color = TextPrimaryDark, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                            Text("RAM required: ~${model.ramRequiredMb} MB", color = TextSecondaryDark, fontSize = 11.sp)
                        }

                        Button(
                            onClick = { onDownloadSelected(model) },
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MillizaiPurple)
                        ) {
                            Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Download", fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}
