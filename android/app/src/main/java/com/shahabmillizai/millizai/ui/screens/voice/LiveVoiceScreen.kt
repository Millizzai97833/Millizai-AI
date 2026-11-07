package com.shahabmillizai.millizai.ui.screens.voice

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CallEnd
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Hearing
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MicOff
import androidx.compose.material.icons.filled.RecordVoiceOver
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Stop
import androidx.compose.material.icons.filled.VolumeDown
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.shahabmillizai.millizai.ai.voice.ComedyLevel
import com.shahabmillizai.millizai.ai.voice.VoiceMode
import com.shahabmillizai.millizai.ai.voice.VoicePersonalities
import com.shahabmillizai.millizai.ai.voice.VoiceProfile
import com.shahabmillizai.millizai.data.local.db.MessageEntity
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
import java.util.UUID

@Composable
fun LiveVoiceScreen(
    initialMode: VoiceMode = VoiceMode.GENERAL,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val transcriptListState = rememberLazyListState()

    var voiceMode by remember { mutableStateOf(initialMode) }
    var comedyLevel by remember { mutableStateOf(ComedyLevel.SARCASTIC) }
    var isMuted by remember { mutableStateOf(false) }
    var isSpeakerOn by remember { mutableStateOf(true) }
    var speechSpeed by remember { mutableFloatStateOf(1.0f) }
    var selectedVoice by remember { mutableStateOf(VoicePersonalities.AVAILABLE_VOICES[0]) }

    // Live Voice States: LISTENING, THINKING, SPEAKING, IDLE
    var voiceState by remember { mutableStateOf("LISTENING") }
    var liveTranscription by remember { mutableStateOf("") }
    var showTranscript by remember { mutableStateOf(true) }
    var showAgeVerificationModal by remember { mutableStateOf(initialMode == VoiceMode.MATURE_18) }
    var isAgeVerified by remember { mutableStateOf(initialMode != VoiceMode.MATURE_18) }
    var recordingConsentGranted by remember { mutableStateOf(true) }

    val conversationLogs = remember {
        mutableStateListOf(
            MessageEntity(
                id = UUID.randomUUID().toString(),
                conversationId = "voice-${voiceMode.id}",
                role = "assistant",
                content = when (voiceMode) {
                    VoiceMode.GENERAL -> "Hello! I am listening. Speak naturally, and feel free to interrupt me at any time."
                    VoiceMode.MENTAL_COMEDY -> "Alright, who let you into the voice chat? Go ahead, talk, let me hear what you got!"
                    VoiceMode.MATURE_18 -> "Welcome to the private mature lounge. We can discuss relationships, life, and romance with adult nuance."
                    VoiceMode.PALMISTRY -> "Greetings, seeker. Hold your palm before me or ask of your destiny, love, and life line."
                },
                timestamp = System.currentTimeMillis()
            )
        )
    }

    // Dynamic Orb Animation
    val infiniteTransition = rememberInfiniteTransition(label = "voice_orb")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = if (voiceState == "SPEAKING") 0.95f else 1.0f,
        targetValue = if (voiceState == "SPEAKING") 1.25f else 1.08f,
        animationSpec = infiniteRepeatable(
            animation = tween(if (voiceState == "SPEAKING") 500 else 1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    val rotationAngle by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(8000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "spin"
    )

    // Age Verification Guardrail Dialog
    if (showAgeVerificationModal && !isAgeVerified) {
        AlertDialog(
            onDismissRequest = { onBack() },
            title = {
                Text(
                    text = "18+ Age Verification Required",
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Text(
                    text = "This mode contains adult conversations, mature themes, flirting, and unfiltered discussions suited for adults aged 18 and older.\n\n" +
                           "Please confirm that you are at least 18 years of age to proceed. Content involving minors or illegal acts is strictly prohibited.",
                    color = TextSecondaryDark,
                    fontSize = 13.sp,
                    lineHeight = 18.sp
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        isAgeVerified = true
                        showAgeVerificationModal = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MillizaiPurple)
                ) {
                    Text("I am 18 or older - Proceed")
                }
            },
            dismissButton = {
                TextButton(onClick = { onBack() }) {
                    Text("Exit", color = TextSecondaryDark)
                }
            },
            containerColor = MillizaiCardDark
        )
    }

    // Simulate natural live voice cycle
    LaunchedEffect(voiceState) {
        if (voiceState == "LISTENING" && !isMuted) {
            delay(4000)
            if (voiceState == "LISTENING") {
                // User spoke
                liveTranscription = when (voiceMode) {
                    VoiceMode.GENERAL -> "How does Millizai AI manage continuous on-device voice processing?"
                    VoiceMode.MENTAL_COMEDY -> "Hey, roast my coding skills!"
                    VoiceMode.MATURE_18 -> "How do you maintain emotional balance in a modern relationship?"
                    VoiceMode.PALMISTRY -> "What does my deep life line mean?"
                }
                voiceState = "THINKING"
                delay(1200)

                val reply = when (voiceMode) {
                    VoiceMode.GENERAL -> "Millizai AI uses hardware-accelerated speech recognition coupled with streaming token generation, allowing you to interrupt me instantly without touching a button."
                    VoiceMode.MENTAL_COMEDY -> "Your coding skills? Bro, your code has more bugs than a tropical rainforest! Even the compiler files a restraining order against your syntax!"
                    VoiceMode.MATURE_18 -> "In adult relationships, emotional balance isn't about hiding vulnerability; it's about mutual respect, authentic communication, and keeping the romance alive."
                    VoiceMode.PALMISTRY -> "A deep, clearly etched Life Line denotes remarkable vitality, resilience, and personal vigor throughout your life journey."
                }

                conversationLogs.add(
                    MessageEntity(
                        id = UUID.randomUUID().toString(),
                        conversationId = "voice-${voiceMode.id}",
                        role = "user",
                        content = liveTranscription,
                        timestamp = System.currentTimeMillis()
                    )
                )
                conversationLogs.add(
                    MessageEntity(
                        id = UUID.randomUUID().toString(),
                        conversationId = "voice-${voiceMode.id}",
                        role = "assistant",
                        content = reply,
                        timestamp = System.currentTimeMillis()
                    )
                )

                voiceState = "SPEAKING"
                delay(5000)
                voiceState = "LISTENING"
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MillizaiBlackBg)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Top Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = TextPrimaryDark)
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = voiceMode.title,
                    color = TextPrimaryDark,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${selectedVoice.name} (${selectedVoice.languageCode}) • ${speechSpeed}x Speed",
                    color = MillizaiCyan,
                    fontSize = 11.sp
                )
            }

            // Consent / Recording Status Badge
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(if (recordingConsentGranted) Color(0xFF065F46) else Color(0xFF1E293B))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = if (recordingConsentGranted) "REC ON" else "OFF",
                    color = Color.White,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Comedy Level Selector (Only in Mental Comedy mode)
        if (voiceMode == VoiceMode.MENTAL_COMEDY) {
            LazyRow(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(ComedyLevel.values()) { level ->
                    FilterChip(
                        selected = comedyLevel == level,
                        onClick = { comedyLevel = level },
                        label = { Text(level.title, fontSize = 11.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Color(0xFFF59E0B),
                            selectedLabelColor = Color.Black
                        )
                    )
                }
            }
            Spacer(modifier = Modifier.height(10.dp))
        }

        // Animated Voice Orb Section
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            contentAlignment = Alignment.Center
        ) {
            // Ambient Aura Halo
            Box(
                modifier = Modifier
                    .scale(pulseScale * 1.3f)
                    .size(180.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            colors = when (voiceMode) {
                                VoiceMode.GENERAL -> listOf(MillizaiPurple.copy(alpha = 0.4f), Color.Transparent)
                                VoiceMode.MENTAL_COMEDY -> listOf(Color(0xFFF59E0B).copy(alpha = 0.4f), Color.Transparent)
                                VoiceMode.MATURE_18 -> listOf(Color(0xFFEC4899).copy(alpha = 0.4f), Color.Transparent)
                                VoiceMode.PALMISTRY -> listOf(MillizaiCyan.copy(alpha = 0.4f), Color.Transparent)
                            }
                        )
                    )
            )

            // Dynamic Rotating Voice Orb
            Box(
                modifier = Modifier
                    .scale(pulseScale)
                    .size(140.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.sweepGradient(
                            colors = when (voiceMode) {
                                VoiceMode.GENERAL -> listOf(MillizaiPurple, MillizaiBlue, MillizaiCyan, MillizaiPurple)
                                VoiceMode.MENTAL_COMEDY -> listOf(Color(0xFFF59E0B), Color(0xFFEF4444), Color(0xFF8B5CF6), Color(0xFFF59E0B))
                                VoiceMode.MATURE_18 -> listOf(Color(0xFFEC4899), Color(0xFF8B5CF6), Color(0xFF6366F1), Color(0xFFEC4899))
                                VoiceMode.PALMISTRY -> listOf(MillizaiCyan, MillizaiPurple, Color(0xFF10B981), MillizaiCyan)
                            }
                        )
                    )
                    .border(2.dp, Color.White.copy(alpha = 0.6f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = when (voiceState) {
                            "SPEAKING" -> Icons.Default.RecordVoiceOver
                            "THINKING" -> Icons.Default.Speed
                            else -> Icons.Default.Hearing
                        },
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(38.dp)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = when (voiceState) {
                            "SPEAKING" -> "Speaking"
                            "THINKING" -> "Thinking..."
                            else -> if (isMuted) "Muted" else "Listening"
                        },
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Status & Barge-in Hint
        Text(
            text = if (voiceState == "SPEAKING") "Tap 'Interrupt' or just start speaking to interrupt AI" else "Hands-free continuous conversation active",
            color = if (voiceState == "SPEAKING") MillizaiCyan else TextSecondaryDark,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Mini Transcript Preview / Drawer
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .height(120.dp)
                .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(14.dp)),
            colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
            shape = RoundedCornerShape(14.dp)
        ) {
            Column(modifier = Modifier.padding(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Live Transcript", color = MillizaiCyan, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Row {
                        IconButton(onClick = {
                            val allText = conversationLogs.joinToString("\n\n") { "${it.role.uppercase()}: ${it.content}" }
                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                            clipboard.setPrimaryClip(ClipData.newPlainText("Transcript", allText))
                            Toast.makeText(context, "Transcript copied to clipboard!", Toast.LENGTH_SHORT).show()
                        }, modifier = Modifier.size(24.dp)) {
                            Icon(Icons.Default.ContentCopy, contentDescription = "Copy", tint = TextSecondaryDark, modifier = Modifier.size(14.dp))
                        }
                        IconButton(onClick = {
                            val allText = conversationLogs.joinToString("\n\n") { "${it.role.uppercase()}: ${it.content}" }
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_TEXT, allText)
                            }
                            context.startActivity(Intent.createChooser(shareIntent, "Share Voice Transcript"))
                        }, modifier = Modifier.size(24.dp)) {
                            Icon(Icons.Default.Share, contentDescription = "Share", tint = TextSecondaryDark, modifier = Modifier.size(14.dp))
                        }
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                LazyColumn(state = transcriptListState, modifier = Modifier.fillMaxSize()) {
                    items(conversationLogs) { msg ->
                        Text(
                            text = "${if (msg.role == "user") "You" else "Millizai"}: ${msg.content}",
                            color = if (msg.role == "user") MillizaiCyan else TextPrimaryDark,
                            fontSize = 11.sp,
                            lineHeight = 15.sp,
                            modifier = Modifier.padding(vertical = 2.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Call Control Bar (Mute, Barge-In Interruption, Speaker, End Call)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Mute / Unmute
            IconButton(
                onClick = { isMuted = !isMuted },
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .background(if (isMuted) Color(0xFFEF4444) else MillizaiCardDark)
                    .border(1.dp, MillizaiCardBorderDark, CircleShape)
            ) {
                Icon(
                    imageVector = if (isMuted) Icons.Default.MicOff else Icons.Default.Mic,
                    contentDescription = "Mute",
                    tint = Color.White
                )
            }

            // Interrupt (Barge-in button)
            Button(
                onClick = {
                    voiceState = "LISTENING"
                    Toast.makeText(context, "Interrupted AI speech.", Toast.LENGTH_SHORT).show()
                },
                shape = RoundedCornerShape(24.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MillizaiPurple),
                modifier = Modifier.height(50.dp)
            ) {
                Icon(Icons.Default.Stop, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Interrupt", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }

            // Speaker Toggle
            IconButton(
                onClick = { isSpeakerOn = !isSpeakerOn },
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .background(if (isSpeakerOn) MillizaiBlue else MillizaiCardDark)
                    .border(1.dp, MillizaiCardBorderDark, CircleShape)
            ) {
                Icon(
                    imageVector = if (isSpeakerOn) Icons.Default.VolumeUp else Icons.Default.VolumeDown,
                    contentDescription = "Speaker",
                    tint = Color.White
                )
            }

            // End Call Button
            IconButton(
                onClick = onBack,
                modifier = Modifier
                    .size(50.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFDC2626))
            ) {
                Icon(
                    imageVector = Icons.Default.CallEnd,
                    contentDescription = "End Call",
                    tint = Color.White
                )
            }
        }
    }
}
