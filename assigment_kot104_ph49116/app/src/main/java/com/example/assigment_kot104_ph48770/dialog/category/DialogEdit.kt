package com.example.assigment_kot104_ph48770.dialog.category

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.CutCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.assigment_kot104_ph48770.models.Category

@Composable
fun DialogEditCate(
    isShow: Boolean,
    prd: Category,
    onDismiss: () -> Unit,
    onComfirm: (prd: Category) -> Unit
) {
    var newName by remember { mutableStateOf(prd.name) }
    var newImage by remember { mutableStateOf(prd.image) }

    if (isShow) {
        Dialog(onDismissRequest = onDismiss) {
            Card(
                shape = CutCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
            ) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceAround
                ) {
                    Text(
                        text = "Bạn có muốn sửa không?",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                    TextField(
                        value = newName,
                        onValueChange = { newName = it }, // Ensure this updates newName
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("ten") },
                        singleLine = true
                    )
                    TextField(
                        value = newImage,
                        onValueChange = { newImage = it }, // Ensure this updates newImage
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("anh") },
                        singleLine = true
                    )

                    Row {
                        Button(
                            onClick = {
                                onComfirm(Category(prd.id, newName, newImage))
                            },
                            shape = CutCornerShape(10.dp)
                        ) {
                            Text("OK")
                        }
                    }
                }
            }
        }
    }
}