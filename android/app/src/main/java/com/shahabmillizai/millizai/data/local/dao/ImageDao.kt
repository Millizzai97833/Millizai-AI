package com.shahabmillizai.millizai.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.shahabmillizai.millizai.data.local.db.GeneratedImageEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ImageDao {

    @Query("SELECT * FROM generated_images ORDER BY createdAt DESC")
    fun getAllImages(): Flow<List<GeneratedImageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertImage(image: GeneratedImageEntity)

    @Query("DELETE FROM generated_images WHERE id = :id")
    suspend fun deleteImageById(id: String)

    @Query("DELETE FROM generated_images")
    suspend fun clearGallery()
}
