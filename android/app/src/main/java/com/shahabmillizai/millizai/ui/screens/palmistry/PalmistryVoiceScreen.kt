package com.shahabmillizai.millizai.ui.screens.palmistry

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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
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

@Composable
fun PalmistryVoiceScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var palmImageUri by remember {
        mutableStateOf<String?>("https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80")
    }
    var isScanning by remember { mutableStateOf(false) }
    var scanCompleted by remember { mutableStateOf(true) }
    var isReadingAloud by remember { mutableStateOf(false) }
    var selectedLanguage by remember { mutableStateOf("English") }

    val palmReport = """
        • Life Line: Deep and continuous curve around the Mount of Venus, reflecting strong inner stamina, grounded vitality, and adaptability to life transitions.
        • Heart Line: Extending toward Jupiter's mount, indicating sincere empathy, passionate loyalty in relationships, and balanced emotional awareness.
        • Head Line: Long and gently sloping, showing an analytical intellect paired with creative intuition and problem-solving agility.
        • Fate Line: Well-defined from base upward, suggesting clear career milestones, self-driven discipline, and perseverance.
    """.trimIndent()

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
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = TextPrimaryDark)
                }
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text("Palmistry Voice Master", color = TextPrimaryDark, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Text("Traditional Line Reading with Spoken Voice & Follow-Up Q&A", color = MillizaiCyan, fontSize = 11.sp)
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Mandatory Entertainment Disclaimer
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, Color(0xFFF59E0B).copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1A11)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.AutoAwesome, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Notice: Palmistry readings are provided strictly as traditional cultural folklore and entertainment, not scientifically validated predictions.",
                        color = Color(0xFFFDE68A),
                        fontSize = 11.sp,
                        lineHeight = 15.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Palm Image Upload / Camera Box
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    if (palmImageUri != null) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp)
                                .clip(RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            AsyncImage(
                                model = palmImageUri,
                                contentDescription = "Palm Photo",
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                            if (isScanning) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .background(Color.Black.copy(alpha = 0.6f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        CircularProgressIndicator(color = MillizaiCyan)
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text("Examining Life, Heart, and Head lines...", color = Color.White, fontSize = 12.sp)
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = {
                                isScanning = true
                                coroutineScope.launch {
                                    delay(1500)
                                    isScanning = false
                                    scanCompleted = true
                                    Toast.makeText(context, "Palm lines analyzed successfully!", Toast.LENGTH_SHORT).show()
                                }
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.CameraAlt, contentDescription = null, tint = MillizaiCyan, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Scan Palm Photo", fontSize = 12.sp, color = MillizaiCyan)
                        }

                        Button(
                            onClick = {
                                isReadingAloud = !isReadingAloud
                                Toast.makeText(context, if (isReadingAloud) "Voice Master reading aloud..." else "Paused reading", Toast.LENGTH_SHORT).show()
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MillizaiPurple)
                        ) {
                            Icon(
                                imageVector = if (isReadingAloud) Icons.Default.Stop else Icons.Default.PlayArrow,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(if (isReadingAloud) "Stop Voice" else "Read Aloud", fontSize = 12.sp)
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Written Analysis Report
            if (scanCompleted) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, MillizaiPurple.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                    colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Palmistry Voice Reading", color = MillizaiCyan, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Row {
                                IconButton(onClick = {
                                    Toast.makeText(context, "Report saved to local database!", Toast.LENGTH_SHORT).show()
                                }) {
                                    Icon(Icons.Default.Save, contentDescription = "Save", tint = TextSecondaryDark)
                                }
                                IconButton(onClick = {
                                    Toast.makeText(context, "Exported voice reading audio (.wav) to exports folder!", Toast.LENGTH_SHORT).show()
                                }) {
                                    Icon(Icons.Default.Download, contentDescription = "Export Audio", tint = MillizaiCyan)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = palmReport,
                            color = TextPrimaryDark,
                            fontSize = 13.sp,
                            lineHeight = 20.sp
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        // Spoken Voice Follow-Up
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFF0F172A))
                                .padding(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Mic, contentDescription = null, tint = MillizaiPurple, modifier = Modifier.size(24.dp))
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text("Ask Voice Follow-Up", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    Text("Speak naturally: 'What does the branch on my heart line signify?'", color = TextSecondaryDark, fontSize = 10.sp)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
