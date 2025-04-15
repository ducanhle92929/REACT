package com.example.assigment_kot104_ph48770.screens.admin

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@Composable
fun AdminScreen(navController: NavController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text("ADMIN")
        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { navController.navigate("listCategory") },
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
        ) {
            Text("Category")
        }

        Button(
            onClick = { navController.navigate("listProduct") },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Product")
        }
        Button(
            onClick = { navController.navigate("login") },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Đăng xuất")
        }
    }
}
