package com.example.assigment_kot104_ph48770.dialog.category
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
import com.example.assigment_kot104_ph48770.models.Category

// In a new file or same file
@Composable
fun DialogCreateCate(
    onDismiss: () -> Unit,
    onConfirm: (Category) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var image by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Create New Category") },
        text = {
            Column {
                TextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Name") },
                    singleLine = true
                )

                TextField(
                    value = image,
                    onValueChange = { image = it },
                    label = { Text("Avatar URL") },
                    singleLine = true
                )

            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val newCategory = Category(
                        id = "", // Assuming the server generates the ID
                        name = name,
                        image = image,
                    )
                    onConfirm(newCategory)
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