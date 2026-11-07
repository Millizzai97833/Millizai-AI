package com.shahabmillizai.millizai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.shahabmillizai.millizai.navigation.Screen
import com.shahabmillizai.millizai.theme.MillizaiBlackBg
import com.shahabmillizai.millizai.theme.MillizaiTheme
import com.shahabmillizai.millizai.ai.voice.VoiceMode
import com.shahabmillizai.millizai.ui.screens.about.AboutDeveloperScreen
import com.shahabmillizai.millizai.ui.screens.chat.ChatScreen
import com.shahabmillizai.millizai.ui.screens.coding.CodingAssistantScreen
import com.shahabmillizai.millizai.ui.screens.downloads.ModelDownloadsScreen
import com.shahabmillizai.millizai.ui.screens.history.ChatHistoryScreen
import com.shahabmillizai.millizai.ui.screens.home.HomeScreen
import com.shahabmillizai.millizai.ui.screens.image.ImageGeneratorScreen
import com.shahabmillizai.millizai.ui.screens.models.ModelLibraryScreen
import com.shahabmillizai.millizai.ui.screens.palmistry.PalmistryVoiceScreen
import com.shahabmillizai.millizai.ui.screens.settings.SettingsScreen
import com.shahabmillizai.millizai.ui.screens.splash.SplashScreen
import com.shahabmillizai.millizai.ui.screens.video.VideoStudioScreen
import com.shahabmillizai.millizai.ui.screens.voice.LiveVoiceScreen
import com.shahabmillizai.millizai.ui.screens.writing.WritingAssistantScreen

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MillizaiTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MillizaiBlackBg
                ) {
                    MillizaiAppNavigation()
                }
            }
        }
    }
}

@Composable
fun MillizaiAppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route
    ) {
        composable(Screen.Splash.route) {
            SplashScreen(
                onNavigateToHome = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Home.route) {
            HomeScreen(
                isOffline = false,
                currentModelName = "Llama-3.2-1B-Instruct",
                onNavigateToChat = { navController.navigate(Screen.Chat.createRoute()) },
                onNavigateToImage = { navController.navigate(Screen.ImageGenerator.route) },
                onNavigateToWriting = { navController.navigate(Screen.WritingAssistant.route) },
                onNavigateToCoding = { navController.navigate(Screen.CodingAssistant.route) },
                onNavigateToVoiceGeneral = { navController.navigate(Screen.LiveVoice.createRoute("general")) },
                onNavigateToPalmistryVoice = { navController.navigate(Screen.PalmistryVoiceMaster.route) },
                onNavigateToMentalComedy = { navController.navigate(Screen.LiveVoice.createRoute("mental_comedy")) },
                onNavigateToMature18 = { navController.navigate(Screen.LiveVoice.createRoute("mature_18")) },
                onNavigateToLibrary = { navController.navigate(Screen.ModelLibrary.route) },
                onNavigateToDownloads = { navController.navigate(Screen.ModelDownloads.route) },
                onNavigateToHistory = { navController.navigate(Screen.ChatHistory.route) },
                onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
                onNavigateToAbout = { navController.navigate(Screen.AboutDeveloper.route) },
                onNavigateToVideo = { navController.navigate(Screen.VideoStudio.route) }
            )
        }

        composable(
            route = Screen.Chat.route,
            arguments = listOf(
                navArgument("conversationId") {
                    type = NavType.StringType
                    nullable = true
                    defaultValue = null
                }
            )
        ) { backStackEntry ->
            val conversationId = backStackEntry.arguments?.getString("conversationId")
            ChatScreen(
                conversationId = conversationId,
                isOfflineInitial = false,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.ImageGenerator.route) {
            ImageGeneratorScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.WritingAssistant.route) {
            WritingAssistantScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.CodingAssistant.route) {
            CodingAssistantScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.ModelLibrary.route) {
            ModelLibraryScreen(
                onBack = { navController.popBackStack() },
                onDownloadSelected = {
                    navController.navigate(Screen.ModelDownloads.route)
                }
            )
        }

        composable(Screen.ModelDownloads.route) {
            ModelDownloadsScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.ChatHistory.route) {
            ChatHistoryScreen(
                onBack = { navController.popBackStack() },
                onSelectConversation = { convId ->
                    navController.navigate(Screen.Chat.createRoute(convId))
                }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.AboutDeveloper.route) {
            AboutDeveloperScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(
            route = Screen.LiveVoice.route,
            arguments = listOf(
                navArgument("mode") {
                    type = NavType.StringType
                    defaultValue = "general"
                }
            )
        ) { backStackEntry ->
            val modeArg = backStackEntry.arguments?.getString("mode") ?: "general"
            val voiceMode = when (modeArg) {
                "mental_comedy" -> VoiceMode.MENTAL_COMEDY
                "mature_18" -> VoiceMode.MATURE_18
                "palmistry" -> VoiceMode.PALMISTRY
                else -> VoiceMode.GENERAL
            }
            LiveVoiceScreen(
                initialMode = voiceMode,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.PalmistryVoiceMaster.route) {
            PalmistryVoiceScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.VideoStudio.route) {
            VideoStudioScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}
