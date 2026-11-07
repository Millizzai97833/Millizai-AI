package com.shahabmillizai.millizai.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.shahabmillizai.millizai.data.local.db.VoiceRecordingEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface VoiceDao {
    @Query("SELECT * FROM voice_recordings ORDER BY timestamp DESC")
    fun getAllRecordings(): Flow<List<VoiceRecordingEntity>>

    @Query("SELECT * FROM voice_recordings WHERE mode = :mode ORDER BY timestamp DESC")
    fun getRecordingsByMode(mode: String): Flow<List<VoiceRecordingEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecording(recording: VoiceRecordingEntity)

    @Query("UPDATE voice_recordings SET title = :newTitle WHERE id = :id")
    suspend fun renameRecording(id: String, newTitle: String)

    @Query("DELETE FROM voice_recordings WHERE id = :id")
    suspend fun deleteRecordingById(id: String)

    @Query("DELETE FROM voice_recordings")
    suspend fun clearAllRecordings()
}
