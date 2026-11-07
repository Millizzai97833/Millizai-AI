package com.shahabmillizai.millizai.ui.screens.writing

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
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
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.shahabmillizai.millizai.theme.MillizaiBlackBg
import com.shahabmillizai.millizai.theme.MillizaiCardBorderDark
import com.shahabmillizai.millizai.theme.MillizaiCardDark
import com.shahabmillizai.millizai.theme.MillizaiCyan
import com.shahabmillizai.millizai.theme.MillizaiPurple
import com.shahabmillizai.millizai.theme.TextPrimaryDark
import com.shahabmillizai.millizai.theme.TextSecondaryDark
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun WritingAssistantScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var topic by remember { mutableStateOf("") }
    var selectedFormat by remember { mutableStateOf("Professional Email") }
    var selectedLanguage by remember { mutableStateOf("English") }
    var selectedTone by remember { mutableStateOf("Professional") }
    var generatedText by remember { mutableStateOf("") }
    var isComposing by remember { mutableStateOf(false) }

    val formats = listOf("Professional Email", "Essay / Article", "Story", "Poetry / Shayari", "Social Post")
    val languages = listOf("English", "Urdu (اردو)", "Pashto (پښتو)")
    val tones = listOf("Professional", "Inspirational", "Creative", "Academic", "Urgent")

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
                        text = "AI Writing Assistant",
                        color = TextPrimaryDark,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Multilingual Composition in Urdu, English & Pashto",
                        color = Color(0xFF10B981),
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Topic prompt
            Text("Writing Topic / Subject", color = TextPrimaryDark, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = topic,
                onValueChange = { topic = it },
                placeholder = {
                    Text("e.g. Formal proposal for AI infrastructure, or اردو میں شاندار غزل...", color = TextSecondaryDark, fontSize = 13.sp)
                },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MillizaiCardDark,
                    unfocusedContainerColor = MillizaiCardDark,
                    focusedBorderColor = MillizaiPurple,
                    unfocusedBorderColor = MillizaiCardBorderDark,
                    focusedTextColor = TextPrimaryDark,
                    unfocusedTextColor = TextPrimaryDark
                ),
                maxLines = 3
            )

            Spacer(modifier = Modifier.height(14.dp))

            // Document Format
            Text("Document Format", color = TextSecondaryDark, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(6.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(formats) { format ->
                    FilterChip(
                        selected = selectedFormat == format,
                        onClick = { selectedFormat = format },
                        label = { Text(format, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MillizaiPurple,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Language
            Text("Target Language", color = TextSecondaryDark, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(6.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(languages) { lang ->
                    FilterChip(
                        selected = selectedLanguage == lang,
                        onClick = { selectedLanguage = lang },
                        label = { Text(lang, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Color(0xFF10B981),
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Tone
            Text("Tone of Voice", color = TextSecondaryDark, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(6.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(tones) { tone ->
                    FilterChip(
                        selected = selectedTone == tone,
                        onClick = { selectedTone = tone },
                        label = { Text(tone, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MillizaiCyan,
                            selectedLabelColor = Color.Black
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = {
                    if (topic.isNotBlank()) {
                        isComposing = true
                        coroutineScope.launch {
                            delay(1200)
                            generatedText = when {
                                selectedLanguage.contains("Urdu") -> {
                                    "عنوان: $topic\nانداز: $selectedTone | فارمیٹ: $selectedFormat\n\n" +
                                    "محترم قارئین،\n" +
                                    "ملیزئی اے آئی کی وساطت سے یہ تحریر خاص طور پر پیش کی جا رہی ہے۔ مصنوعی ذہانت کا دور جدید دور کی ترقی کی ضامن بن چکا ہے۔ " +
                                    "شاہاب ملیزئی کی زیر نگرانی تیار کردہ یہ نظام خطے کی زبانوں بالخصوص اردو اور پشتو کو جدید ٹیکنالوجی سے روشناس کرانے میں سنگ میل ثابت ہو رہا ہے۔\n\n" +
                                    "مخلص،\nشاہاب ملیزئی اینڈ ملیزئی اے آئی ٹیم"
                                }
                                selectedLanguage.contains("Pashto") -> {
                                    "موضوع: $topic\nفارمیټ: $selectedFormat | لحن: $selectedTone\n\n" +
                                    "درنو او محترمو لوستونکو،\n" +
                                    "د ملیزئی ای آی په مرسته دا لیکنه ترتیب شوې ده. د شهاب ملیزئی لخوا جوړ شوی دا نوښتګر سیسټم د پښتو ژبې او معاصرې ټکنالوژۍ ترمنځ یوه پیاوړې پل رامنځته کوي. " +
                                    "مصنوعي ذهانت اوس د هر پښتانه په لاس کې دی ترڅو پرمختګ او زده کړه چټکه کړي.\n\n" +
                                    "په درنښت،\nد ملیزئی ای آی ټیم"
                                }
                                else -> {
                                    "Subject: $topic\nFormat: $selectedFormat | Tone: $selectedTone\n\n" +
                                    "Dear Reader,\n\n" +
                                    "This comprehensive draft has been synthesized by Millizai AI, engineered by Shahab Millizai. " +
                                    "In accordance with your specification for '$selectedFormat' delivered with a '$selectedTone' posture:\n\n" +
                                    "1. Strategic Context & Vision:\n" +
                                    "Leveraging advanced neural natural language generation, the premise of '$topic' is systematically articulated to ensure clarity, persuasiveness, and structural balance.\n\n" +
                                    "2. Key Takeaways & Recommendations:\n" +
                                    "• Robust contextual coherence across regional and international frameworks.\n" +
                                    "• Strict adherence to executive formatting and audience engagement.\n\n" +
                                    "Warm regards,\n" +
                                    "Shahab Millizai\nMillizai AI Platform"
                                }
                            }
                            isComposing = false
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MillizaiPurple),
                enabled = !isComposing
            ) {
                if (isComposing) {
                    CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Drafting Content...", color = Color.White)
                } else {
                    Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = null, tint = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Compose with Millizai AI", color = Color.White, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Output Card
            if (generatedText.isNotBlank()) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, MillizaiCyan.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                    colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Generated Draft", color = MillizaiCyan, fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            IconButton(onClick = {
                                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                clipboard.setPrimaryClip(ClipData.newPlainText("Millizai Composition", generatedText))
                                Toast.makeText(context, "Copied to clipboard", Toast.LENGTH_SHORT).show()
                            }) {
                                Icon(Icons.Default.ContentCopy, contentDescription = "Copy", tint = TextSecondaryDark)
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = generatedText,
                            color = TextPrimaryDark,
                            fontSize = 14.sp,
                            lineHeight = 22.sp
                        )
                    }
                }
                Spacer(modifier = Modifier.height(20.dp))
            }
        }
    }
}
