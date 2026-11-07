package com.shahabmillizai.millizai.ui.screens.about

import android.content.Intent
import android.net.Uri
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
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.OpenInNew
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
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
fun AboutDeveloperScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current

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
                Text(
                    text = "About the Developer",
                    color = TextPrimaryDark,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Developer Spotlight Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MillizaiPurple.copy(alpha = 0.5f), RoundedCornerShape(20.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(20.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .size(76.dp)
                            .clip(CircleShape)
                            .background(Brush.linearGradient(listOf(MillizaiPurple, MillizaiBlue)))
                            .border(2.dp, MillizaiCyan, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.Person, contentDescription = null, tint = Color.White, modifier = Modifier.size(42.dp))
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text("Shahab Millizai", color = TextPrimaryDark, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold)
                    Text("Lead AI Architect & Android Systems Engineer", color = MillizaiCyan, fontSize = 13.sp)

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Shahab Millizai created Millizai AI to democratize powerful machine learning on Android. " +
                        "Combining local quantized GGUF LLMs (via llama.cpp), low-latency cloud inference, and diffusion-based image generation, " +
                        "Millizai AI bridges high-performance computing with privacy and indigenous multilingual support (Urdu, Pashto, English).",
                        color = TextSecondaryDark,
                        fontSize = 13.sp,
                        lineHeight = 19.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Technical Specs Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Application Specifications", color = TextPrimaryDark, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(10.dp))

                    SpecRow("Application Name", "Millizai AI")
                    SpecRow("Package Name", "com.shahabmillizai.millizai")
                    SpecRow("Version", "1.0 (Build 1)")
                    SpecRow("Target SDK", "Android SDK 36 (Java 17)")
                    SpecRow("Minimum SDK", "Android SDK 24 (Android 7.0+)")
                    SpecRow("UI Toolkit", "Jetpack Compose & Material 3")
                    SpecRow("Local Database", "AndroidX Room (SQLite)")
                    SpecRow("Preferences", "Jetpack DataStore")
                    SpecRow("Inference Engine", "llama.cpp JNI + OkHttp SSE")
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // GitHub Repository Card
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(16.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Code, contentDescription = null, tint = MillizaiCyan)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Official GitHub Repository", color = TextPrimaryDark, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "https://github.com/Millizzai97833/Millizai-AI",
                        color = TextSecondaryDark,
                        fontSize = 12.sp
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://github.com/Millizzai97833/Millizai-AI"))
                            context.startActivity(intent)
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = MillizaiBlue),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Default.OpenInNew, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Visit GitHub Repository", fontSize = 12.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}

@Composable
fun SpecRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = TextSecondaryDark, fontSize = 12.sp)
        Text(value, color = TextPrimaryDark, fontSize = 12.sp, fontWeight = FontWeight.Medium)
    }
}
