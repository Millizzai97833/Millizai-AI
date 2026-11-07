package com.shahabmillizai.millizai.ai.engine

import android.util.Log

/**
 * Native JNI bridge to llama.cpp C++ runtime.
 * Loads libllama.so when bundled, or runs safe native inference hooks.
 */
object LlamaCppBridge {
    private const val TAG = "Millizai_LlamaBridge"
    private var isNativeLibLoaded = false

    init {
        try {
            System.loadLibrary("llama")
            isNativeLibLoaded = true
            Log.i(TAG, "libllama.so successfully loaded for native GGUF execution.")
        } catch (e: UnsatisfiedLinkError) {
            Log.w(TAG, "Native libllama.so not yet installed or using fallback engine: ${e.message}")
            isNativeLibLoaded = false
        }
    }

    fun isAvailable(): Boolean = isNativeLibLoaded

    // Native JNI functions implemented in llama.cpp Android JNI
    external fun nativeInitModel(modelPath: String, nThreads: Int, nCtx: Int): Long
    external fun nativeEvalPrompt(modelHandle: Long, prompt: String, temperature: Float, callback: (String) -> Unit): Int
    external fun nativeFreeModel(modelHandle: Long)
}
