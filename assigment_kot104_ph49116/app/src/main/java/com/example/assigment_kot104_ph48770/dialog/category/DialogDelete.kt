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
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog

/*
///
/// Project: KotlinApplication
/// Created by NguyenLoc on 4/1/2025.
/// Copyright © 2018-2019 Beeknights Co., Ltd. All rights reserved.
///
*/
@Composable
fun DialogDeleteCate(isShow:Boolean,onDismiss:()->Unit,onComfirm:()->Unit) {
    if(isShow){
        Dialog(onDismissRequest = {}) {
            Card(
                shape = CutCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)) {
                Column (
                    modifier = Modifier.fillMaxSize(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.SpaceAround
                ){
                    Text(text = "ban co muon xoa that khong?",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold)
                    Row {
                        Button(onClick = onComfirm,
                            shape = CutCornerShape(10.dp)
                        ) {
                            Text("OK")
                        }
                        Button(onClick = onDismiss,
                            shape = CutCornerShape(10.dp)
                        ) {
                            Text("Cancle")
                        }
                    }

                }
            }

        }
    }
}