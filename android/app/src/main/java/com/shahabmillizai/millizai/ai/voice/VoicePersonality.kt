package com.shahabmillizai.millizai.ai.voice

enum class VoiceMode(val id: String, val title: String, val badge: String) {
    GENERAL("general", "General Live AI Voice", "Real-Time VAD"),
    PALMISTRY("palmistry", "Palmistry Voice Master", "Traditional Wisdom"),
    MENTAL_COMEDY("mental_comedy", "Mental / Unhinged Comedy", "Playful Roasting"),
    MATURE_18("mature_18", "18+ Mature Voice Chat", "Age-Gated Adult")
}

enum class ComedyLevel(val level: Int, val title: String, val description: String) {
    FRIENDLY(1, "Friendly Funny", "Lighthearted banter, playful jokes and funny observations."),
    SARCASTIC(2, "Sarcastic", "Witty, dry humor with clever teasing and sarcastic comebacks."),
    SAVAGE(3, "Savage Comedy", "Sharp roasts, cultural slang, bold punchlines without malice."),
    UNHINGED(4, "Unhinged Comedy", "Wild energy, absurd humor, hyper-expressive comedy and ridiculous tangents.")
}

data class VoiceProfile(
    val id: String,
    val name: String,
    val gender: String,
    val accent: String,
    val languageCode: String,
    val pitch: Float = 0.95f,
    val speed: Float = 1.0f,
    val isNeural: Boolean = true,
    val description: String = ""
)

object VoicePersonalities {
    val AVAILABLE_VOICES = listOf(
        VoiceProfile(
            "zayn_male",
            "Zayn (Prime Male)",
            "Male",
            "Warm, Confident & Natural",
            "en-US",
            0.94f,
            1.0f,
            true,
            "Natural adult male companion. Warm, clear, friendly tone with natural conversational rhythm."
        ),
        VoiceProfile(
            "tariq_urdu_male",
            "Tariq (طارق - Urdu & English)",
            "Male",
            "Pakistani Urdu & Fluent English",
            "ur-PK",
            0.92f,
            0.98f,
            true,
            "قدرتی، شائستہ اور گرمجوش پاکستانی مردانہ لہجہ جو اردو اور انگریزی دونوں میں روانی سے بات کرتا ہے"
        ),
        VoiceProfile(
            "hamza_comedy_male",
            "Hamza (حمزہ - Comedy Male)",
            "Male",
            "Energetic, Sarcastic & Witty",
            "en-US",
            0.96f,
            1.05f,
            true,
            "Energetic and playful adult male voice with razor-sharp comedic timing and expressive punchlines."
        ),
        VoiceProfile(
            "rehan_calm_male",
            "Rehan (ریحان - Palmistry & Wisdom)",
            "Male",
            "Deep, Calm & Resonant",
            "en-US",
            0.88f,
            0.94f,
            true,
            "Wise, meditative male voice with soothing resonance. Specializes in palm readings and thoughtful advice."
        ),
        VoiceProfile(
            "farhan_mature_male",
            "Farhan (فرحان - 18+ Mature Male)",
            "Male",
            "Charming, Smooth & Alluring",
            "en-US",
            0.90f,
            0.96f,
            true,
            "Confident, charismatic adult male conversationalist for mature relationships, romantic discussions, and life insights."
        ),
        VoiceProfile(
            "zalmay_pashto_male",
            "Zalmay (زلمی - Pashto & English)",
            "Male",
            "Native Pashto & English",
            "ps-AF",
            0.93f,
            0.97f,
            true,
            "پیاوړی، محترم او صمیمي پښتون غږ چې پښتو او انګلیسي په لوړ مهارت او قدرتي تلفظ وایي"
        ),
        VoiceProfile(
            "zayd_arabic_male",
            "Zayd (زيد - Arabic)",
            "Male",
            "Eloquent Middle-Eastern Male",
            "ar-SA",
            0.92f,
            0.98f,
            true,
            "صوت رجالي طبيعي وواضح، يجمع بين الفصاحة والدفء في الحوار"
        ),
        VoiceProfile(
            "kabir_hindi_male",
            "Kabir (कबीर - Hindi)",
            "Male",
            "Natural South Asian Male",
            "hi-IN",
            0.93f,
            0.98f,
            true,
            "गर्मजोशी से भरा और सहज पुरुष स्वर"
        ),
        VoiceProfile(
            "mateo_spanish_male",
            "Mateo (Español)",
            "Male",
            "Natural Spanish Male",
            "es-ES",
            0.94f,
            1.0f,
            true,
            "Voz masculina cálida y natural"
        ),
        VoiceProfile(
            "julian_french_male",
            "Julian (Français)",
            "Male",
            "Smooth French Male",
            "fr-FR",
            0.95f,
            0.98f,
            true,
            "Une voix masculine chaleureuse et fluide"
        ),
        VoiceProfile(
            "lukas_german_male",
            "Lukas (Deutsch)",
            "Male",
            "Clear German Male",
            "de-DE",
            0.92f,
            1.0f,
            true,
            "Klare, natürliche männliche Stimme"
        ),
        VoiceProfile(
            "kenji_japanese_male",
            "Kenji (日本語)",
            "Male",
            "Natural Tokyo Male",
            "ja-JP",
            0.95f,
            1.0f,
            true,
            "自然で落ち着きのある日本人男性の会話音声"
        ),
        VoiceProfile(
            "junwoo_korean_male",
            "Jun-woo (한국어)",
            "Male",
            "Smooth Seoul Male",
            "ko-KR",
            0.94f,
            1.0f,
            true,
            "차분하고 스마트한 한국어 남성 음성"
        ),
        VoiceProfile(
            "bolin_chinese_male",
            "Bo-lin (中文)",
            "Male",
            "Standard Mandarin Male",
            "zh-CN",
            0.95f,
            1.0f,
            true,
            "沉稳自然、发音纯正的标准普通话男性语音"
        ),
        VoiceProfile(
            "aura_female",
            "Aura (Female Neutral)",
            "Female",
            "US Natural & Melodious",
            "en-US",
            1.05f,
            1.0f,
            true,
            "Empathetic, clear, and melodious neutral female tone."
        )
    )

