package com.shahabmillizai.millizai.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = MillizaiPurple,
    onPrimary = Color.White,
    primaryContainer = MillizaiPurpleDark,
    onPrimaryContainer = MillizaiPurpleLight,
    secondary = MillizaiBlue,
    onSecondary = Color.White,
    tertiary = MillizaiCyan,
    background = MillizaiBlackBg,
    onBackground = TextPrimaryDark,
    surface = MillizaiSurfaceDark,
    onSurface = TextPrimaryDark,
    surfaceVariant = MillizaiCardDark,
    onSurfaceVariant = TextSecondaryDark,
    outline = MillizaiCardBorderDark
)

private val LightColorScheme = lightColorScheme(
    primary = MillizaiPurpleDark,
    onPrimary = Color.White,
    primaryContainer = MillizaiPurpleLight,
    onPrimaryContainer = MillizaiPurpleDark,
    secondary = MillizaiBlueDark,
    onSecondary = Color.White,
    tertiary = MillizaiCyan,
    background = MillizaiWhiteBg,
    onBackground = TextPrimaryLight,
    surface = MillizaiSurfaceLight,
    onSurface = TextPrimaryLight,
    surfaceVariant = MillizaiCardLight,
    onSurfaceVariant = TextSecondaryLight,
    outline = MillizaiCardBorderLight
)

@Composable
fun MillizaiTheme(
    darkTheme: Boolean = true, // Default to futuristic dark mode
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window ?: return@SideEffect
            window.statusBarColor = colorScheme.background.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
