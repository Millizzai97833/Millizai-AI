package com.shahabmillizai.millizai.ui.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.EditNote
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Memory
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.RecordVoiceOver
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
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

@Composable
fun HomeScreen(
    isOffline: Boolean,
    currentModelName: String,
    onNavigateToChat: () -> Unit,
    onNavigateToImage: () -> Unit,
    onNavigateToWriting: () -> Unit,
    onNavigateToCoding: () -> Unit,
    onNavigateToVoiceGeneral: () -> Unit,
    onNavigateToPalmistryVoice: () -> Unit,
    onNavigateToMentalComedy: () -> Unit,
    onNavigateToMature18: () -> Unit,
    onNavigateToLibrary: () -> Unit,
    onNavigateToDownloads: () -> Unit,
    onNavigateToHistory: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToAbout: () -> Unit,
    onNavigateToVideo: (() -> Unit)? = null
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MillizaiBlackBg)
            .padding(16.dp)
    ) {
        item {
            // Top Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.linearGradient(listOf(MillizaiPurple, MillizaiBlue))
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = "Logo",
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Millizai AI",
                            color = TextPrimaryDark,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "by Shahab Millizai",
                            color = TextSecondaryDark,
                            fontSize = 11.sp
                        )
                    }
                }

                Row {
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                if (isOffline) Color(0xFF1E3A8A) else Color(0xFF065F46)
                            )
                            .padding(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = if (isOffline) "OFFLINE GGUF" else "ONLINE ACTIVE",
                            color = Color.White,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Hero Status Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MillizaiPurple.copy(alpha = 0.4f), RoundedCornerShape(18.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(18.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Active AI Engine",
                        color = TextSecondaryDark,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (isOffline) "Local: $currentModelName" else "Online: OpenAI-Compatible / Self-Hosted",
                        color = TextPrimaryDark,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (isOffline) "Private on-device inference without internet" else "Low-latency streaming with cloud or self-hosted endpoint",
                        color = MillizaiCyan,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Text(
                text = "Live AI Voice Systems",
                color = TextPrimaryDark,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Two-way spoken conversation with animated voice orb & VAD",
                color = MillizaiCyan,
                fontSize = 12.sp
            )

            Spacer(modifier = Modifier.height(12.dp))
        }

        // 4 Dedicated Live Voice Cards
        item {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeFeatureCard(
                    title = "General Voice Chat",
                    desc = "Continuous natural two-way conversation with barge-in",
                    icon = Icons.Default.Mic,
                    color = MillizaiPurple,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToVoiceGeneral
                )
                HomeFeatureCard(
                    title = "Palmistry Voice Master",
                    desc = "Palm photo scanning & spoken destiny reading",
                    icon = Icons.Default.Visibility,
                    color = MillizaiCyan,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToPalmistryVoice
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeFeatureCard(
                    title = "Mental Comedy Voice",
                    desc = "4-level savage roasting & unhinged jokes",
                    icon = Icons.Default.RecordVoiceOver,
                    color = Color(0xFFF59E0B),
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToMentalComedy
                )
                HomeFeatureCard(
                    title = "18+ Mature Voice",
                    desc = "Age-gated romantic & mature life discussions",
                    icon = Icons.Default.Favorite,
                    color = Color(0xFFEC4899),
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToMature18
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "AI Workspaces & Tools",
                color = TextPrimaryDark,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeFeatureCard(
                    title = "AI Chat",
                    desc = "Real-time multilingual conversation",
                    icon = Icons.Default.Message,
                    color = MillizaiBlue,
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToChat
                )
                HomeFeatureCard(
                    title = "Image Generator",
                    desc = "Text to image with SD & diffusion",
                    icon = Icons.Default.Image,
                    color = Color(0xFF10B981),
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToImage
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeFeatureCard(
                    title = "Writing Assistant",
                    desc = "Essays, emails, poetry in Urdu/Pashto",
                    icon = Icons.Default.EditNote,
                    color = Color(0xFF8B5CF6),
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToWriting
                )
                HomeFeatureCard(
                    title = "Coding Assistant",
                    desc = "Debugging, Kotlin & script generation",
                    icon = Icons.Default.Code,
                    color = Color(0xFF38BDF8),
                    modifier = Modifier.weight(1f),
                    onClick = onNavigateToCoding
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                HomeFeatureCard(
                    title = "AI Video Studio",
                    desc = "Real online text & image to video, stories (5-30s)",
                    icon = Icons.Default.Videocam,
                    color = MillizaiCyan,
                    modifier = Modifier.fillMaxWidth(),
                    onClick = { onNavigateToVideo?.invoke() }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "Model Management & History",
                color = TextPrimaryDark,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(12.dp))
        }

        // Secondary rows
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                CompactMenuRow("AI Model Library", "Curated lightweight GGUF & SD models", Icons.Default.Memory, onNavigateToLibrary)
                CompactMenuRow("Model Downloads", "Manage local storage & import .gguf files", Icons.Default.Download, onNavigateToDownloads)
                CompactMenuRow("Chat History", "Locally encrypted Room conversation database", Icons.Default.History, onNavigateToHistory)
                CompactMenuRow("App Settings", "Configure server URL, API keys, and theme", Icons.Default.Settings, onNavigateToSettings)
                CompactMenuRow("About Shahab Millizai", "Developer profile, mission & GitHub repository", Icons.Default.Info, onNavigateToAbout)
            }
            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
fun HomeFeatureCard(
    title: String,
    desc: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(16.dp))
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(color.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = title, tint = color)
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(text = title, color = TextPrimaryDark, fontSize = 15.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = desc, color = TextSecondaryDark, fontSize = 11.sp, lineHeight = 15.sp)
        }
    }
}

@Composable
fun CompactMenuRow(
    title: String,
    subtitle: String,
    icon: ImageVector,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(imageVector = icon, contentDescription = title, tint = MillizaiCyan, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(text = title, color = TextPrimaryDark, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
                Text(text = subtitle, color = TextSecondaryDark, fontSize = 11.sp)
            }
        }
    }
}
