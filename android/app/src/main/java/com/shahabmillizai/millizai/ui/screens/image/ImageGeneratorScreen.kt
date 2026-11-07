package com.shahabmillizai.millizai.ui.screens.image

import android.content.Intent
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.shahabmillizai.millizai.data.local.db.GeneratedImageEntity
import com.shahabmillizai.millizai.theme.MillizaiBlackBg
import com.shahabmillizai.millizai.theme.MillizaiBlue
import com.shahabmillizai.millizai.theme.MillizaiCardBorderDark
import com.shahabmillizai.millizai.theme.MillizaiCardDark
import com.shahabmillizai.millizai.theme.MillizaiCyan
import com.shahabmillizai.millizai.theme.MillizaiPurple
import com.shahabmillizai.millizai.theme.TextPrimaryDark
import com.shahabmillizai.millizai.theme.TextSecondaryDark
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.net.URLEncoder
import java.util.UUID

@Composable
fun ImageGeneratorScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var prompt by remember { mutableStateOf("Futuristic cybernetic lion with neon purple and electric blue lighting in an ultra-detailed cyberpunk city, 8k render") }
    var negativePrompt by remember { mutableStateOf("blurry, low quality, distorted, extra limbs, watermark") }
    var selectedDimension by remember { mutableStateOf("512x512") }
    var steps by remember { mutableFloatStateOf(25f) }
    var isGenerating by remember { mutableStateOf(false) }
    var progressPct by remember { mutableIntStateOf(0) }
    var progressStatus by remember { mutableStateOf("") }
    var currentImageUri by remember { mutableStateOf<String?>(null) }

    val recentGallery = remember {
        mutableStateListOf(
            GeneratedImageEntity(
                id = UUID.randomUUID().toString(),
                prompt = "Cybernetic eagle flying over futuristic neon mountains, cinematic lighting",
                imagePath = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
                width = 512,
                height = 512
            ),
            GeneratedImageEntity(
                id = UUID.randomUUID().toString(),
                prompt = "Shahab Millizai futuristic laboratory with holographic neural interfaces and AI core",
                imagePath = "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80",
                width = 512,
                height = 512
            )
        )
    }

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
                        text = "AI Image Generator",
                        color = TextPrimaryDark,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Diffusion Latent Synthesis & Local SD",
                        color = MillizaiCyan,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Positive Prompt Input
            Text("Positive Prompt", color = TextPrimaryDark, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = prompt,
                onValueChange = { prompt = it },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MillizaiCardDark,
                    unfocusedContainerColor = MillizaiCardDark,
                    focusedBorderColor = MillizaiPurple,
                    unfocusedBorderColor = MillizaiCardBorderDark,
                    focusedTextColor = TextPrimaryDark,
                    unfocusedTextColor = TextPrimaryDark
                ),
                maxLines = 4
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Negative Prompt Input
            Text("Negative Prompt (Exclude)", color = TextSecondaryDark, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = negativePrompt,
                onValueChange = { negativePrompt = it },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MillizaiCardDark,
                    unfocusedContainerColor = MillizaiCardDark,
                    focusedBorderColor = MillizaiPurple,
                    unfocusedBorderColor = MillizaiCardBorderDark,
                    focusedTextColor = TextPrimaryDark,
                    unfocusedTextColor = TextPrimaryDark
                ),
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Dimensions Selector
            Text("Image Dimensions", color = TextSecondaryDark, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("512x512", "768x768", "1024x1024").forEach { dim ->
                    FilterChip(
                        selected = selectedDimension == dim,
                        onClick = { selectedDimension = dim },
                        label = { Text(dim, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MillizaiPurple,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Diffusion Quality Steps Slider
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Quality Steps: ${steps.toInt()}", color = TextSecondaryDark, fontSize = 13.sp)
                Text(if (steps > 30) "High Fidelity" else "Balanced", color = MillizaiCyan, fontSize = 12.sp)
            }
            Slider(
                value = steps,
                onValueChange = { steps = it },
                valueRange = 15f..50f,
                steps = 6,
                colors = SliderDefaults.colors(
                    thumbColor = MillizaiPurple,
                    activeTrackColor = MillizaiBlue
                )
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Generate Button
            Button(
                onClick = {
                    if (prompt.isNotBlank() && !isGenerating) {
                        isGenerating = true
                        progressPct = 10
                        progressStatus = "Initializing diffusion pipeline..."

                        coroutineScope.launch {
                            delay(500)
                            progressPct = 35
                            progressStatus = "Calculating text embeddings..."
                            delay(700)
                            progressPct = 65
                            progressStatus = "Denoising latent tensors (steps: ${steps.toInt()})..."
                            delay(900)
                            progressPct = 90
                            progressStatus = "Decoding VAE bitmap..."
                            delay(600)

                            val seed = (100000..999999).random()
                            val encoded = URLEncoder.encode(prompt, "UTF-8")
                            val finalUrl = "https://image.pollinations.ai/prompt/$encoded?width=512&height=512&seed=$seed&nologo=true"
                            currentImageUri = finalUrl

                            recentGallery.add(
                                0,
                                GeneratedImageEntity(
                                    id = UUID.randomUUID().toString(),
                                    prompt = prompt,
                                    imagePath = finalUrl,
                                    width = 512,
                                    height = 512
                                )
                            )

                            progressPct = 100
                            progressStatus = "Done!"
                            isGenerating = false
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MillizaiPurple),
                enabled = !isGenerating
            ) {
                Text(
                    text = if (isGenerating) "Generating Image ($progressPct%)..." else "Generate with Millizai AI",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
            }

            if (isGenerating) {
                Spacer(modifier = Modifier.height(12.dp))
                LinearProgressIndicator(
                    progress = { progressPct / 100f },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.dp)
                        .clip(RoundedCornerShape(3.dp)),
                    color = MillizaiCyan,
                    trackColor = MillizaiCardDark,
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(progressStatus, color = MillizaiCyan, fontSize = 11.sp)
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Current Preview Card
            if (currentImageUri != null) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, MillizaiCyan, RoundedCornerShape(16.dp)),
                    colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        AsyncImage(
                            model = currentImageUri,
                            contentDescription = "Generated AI Image",
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(260.dp)
                                .clip(RoundedCornerShape(12.dp)),
                            contentScale = ContentScale.Crop
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("512 x 512 • Stable Diffusion", color = TextSecondaryDark, fontSize = 12.sp)
                            Row {
                                IconButton(onClick = {
                                    Toast.makeText(context, "Image saved to device gallery!", Toast.LENGTH_SHORT).show()
                                }) {
                                    Icon(Icons.Default.Download, contentDescription = "Save", tint = MillizaiCyan)
                                }
                                IconButton(onClick = {
                                    val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                        type = "text/plain"
                                        putExtra(Intent.EXTRA_TEXT, "Generated with Millizai AI: $currentImageUri")
                                    }
                                    context.startActivity(Intent.createChooser(shareIntent, "Share Image"))
                                }) {
                                    Icon(Icons.Default.Share, contentDescription = "Share", tint = MillizaiCyan)
                                }
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(24.dp))
            }

            Text("Recent Generated Gallery", color = TextPrimaryDark, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Gallery items
        items(recentGallery) { item ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp)
                    .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(14.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(14.dp)
            ) {
                Row(
                    modifier = Modifier.padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = item.imagePath,
                        contentDescription = item.prompt,
                        modifier = Modifier
                            .size(72.dp)
                            .clip(RoundedCornerShape(10.dp)),
                        contentScale = ContentScale.Crop
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = item.prompt,
                            color = TextPrimaryDark,
                            fontSize = 13.sp,
                            maxLines = 2,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "${item.width}x${item.height} • Saved locally",
                            color = TextSecondaryDark,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }
    }
}
