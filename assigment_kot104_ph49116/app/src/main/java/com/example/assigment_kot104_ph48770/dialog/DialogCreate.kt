package com.example.assigment_kot104_ph48770.dialog
import androidx.compose.foundation.layout.Column
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.example.assigment_kot104_ph48770.models.Product

// In a new file or same file
@Composable
fun DialogCreate(
    onDismiss: () -> Unit,
    onConfirm: (Product) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }
    var image by remember { mutableStateOf("") }
    var categoryName by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Create New Product") },
        text = {
            Column {
                TextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Name") }
                )
                TextField(
                    value = price,
                    onValueChange = { price = it },
                    label = { Text("Price") }
                )
                TextField(
                    value = image,
                    onValueChange = { image = it },
                    label = { Text("Avatar URL") }
                )
                TextField(
                    value = categoryName,
                    onValueChange = { categoryName = it },
                    label = { Text("Category") }
                )

            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val newProduct = Product(
                        id = "", // Assuming the server generates the ID
                        name = name,
                        price =  price.toDoubleOrNull() ?: 0.0,
                        image = image,
                        categoryName = categoryName
                    )
                    onConfirm(newProduct)
                }
            ) {
                Text("Create")
            }
        },
        dismissButton = {
            Button(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}