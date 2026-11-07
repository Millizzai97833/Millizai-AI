package com.shahabmillizai.millizai.data.local.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.shahabmillizai.millizai.data.local.dao.ChatDao
import com.shahabmillizai.millizai.data.local.dao.ImageDao
import com.shahabmillizai.millizai.data.local.dao.ModelDao
import com.shahabmillizai.millizai.data.local.dao.VoiceDao

@Database(
    entities = [
        ConversationEntity::class,
        MessageEntity::class,
        ModelEntity::class,
        GeneratedImageEntity::class,
        VoiceRecordingEntity::class
    ],
    version = 2,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun chatDao(): ChatDao
    abstract fun modelDao(): ModelDao
    abstract fun imageDao(): ImageDao
    abstract fun voiceDao(): VoiceDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "millizai_database"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
