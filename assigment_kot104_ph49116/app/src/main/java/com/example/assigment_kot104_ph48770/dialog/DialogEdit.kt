package com.example.assigment_kot104_ph48770.dialog

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
import com.example.assigment_kot104_ph48770.models.Product

@Composable
fun DialogEdit(
    isShow: Boolean,
    prd: Product,
    onDismiss: () -> Unit,
    onComfirm: (prd: Product) -> Unit
) {
    var newName by remember { mutableStateOf(prd.name) }
    var newPrice by remember { mutableStateOf(prd.price.toString()) }
    var newImage by remember { mutableStateOf(prd.image) } // Use prd.image
    var newCategoryName by remember { mutableStateOf(prd.categoryName) } // Use prd.categoryName

    if (isShow) {
        Dialog(onDismissRequest = onDismiss) { // Fix dismiss behavior
            Card(
                shape = CutCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp) // Increase height to accommodate all fields
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
                        onValueChange = { newName = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("Tên sản phẩm") }, // Add label
                        singleLine = true
                    )
                    TextField(
                        value = newPrice,
                        onValueChange = { newPrice = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("Giá sản phẩm") }, // Add label
                        singleLine = true
                    )
                    TextField(
                        value = newImage,
                        onValueChange = { newImage = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("URL hình ảnh") }, // Fix label
                        singleLine = true
                    )
                    TextField(
                        value = newCategoryName,
                        onValueChange = { newCategoryName = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("Tên danh mục") }, // Fix label
                        singleLine = true
                    )
                    Row {
                        Button(
                            onClick = {
                                val priceAsDouble = newPrice.toDoubleOrNull() ?: 0.0
                                onComfirm(Product(prd.id, newName, priceAsDouble, newImage, newCategoryName)) // Use updated values
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