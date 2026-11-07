package com.shahabmillizai.millizai

import android.app.Application
import com.shahabmillizai.millizai.data.local.db.AppDatabase
import com.shahabmillizai.millizai.data.local.preferences.UserPreferencesRepository

class MillizaiApp : Application() {

    lateinit var database: AppDatabase
        private set

    lateinit var preferencesRepository: UserPreferencesRepository
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this
        database = AppDatabase.getDatabase(this)
        preferencesRepository = UserPreferencesRepository(this)
    }

    companion object {
        lateinit var instance: MillizaiApp
            private set
    }
}
