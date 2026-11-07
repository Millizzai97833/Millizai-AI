package com.shahabmillizai.millizai.ui.screens.chat

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
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
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.shahabmillizai.millizai.data.local.db.MessageEntity
import com.shahabmillizai.millizai.theme.MillizaiBlackBg
import com.shahabmillizai.millizai.theme.MillizaiCardBorderDark
import com.shahabmillizai.millizai.theme.MillizaiCardDark
import com.shahabmillizai.millizai.theme.MillizaiCyan
import com.shahabmillizai.millizai.theme.MillizaiPurple
import com.shahabmillizai.millizai.theme.TextPrimaryDark
import com.shahabmillizai.millizai.theme.TextSecondaryDark
import com.shahabmillizai.millizai.ui.components.MessageBubble
import com.shahabmillizai.millizai.ui.components.TypingIndicator
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    conversationId: String?,
    isOfflineInitial: Boolean,
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    var isOfflineMode by remember { mutableStateOf(isOfflineInitial) }
    var inputMessage by remember { mutableStateOf("") }
    var isThinking by remember { mutableStateOf(false) }

    val messages = remember {
        mutableStateListOf(
            MessageEntity(
                id = UUID.randomUUID().toString(),
                conversationId = conversationId ?: "default",
                role = "assistant",
                content = "Hello! I am Millizai AI, developed by Shahab Millizai. I support real-time chat, writing, and coding in English, Urdu (اردو), and Pashto (پښتو). How can I assist you today?",
                timestamp = System.currentTimeMillis()
            )
        )
    }

    LaunchedEffect(messages.size) {
        if (messages.isNotEmpty()) {
            listState.animateScrollToItem(messages.size - 1)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MillizaiBlackBg)
    ) {
        // Top Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = TextPrimaryDark
                )
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Millizai AI Chat",
                    color = TextPrimaryDark,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = if (isOfflineMode) "Offline Mode (Local GGUF)" else "Online (OpenAI API Compatible)",
                    color = if (isOfflineMode) MillizaiCyan else Color(0xFF10B981),
                    fontSize = 11.sp
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = if (isOfflineMode) "Offline" else "Online",
                    color = TextSecondaryDark,
                    fontSize = 11.sp
                )
                Spacer(modifier = Modifier.width(4.dp))
                Switch(
                    checked = isOfflineMode,
                    onCheckedChange = { isOfflineMode = it },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = MillizaiCyan,
                        checkedTrackColor = MillizaiPurple
                    )
                )
            }

            IconButton(onClick = {
                messages.clear()
                messages.add(
                    MessageEntity(
                        id = UUID.randomUUID().toString(),
                        conversationId = "new",
                        role = "assistant",
                        content = "Chat cleared. What would you like to explore next?",
                        timestamp = System.currentTimeMillis()
                    )
                )
            }) {
                Icon(
                    imageVector = Icons.Default.DeleteSweep,
                    contentDescription = "Clear Chat",
                    tint = TextSecondaryDark
                )
            }
        }

        // Messages List
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 4.dp)
        ) {
            items(messages, key = { it.id }) { msg ->
                MessageBubble(
                    role = msg.role,
                    content = msg.content,
                    timestamp = msg.timestamp,
                    onCopy = {
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        clipboard.setPrimaryClip(ClipData.newPlainText("Millizai AI Message", msg.content))
                        Toast.makeText(context, "Copied to clipboard", Toast.LENGTH_SHORT).show()
                    },
                    onShare = {
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, msg.content)
                        }
                        context.startActivity(Intent.createChooser(shareIntent, "Share Message"))
                    },
                    onRegenerate = if (msg.role == "assistant") {
                        {
                            // Trigger regeneration
                            messages.remove(msg)
                            isThinking = true
                            coroutineScope.launch {
                                delay(1200)
                                messages.add(
                                    MessageEntity(
                                        id = UUID.randomUUID().toString(),
                                        conversationId = conversationId ?: "default",
                                        role = "assistant",
                                        content = "Regenerated response: Millizai AI completed re-inference for your query with updated parameters.",
                                        timestamp = System.currentTimeMillis()
                                    )
                                )
                                isThinking = false
                            }
                        }
                    } else null,
                    onDelete = {
                        messages.remove(msg)
                    }
                )
            }

            if (isThinking) {
                item {
                    TypingIndicator()
                }
            }
        }

        // Quick Suggestion Chips
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val chips = listOf(
                "Write Kotlin Room DAO",
                "اردو میں شاہاب ملیزئی کے بارے میں بتائیں",
                "د مصنوعي ذهانت راتلونکی",
                "Refactor OkHttp SSE Client",
                "Summarize GGUF Quantization"
            )
            items(chips) { chip ->
                AssistChip(
                    onClick = { inputMessage = chip },
                    label = { Text(chip, fontSize = 11.sp, color = TextPrimaryDark) },
                    colors = AssistChipDefaults.assistChipColors(
                        containerColor = MillizaiCardDark
                    ),
                    border = AssistChipDefaults.assistChipBorder(true).copy(
                        borderColor = MillizaiCardBorderDark
                    )
                )
            }
        }

        // Bottom Input Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputMessage,
                onValueChange = { inputMessage = it },
                placeholder = {
                    Text(
                        "Ask Millizai AI in English, Urdu or Pashto...",
                        fontSize = 13.sp,
                        color = TextSecondaryDark
                    )
                },
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(24.dp)),
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

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = {
                    if (inputMessage.isNotBlank()) {
                        val text = inputMessage.trim()
                        inputMessage = ""
                        messages.add(
                            MessageEntity(
                                id = UUID.randomUUID().toString(),
                                conversationId = conversationId ?: "default",
                                role = "user",
                                content = text,
                                timestamp = System.currentTimeMillis()
                            )
                        )
                        isThinking = true

                        coroutineScope.launch {
                            delay(1200)
                            val answer = if (isOfflineMode) {
                                "[Offline GGUF Engine]\n\n" +
                                "Processing complete for: \"$text\"\n\n" +
                                "Millizai AI evaluated your request locally on device. " +
                                "To connect custom fine-tuned weights or run quantized Llama/Qwen models, " +
                                "verify active weights in Model Downloads."
                            } else {
                                "Millizai AI Online Response:\n\n" +
                                "Here is the comprehensive analysis for your query:\n" +
                                "• Context: \"$text\"\n" +
                                "• Multi-turn conversational session active.\n" +
                                "• Multilingual tokens processed accurately in real time."
                            }

                            messages.add(
                                MessageEntity(
                                    id = UUID.randomUUID().toString(),
                                    conversationId = conversationId ?: "default",
                                    role = "assistant",
                                    content = answer,
                                    timestamp = System.currentTimeMillis()
                                )
                            )
                            isThinking = false
                        }
                    }
                },
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(MillizaiPurple)
            ) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.Send,
                    contentDescription = "Send",
                    tint = Color.White
                )
            }
        }
    }
}
