package com.shahabmillizai.millizai.navigation

sealed class Screen(val route: String, val title: String) {
    data object Splash : Screen("splash", "Millizai AI")
    data object Home : Screen("home", "Home")
    data object Chat : Screen("chat?conversationId={conversationId}", "AI Chat") {
        fun createRoute(conversationId: String? = null) = if (conversationId != null) "chat?conversationId=$conversationId" else "chat"
    }
    data object ImageGenerator : Screen("image_generator", "AI Image Generator")
    data object WritingAssistant : Screen("writing_assistant", "AI Writer")
    data object CodingAssistant : Screen("coding_assistant", "AI Coder")
    data object ModelLibrary : Screen("model_library", "Model Library")
    data object ModelDownloads : Screen("model_downloads", "Model Downloads")
    data object ChatHistory : Screen("chat_history", "Chat History")
    data object Settings : Screen("settings", "Settings")
    data object AboutDeveloper : Screen("about_developer", "About Developer")

    // Video Studio & Live Voice System screens
    data object VideoStudio : Screen("video_studio", "AI Video Studio")
    data object LiveVoice : Screen("live_voice?mode={mode}", "Live Voice Chat") {
        fun createRoute(mode: String = "general") = "live_voice?mode=$mode"
    }
    data object PalmistryVoiceMaster : Screen("palmistry_voice_master", "Palmistry Voice Master")
    data object MentalComedyVoice : Screen("mental_comedy_voice", "Mental Comedy Voice")
    data object Mature18Voice : Screen("mature_18_voice", "18+ Mature Voice")
    data object VoiceRecordings : Screen("voice_recordings", "Voice Recordings & Exports")
}
