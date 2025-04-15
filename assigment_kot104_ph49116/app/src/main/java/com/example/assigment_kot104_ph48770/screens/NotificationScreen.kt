package com.example.assigment_kot104_ph48770.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import com.example.assigment_kot104_ph48770.R
import com.example.assigment_kot104_ph48770.models.Product

// Model Product

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Product(
    val imageRes: Int,
    val name: String,
    val price: Double
) : Parcelable

// Composable functions
@Composable
fun NotificationScreen(innerPadding: PaddingValues) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(colorResource(id = R.color.background))
            .padding(innerPadding)
    ) {
        val productArr = listOf(
            Product("0", "Đèn đơn giản màu đen", 12.00,"R.drawable.image2","2"),
            Product("2", "Đèn đơn giản màu đen", 12.00,"R.drawable.image2","2"),
            Product("3", "Đèn đơn giản màu đen", 12.00,"R.drawable.image2","2"),

        )

        NotificationGrid(productArr = productArr)
    }
}

@Composable
fun NotificationGrid(productArr: List<Product>) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp)
    ) {
        items(productArr) { product ->
            NotificationItem(product = product)
            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}

@Composable
fun NotificationItem(product: Product) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp)
            .background(Color.White),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
//        Image(
//            painter = painterResource(id = product.image.length),
//            contentDescription = null,
//            modifier = Modifier
//                .width(100.dp)
//                .fillMaxHeight(),
//            contentScale = ContentScale.FillBounds
//        )

        Column(
            modifier = Modifier
                .padding(start = 10.dp)
                .fillMaxHeight(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier.padding(end = 10.dp)
            ) {
                Text(
                    text = "Đơn hàng #123456789 của bạn đã được xác nhận",
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily(
                        Font(R.font.nunitosans_7pt_condensed_bold)
                    )
                )
                Text(
                    text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis pretium et in arcu adipiscing nec.",
                    fontSize = 13.sp,
                    fontWeight = FontWeight(400),
                    color = colorResource(id = R.color.gray),
                    fontFamily = FontFamily(
                        Font(R.font.nunitosans_7pt_condensed_light)
                    ),
                    textAlign = TextAlign.Justify,
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(text = "")
                    Text(
                        text = "New",
                        fontSize = 15.sp,
                        fontWeight = FontWeight(800),
                        color = Color("#27AE60".toColorInt())
                    )
                }
            }
        }
    }
}