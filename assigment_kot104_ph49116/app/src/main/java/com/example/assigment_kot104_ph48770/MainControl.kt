package com.example.assigment_kot104_ph48770

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.runtime.Composable
import androidx.navigation.compose.rememberNavController
import com.example.assigment_kot104_ph48770.navigations.AppNavHost


class MainControl : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
           MyApp()
        }
    }

    @Composable
    fun MyApp() {
        val navController = rememberNavController()
        AppNavHost(navController = navController, innerPadding = PaddingValues())
    }

}


