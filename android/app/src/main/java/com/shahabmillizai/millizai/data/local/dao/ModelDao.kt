package com.shahabmillizai.millizai.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import com.shahabmillizai.millizai.data.local.db.ModelEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ModelDao {

    @Query("SELECT * FROM models ORDER BY downloadedAt DESC")
    fun getAllModels(): Flow<List<ModelEntity>>

    @Query("SELECT * FROM models WHERE isSelected = 1 LIMIT 1")
    fun getSelectedModel(): Flow<ModelEntity?>

    @Query("SELECT * FROM models WHERE isSelected = 1 LIMIT 1")
    suspend fun getSelectedModelSync(): ModelEntity?

    @Query("SELECT * FROM models WHERE id = :id LIMIT 1")
    suspend fun getModelById(id: String): ModelEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertModel(model: ModelEntity)

    @Query("DELETE FROM models WHERE id = :id")
    suspend fun deleteModel(id: String)

    @Query("UPDATE models SET isSelected = 0")
    suspend fun clearSelection()

    @Query("UPDATE models SET isSelected = 1 WHERE id = :id")
    suspend fun setSelected(id: String)

    @Transaction
    suspend fun selectModelById(id: String) {
        clearSelection()
        setSelected(id)
    }
}
