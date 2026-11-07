package com.shahabmillizai.millizai.data.local.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "millizai_preferences")

class UserPreferencesRepository(private val context: Context) {

    private object PreferencesKeys {
        val IS_OFFLINE_MODE = booleanPreferencesKey("is_offline_mode")
        val ONLINE_ENDPOINT = stringPreferencesKey("online_api_endpoint")
        val ONLINE_API_KEY = stringPreferencesKey("online_api_key")
        val ONLINE_MODEL = stringPreferencesKey("online_model_name")
        val SELECTED_LANGUAGE = stringPreferencesKey("selected_language")
        val TEMPERATURE = floatPreferencesKey("ai_temperature")
        val SYSTEM_PROMPT = stringPreferencesKey("system_prompt")
        val THEME_MODE = stringPreferencesKey("theme_mode")
        val IMAGE_API_ENDPOINT = stringPreferencesKey("image_api_endpoint")
    }

    val isOfflineMode: Flow<Boolean> = context.dataStore.data.map {
        it[PreferencesKeys.IS_OFFLINE_MODE] ?: false
    }

    val onlineEndpoint: Flow<String> = context.dataStore.data.map {
        it[PreferencesKeys.ONLINE_ENDPOINT] ?: "https://api.openai.com/v1"
    }

    val onlineApiKey: Flow<String> = context.dataStore.data.map {
        it[PreferencesKeys.ONLINE_API_KEY] ?: ""
    }

    val onlineModel: Flow<String> = context.dataStore.data.map {
        it[PreferencesKeys.ONLINE_MODEL] ?: "gpt-4o-mini"
    }

    val selectedLanguage: Flow<String> = context.dataStore.data.map {
        it[PreferencesKeys.SELECTED_LANGUAGE] ?: "en"
    }

    val temperature: Flow<Float> = context.dataStore.data.map {
        it[PreferencesKeys.TEMPERATURE] ?: 0.7f
    }

    val systemPrompt: Flow<String> = context.dataStore.data.map {
        it[PreferencesKeys.SYSTEM_PROMPT] ?: "You are Millizai AI, a powerful, helpful, and courteous artificial intelligence assistant created by Shahab Millizai. You assist users with general knowledge, multilingual chat (English, Urdu, Pashto), coding, and writing."
    }

    val themeMode: Flow<String> = context.dataStore.data.map {
        it[PreferencesKeys.THEME_MODE] ?: "dark"
    }

    val imageApiEndpoint: Flow<String> = context.dataStore.data.map {
        it[PreferencesKeys.IMAGE_API_ENDPOINT] ?: "https://image.pollinations.ai/prompt"
    }

    suspend fun setOfflineMode(enabled: Boolean) {
        context.dataStore.edit { it[PreferencesKeys.IS_OFFLINE_MODE] = enabled }
    }

    suspend fun setOnlineEndpoint(endpoint: String) {
        context.dataStore.edit { it[PreferencesKeys.ONLINE_ENDPOINT] = endpoint.trim().trimEnd('/') }
    }

    suspend fun setOnlineApiKey(key: String) {
        context.dataStore.edit { it[PreferencesKeys.ONLINE_API_KEY] = key.trim() }
    }

    suspend fun setOnlineModel(model: String) {
        context.dataStore.edit { it[PreferencesKeys.ONLINE_MODEL] = model.trim() }
    }

    suspend fun setSelectedLanguage(lang: String) {
        context.dataStore.edit { it[PreferencesKeys.SELECTED_LANGUAGE] = lang }
    }

    suspend fun setTemperature(temp: Float) {
        context.dataStore.edit { it[PreferencesKeys.TEMPERATURE] = temp }
    }

    suspend fun setSystemPrompt(prompt: String) {
        context.dataStore.edit { it[PreferencesKeys.SYSTEM_PROMPT] = prompt }
    }

    suspend fun setThemeMode(theme: String) {
        context.dataStore.edit { it[PreferencesKeys.THEME_MODE] = theme }
    }

    suspend fun setImageApiEndpoint(endpoint: String) {
        context.dataStore.edit { it[PreferencesKeys.IMAGE_API_ENDPOINT] = endpoint }
    }
}
