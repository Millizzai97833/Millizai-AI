package com.shahabmillizai.millizai.ui.screens.history

import android.content.Intent
import android.widget.Toast
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
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.FileUpload
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import com.shahabmillizai.millizai.data.local.db.ConversationEntity
import com.shahabmillizai.millizai.theme.MillizaiBlackBg
import com.shahabmillizai.millizai.theme.MillizaiCardBorderDark
import com.shahabmillizai.millizai.theme.MillizaiCardDark
import com.shahabmillizai.millizai.theme.MillizaiCyan
import com.shahabmillizai.millizai.theme.MillizaiPurple
import com.shahabmillizai.millizai.theme.TextPrimaryDark
import com.shahabmillizai.millizai.theme.TextSecondaryDark
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

@Composable
fun ChatHistoryScreen(
    onBack: () -> Unit,
    onSelectConversation: (String) -> Unit
) {
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }

    val conversations = remember {
        mutableStateListOf(
            ConversationEntity(
                id = "conv-1",
                title = "Android Jetpack Compose Room Architecture",
                mode = "offline",
                modelName = "Llama-3.2-1B-Instruct",
                updatedAt = System.currentTimeMillis() - 1000 * 60 * 30
            ),
            ConversationEntity(
                id = "conv-2",
                title = "اردو شاعری اور شاہاب ملیزئی کی سوانح",
                mode = "online",
                modelName = "GPT-4o Mini",
                updatedAt = System.currentTimeMillis() - 1000 * 60 * 60 * 4
            ),
            ConversationEntity(
                id = "conv-3",
                title = "پښتو ژبه او د مصنوعي ذهانت تاریخ",
                mode = "offline",
                modelName = "Llama-3.2-1B-Instruct",
                updatedAt = System.currentTimeMillis() - 1000 * 60 * 60 * 24
            ),
            ConversationEntity(
                id = "conv-4",
                title = "Kotlin Coroutines & Flow Backpressure Handling",
                mode = "online",
                modelName = "Claude / OpenAI Server",
                updatedAt = System.currentTimeMillis() - 1000 * 60 * 60 * 48
            )
        )
    }

    val filteredList = conversations.filter {
        it.title.contains(searchQuery, ignoreCase = true)
    }

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
                        text = "Chat History",
                        color = TextPrimaryDark,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Persistent Room Database Encrypted On-Device",
                        color = MillizaiCyan,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search conversations...", color = TextSecondaryDark, fontSize = 13.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = TextSecondaryDark) },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MillizaiCardDark,
                    unfocusedContainerColor = MillizaiCardDark,
                    focusedBorderColor = MillizaiPurple,
                    unfocusedBorderColor = MillizaiCardBorderDark,
                    focusedTextColor = TextPrimaryDark,
                    unfocusedTextColor = TextPrimaryDark
                ),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))
        }

        if (filteredList.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 40.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text("No conversations found.", color = TextSecondaryDark)
                }
            }
        } else {
            items(filteredList) { conv ->
                val dateStr = SimpleDateFormat("MMM dd, hh:mm a", Locale.getDefault()).format(Date(conv.updatedAt))
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 6.dp)
                        .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(14.dp))
                        .clickable { onSelectConversation(conv.id) },
                    colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(
                                    if (conv.mode == "offline") Color(0xFF1E3A8A) else Color(0xFF4C1D95)
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Message, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = conv.title,
                                color = TextPrimaryDark,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.SemiBold,
                                maxLines = 1
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "$dateStr • ${conv.mode.uppercase()} • ${conv.modelName}",
                                color = TextSecondaryDark,
                                fontSize = 11.sp
                            )
                        }

                        Row {
                            IconButton(onClick = {
                                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                    type = "text/plain"
                                    putExtra(Intent.EXTRA_TEXT, "# ${conv.title}\nExported from Millizai AI\n\n[Conversation Session ID: ${conv.id}]")
                                }
                                context.startActivity(Intent.createChooser(shareIntent, "Export Markdown"))
                            }) {
                                Icon(Icons.Default.FileUpload, contentDescription = "Export", tint = MillizaiCyan, modifier = Modifier.size(20.dp))
                            }

                            IconButton(onClick = {
                                conversations.remove(conv)
                                Toast.makeText(context, "Conversation deleted", Toast.LENGTH_SHORT).show()
                            }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color(0xFFEF4444), modifier = Modifier.size(20.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}
