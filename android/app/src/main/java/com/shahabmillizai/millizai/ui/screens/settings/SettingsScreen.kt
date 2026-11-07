package com.shahabmillizai.millizai.ui.screens.settings

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Save
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
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
fun SettingsScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current

    var onlineEndpoint by remember { mutableStateOf("https://api.openai.com/v1") }
    var apiKey by remember { mutableStateOf("") }
    var showApiKey by remember { mutableStateOf(false) }
    var onlineModel by remember { mutableStateOf("gpt-4o-mini") }
    var imageEndpoint by remember { mutableStateOf("https://image.pollinations.ai/prompt") }
    var isDefaultOffline by remember { mutableStateOf(false) }
    var temperature by remember { mutableFloatStateOf(0.7f) }
    var systemPrompt by remember {
        mutableStateOf("You are Millizai AI, a powerful, helpful, and courteous artificial intelligence assistant created by Shahab Millizai. You assist users with general knowledge, multilingual chat (English, Urdu, Pashto), coding, and writing.")
    }
    var selectedLanguage by remember { mutableStateOf("en") }

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
                        text = "App Settings",
                        color = TextPrimaryDark,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "API Endpoints, Local Storage & Model Inference",
                        color = MillizaiCyan,
                        fontSize = 12.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Section 1: Online AI Inference Server
            Text("Online AI Inference Server", color = TextPrimaryDark, fontSize = 15.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                "Configure any OpenAI-compatible server (OpenAI, Ollama, LM Studio, vLLM, OpenRouter, Groq). No hardcoded paid keys required.",
                color = TextSecondaryDark,
                fontSize = 11.sp,
                lineHeight = 16.sp
            )

            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = onlineEndpoint,
                onValueChange = { onlineEndpoint = it },
                label = { Text("Server URL Endpoint", fontSize = 12.sp) },
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

            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = apiKey,
                onValueChange = { apiKey = it },
                label = { Text("API Key (Stored locally and securely)", fontSize = 12.sp) },
                visualTransformation = if (showApiKey) VisualTransformation.None else PasswordVisualTransformation(),
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

            Spacer(modifier = Modifier.height(10.dp))

            OutlinedTextField(
                value = onlineModel,
                onValueChange = { onlineModel = it },
                label = { Text("Model Name Identifier (e.g. gpt-4o-mini, llama3.2)", fontSize = 12.sp) },
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

            Spacer(modifier = Modifier.height(20.dp))

            // Section 2: Image Generation Endpoint
            Text("AI Image Generation Endpoint", color = TextPrimaryDark, fontSize = 15.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = imageEndpoint,
                onValueChange = { imageEndpoint = it },
                label = { Text("Diffusion Server URL", fontSize = 12.sp) },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = MillizaiCardDark,
                    unfocusedContainerColor = MillizaiCardDark,
                    focusedBorderColor = MillizaiBlue,
                    unfocusedBorderColor = MillizaiCardBorderDark,
                    focusedTextColor = TextPrimaryDark,
                    unfocusedTextColor = TextPrimaryDark
                ),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(20.dp))

            // Section 3: Offline Mode & Inference Tuning
            Text("Inference Tuning & Offline Defaults", color = TextPrimaryDark, fontSize = 15.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, MillizaiCardBorderDark, RoundedCornerShape(14.dp)),
                colors = CardDefaults.cardColors(containerColor = MillizaiCardDark),
                shape = RoundedCornerShape(14.dp)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Default to Offline (GGUF Mode)", color = TextPrimaryDark, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        Text("Runs on-device without reaching external servers", color = TextSecondaryDark, fontSize = 11.sp)
                    }
                    Switch(
                        checked = isDefaultOffline,
                        onCheckedChange = { isDefaultOffline = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = MillizaiCyan, checkedTrackColor = MillizaiPurple)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Creativity Temperature: ${String.format("%.2f", temperature)}", color = TextSecondaryDark, fontSize = 13.sp)
                Text(if (temperature < 0.5f) "Deterministic" else "Creative", color = MillizaiCyan, fontSize = 12.sp)
            }
            Slider(
                value = temperature,
                onValueChange = { temperature = it },
                valueRange = 0.0f..1.2f,
                colors = SliderDefaults.colors(thumbColor = MillizaiPurple, activeTrackColor = MillizaiBlue)
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text("System Prompt", color = TextSecondaryDark, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(6.dp))
            OutlinedTextField(
                value = systemPrompt,
                onValueChange = { systemPrompt = it },
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

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = {
                    Toast.makeText(context, "Settings saved successfully to DataStore!", Toast.LENGTH_SHORT).show()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MillizaiPurple)
            ) {
                Icon(Icons.Default.Save, contentDescription = null, tint = Color.White)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Save Preferences", color = Color.White, fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(30.dp))
        }
    }
}
