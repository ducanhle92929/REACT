package com.example.assigment_kot104_ph48770.screens.admin

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusModifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.example.assigment_kot104_ph48770.R
import com.example.assigment_kot104_ph48770.dialog.DialogCreate
import com.example.assigment_kot104_ph48770.dialog.DialogEdit
import com.example.assigment_kot104_ph48770.models.Product
import com.example.assigment_kot104_ph48770.service.ViewModelApp
import fpoly.locnv27.kotlinapplication.dialog.DialogDelete


/*
///
/// Project: KotlinApplication
/// Created by NguyenLoc on 3/27/2025.
/// Copyright © 2018-2019 Beeknights Co., Ltd. All rights reserved.
///
*/
@Composable
fun ListProductScreen(navController: NavController, viewModelApp: ViewModelApp = viewModel()) {
    val listProduct by remember { viewModelApp.listProduct }
    val context = LocalContext.current
    var isShowDialogDelete by remember { mutableStateOf(false) }
    var isShowDialogCreate by remember { mutableStateOf(false) }
    var isShowDialogEdit by remember { mutableStateOf(false) }
    var itemSelected by remember { mutableStateOf<Product?>(null) }

    LaunchedEffect(Unit) {
        viewModelApp.getListProduct()
    }

    if (isShowDialogEdit && itemSelected != null)
        DialogEdit(
            isShowDialogEdit,
            itemSelected!!,
            onDismiss = { isShowDialogEdit = false },
            onComfirm = { newPrd ->
                viewModelApp.updateProduct(itemSelected!!.id.toString(), newPrd)
                isShowDialogEdit = false
            })

    DialogDelete(
        isShowDialogDelete,
        onDismiss = { isShowDialogDelete = false },
        onComfirm = {
            viewModelApp.deleteProduct(itemSelected!!.id.toString())
            isShowDialogDelete = false
        })

    if (isShowDialogCreate) {
        DialogCreate(
            onDismiss = { isShowDialogCreate = false },
            onConfirm = { newProduct ->
                viewModelApp.createProduct(newProduct)
                isShowDialogCreate = false
            }
        )
    }


    // Bọc toàn bộ nội dung trong Column để thêm Button ở cuối
    Column {
        LazyColumn(
            modifier = Modifier.weight(1f) // Đảm bảo LazyColumn chiếm không gian còn lại
        ) {
            itemsIndexed(listProduct ?: emptyList()) { index, item ->
                Card(
                    modifier = Modifier
                        .padding(5.dp)
                        .fillMaxWidth()
                        .clickable {
                            navController.currentBackStackEntry?.savedStateHandle?.set("product", item)
                            navController.navigate("detail/${item.name}/${item.price}")
                        }
                ) {
                    Row(
                        modifier = Modifier.padding(top = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = item.image,
                            contentDescription = "",
                            modifier = Modifier.size(100.dp)
                        )
                        Column {
                            Text(fontWeight = FontWeight.Bold, text = item.name)
                            Text(text = item.price.toString()) // Convert Double to String
                        }
                        Spacer(Modifier.weight(1f))
                        Image(
                            painter = painterResource(R.drawable.baseline_edit),
                            contentDescription = "",
                            modifier = Modifier
                                .size(30.dp)
                                .clickable {
                                    itemSelected = item
                                    isShowDialogEdit = true
                                }
                        )
                        Image(
                            painter = painterResource(R.drawable.baseline_delete),
                            contentDescription = "",
                            modifier = Modifier
                                .size(30.dp)
                                .clickable {
                                    itemSelected = item
                                    isShowDialogDelete = true
                                }
                        )
                    }
                }
            }
        }

        // Thêm nút ở cuối
        Button(
            onClick = {
                // Bạn có thể thêm hành động mong muốn ở đây
                isShowDialogCreate = true // Ví dụ: mở dialog tạo mới
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(text = "Thêm sản phẩm mới")
        }
    }
}