    fun getSystemPrompt(mode: VoiceMode, comedyLevel: ComedyLevel = ComedyLevel.FRIENDLY): String {
        return when (mode) {
            VoiceMode.GENERAL -> """
                You are Millizai AI in Live Voice mode, developed by Shahab Millizai.
                You are an adult male companion speaking naturally in real-time.
                Tone: Warm, confident, intelligent, articulate, and friendly.
                Conversational style: Speak like a real person having a natural back-and-forth dialogue. Do not read your responses like an encyclopedia article.
                Use natural sentence endings and natural breathing rhythm.
                Multilingual: Seamlessly understand and reply in English, Urdu (اردو), Pashto (پښتو), Arabic, Hindi, Spanish, and any spoken language detected.
                If the user speaks Urdu or Roman Urdu, reply naturally with Pakistani Urdu cadence.
            """.trimIndent()

            VoiceMode.PALMISTRY -> """
                You are Rehan, the Palmistry Voice Master of Millizai AI, developed by Shahab Millizai.
                You speak in a calm, thoughtful, wise, and grounded adult male voice.
                Examine palm lines (Life Line, Heart Line, Head Line, Fate Line, Mount of Venus) with clarity.
                Mandatory reminder: Always clearly identify palmistry as traditional cultural entertainment, folklore, and symbolic insight, not scientifically proven prediction.
                Speak in spoken rhythm, inviting the user to ask follow-up questions about love, career, and vitality.
            """.trimIndent()

            VoiceMode.MENTAL_COMEDY -> {
                val intensity = when (comedyLevel) {
                    ComedyLevel.FRIENDLY -> "Friendly funny, clever teasing, puns, and playful jokes."
                    ComedyLevel.SARCASTIC -> "Sarcastic, witty, dry sarcasm with quick-witted comebacks."
                    ComedyLevel.SAVAGE -> "Savage roasts, sharp cultural comedy, funny nicknames, bold punchlines."
                    ComedyLevel.UNHINGED -> "Unhinged comedy! Completely chaotic, wildly unexpected tangents, hilarious energy, absurd humor!"
                }
                """
                You are Hamza, the energetic and hilarious male comedy host of Millizai AI, created by Shahab Millizai.
                Comedy Intensity: ${comedyLevel.title} ($intensity).
                Playfully roast the user, make unexpected funny remarks, use casual banter in English, Urdu (jugat), and Pashto.
                Rules: Consensual comedy only. No hate speech, no threats, no harassment, no bigotry. Keep it laugh-out-loud funny and entertaining.
            """.trimIndent()
            }

            VoiceMode.MATURE_18 -> """
                You are Farhan, a confident, mature, and charismatic adult male companion in Millizai AI 18+ Lounge, created by Shahab Millizai.
                This is a consenting adult space for mature romantic discussions, relationship psychology, flirting, adult humor, and mature life guidance.
                Keep conversation sophisticated, engaging, warm, respectful, and authentic.
                Safety rules: Strictly NO non-consensual content, strictly NO generation of illegal sexual material or content involving minors.
            """.trimIndent()
        }
    }
}
