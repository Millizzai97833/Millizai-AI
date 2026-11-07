package com.shahabmillizai.millizai.ui.screens.coding

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
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.PlayArrow
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
import androidx.compose.ui.text.font.FontFamily
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
fun CodingAssistantScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    var codePrompt by remember { mutableStateOf("Write a Kotlin Jetpack Compose Coroutine StateFlow observer with error boundary") }
    var selectedLanguage by remember { mutableStateOf("Kotlin") }
    var selectedTask by remember { mutableStateOf("Write New Code") }
    var generatedCode by remember { mutableStateOf("") }
    var isCompiling by remember { mutableStateOf(false) }

    val languages = listOf("Kotlin", "Python", "TypeScript", "C++", "Java", "SQL", "Bash")
    val tasks = listOf("Write New Code", "Debug & Fix", "Refactor Clean Code", "Explain Logic")

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
                        text = "AI Coding Assistant",
                        color = TextPrimaryDark,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Syntax Engine & Android Architecture Specialist",
                        color = Color(0xFFF59E0B),
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Task Type
            Text("Coding Task", color = TextSecondaryDark, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(6.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(tasks) { task ->
                    FilterChip(
                        selected = selectedTask == task,
                        onClick = { selectedTask = task },
                        label = { Text(task, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Color(0xFFF59E0B),
                            selectedLabelColor = Color.Black
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Programming Language
            Text("Target Language", color = TextSecondaryDark, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(6.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(languages) { lang ->
                    FilterChip(
                        selected = selectedLanguage == lang,
                        onClick = { selectedLanguage = lang },
                        label = { Text(lang, fontSize = 12.sp) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MillizaiPurple,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Code Prompt / Snippet
            Text("Prompt or Code Snippet", color = TextPrimaryDark, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = codePrompt,
                onValueChange = { codePrompt = it },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MillizaiCardDark,
                    unfocusedContainerColor = MillizaiCardDark,
                    focusedBorderColor = MillizaiPurple,
                    unfocusedBorderColor = MillizaiCardBorderDark,
                    focusedTextColor = TextPrimaryDark,
                    unfocusedTextColor = TextPrimaryDark
                ),
                maxLines = 6
            )

            Spacer(modifier = Modifier.height(18.dp))

            Button(
                onClick = {
                    if (codePrompt.isNotBlank()) {
                        isCompiling = true
                        coroutineScope.launch {
                            delay(1100)
                            generatedCode = when (selectedLanguage) {
                                "Kotlin" -> """
// Synthesized by Millizai AI for Android
package com.shahabmillizai.millizai.demo

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.catch
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

sealed class UiState<out T> {
    object Idle : UiState<Nothing>()
    object Loading : UiState<Nothing>()
    data class Success<T>(val data: T) : UiState<T>()
    data class Error(val message: String) : UiState<Nothing>()
}

class MillizaiViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<UiState<String>>(UiState.Idle)
    val uiState = _uiState.asStateFlow()

    fun executeTask() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                // Execute native Millizai AI logic
                _uiState.value = UiState.Success("Task evaluated successfully.")
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.localizedMessage ?: "Unknown failure")
            }
        }
    }
}
                                """.trimIndent()

                                "Python" -> """
# Millizai AI Python Automation Script
import requests
import json

def query_millizai_inference(prompt: str, endpoint: str = "http://localhost:11434/v1"):
    payload = {
        "model": "llama3.2:1b",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }
    headers = {"Content-Type": "application/json"}
    response = requests.post(f"{endpoint}/chat/completions", json=payload, headers=headers)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]

if __name__ == "__main__":
    result = query_millizai_inference("Hello Millizai AI!")
    print(f"Output: {result}")
                                """.trimIndent()

                                else -> """
// Generated by Millizai AI Code Engine
// Language: $selectedLanguage | Task: $selectedTask
function runMillizaiEngine(input) {
  console.log("Analyzing tokens for: " + input);
  return {
    status: 200,
    timestamp: Date.now(),
    developer: "Shahab Millizai",
    verified: true
  };
}
                                """.trimIndent()
                            }
                            isCompiling = false
                        }
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF59E0B)),
                enabled = !isCompiling
            ) {
                if (isCompiling) {
                    CircularProgressIndicator(color = Color.Black, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Synthesizing Code...", color = Color.Black, fontWeight = FontWeight.Bold)
                } else {
                    Icon(imageVector = Icons.Default.PlayArrow, contentDescription = null, tint = Color.Black)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Generate Code Solution", color = Color.Black, fontWeight = FontWeight.Bold)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Code Output Card
            if (generatedCode.isNotBlank()) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, Color(0xFFF59E0B).copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF0D1117)),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("$selectedLanguage Output", color = Color(0xFFF59E0B), fontSize = 13.sp, fontWeight = FontWeight.Bold)
                            IconButton(onClick = {
                                val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                clipboard.setPrimaryClip(ClipData.newPlainText("Millizai Code", generatedCode))
                                Toast.makeText(context, "Code copied to clipboard", Toast.LENGTH_SHORT).show()
                            }) {
                                Icon(Icons.Default.ContentCopy, contentDescription = "Copy Code", tint = TextSecondaryDark)
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color(0xFF030712))
                                .padding(12.dp)
                        ) {
                            Text(
                                text = generatedCode,
                                color = Color(0xFFE2E8F0),
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                lineHeight = 18.sp
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
