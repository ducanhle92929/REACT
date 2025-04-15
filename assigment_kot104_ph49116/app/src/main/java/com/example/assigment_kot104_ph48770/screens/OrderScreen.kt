package com.example.assigment_kot104_ph48770.screens

import Order
import androidx.activity.ComponentActivity
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.example.assigment_kot104_ph48770.CustomButton
import com.example.assigment_kot104_ph48770.R
import com.example.assigment_kot104_ph48770.service.ViewModelApp
import java.text.SimpleDateFormat
import java.util.*

class OrderScreen : ComponentActivity()

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrderScreenRun(navController: NavController, viewModel: ViewModelApp = viewModel()) {
    LaunchedEffect(Unit) {
        viewModel.fetchOrders()
    }
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        "My Order",
                        textAlign = TextAlign.Center,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.fillMaxWidth(),
                        fontFamily = FontFamily(Font(R.font.merriweather_regular))
                    )
                },
                navigationIcon = {
                    IconButton(onClick = { navController.navigateUp() }) {
                        Icon(
                            painter = painterResource(id = R.drawable.arrowback),
                            contentDescription = null,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                },
                actions = {
                    IconButton(
                        modifier = Modifier.size(24.dp),
                        onClick = { /* Handle action */ }) {
                        // Action icon (e.g., settings or more options) can be added here
                    }
                },
            )
        },
        content = { innerPadding ->
            ShowOrder(innerPadding, viewModel)
        }
    )
}

@Composable
fun ShowOrder(innerPaddingValues: PaddingValues, viewModel: ViewModelApp) {
    val orders by viewModel.orders // Fetch the list of orders
    var selectedTab by remember { mutableStateOf("Delivered") } // Quản lý tab hiện tại

    // Lọc đơn hàng theo tab
    val filteredOrders = orders.filter { order ->
        when (selectedTab) {
            "Delivered" -> order.status == "Delivered"
            "Processing" -> order.status == "Processing"
            "Canceled" -> order.status == "Canceled"
            else -> true
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(start = 10.dp, innerPaddingValues.calculateTopPadding(), end = 10.dp)
            .background(color = colorResource(id = R.color.background))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(42.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(120.dp),
                verticalArrangement = Arrangement.SpaceAround,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Delivered",
                    fontSize = 20.sp,
                    fontWeight = FontWeight(700),
                    color = if (selectedTab == "Delivered") Color.Black else Color.Gray,
                    modifier = Modifier.clickable { selectedTab = "Delivered" }
                )
                if (selectedTab == "Delivered") {
                    Divider(color = Color.Black, thickness = 4.dp, modifier = Modifier.width(40.dp))
                } else {
                    Spacer(modifier = Modifier.height(4.dp))
                }
            }
            Column(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(120.dp),
                verticalArrangement = Arrangement.SpaceAround,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Processing",
                    fontSize = 20.sp,
                    color = if (selectedTab == "Processing") Color.Black else Color.Gray,
                    fontWeight = FontWeight(700),
                    modifier = Modifier.clickable { selectedTab = "Processing" }
                )
                if (selectedTab == "Processing") {
                    Divider(color = Color.Black, thickness = 4.dp, modifier = Modifier.width(40.dp))
                } else {
                    Spacer(modifier = Modifier.height(4.dp))
                }
            }
            Column(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(120.dp),
                verticalArrangement = Arrangement.SpaceAround,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "Canceled",
                    fontSize = 20.sp,
                    color = if (selectedTab == "Canceled") Color.Black else Color.Gray,
                    fontWeight = FontWeight(700),
                    modifier = Modifier.clickable { selectedTab = "Canceled" }
                )
                if (selectedTab == "Canceled") {
                    Divider(color = Color.Black, thickness = 4.dp, modifier = Modifier.width(40.dp))
                } else {
                    Spacer(modifier = Modifier.height(4.dp))
                }
            }
        }
        Column {
            if (filteredOrders.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No orders yet",
                        fontSize = 18.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center
                    )
                }
            } else {
                LazyColumn {
                    items(filteredOrders) { order ->
                        Spacer(modifier = Modifier.height(20.dp))
                        OrderItem(order = order)
                    }
                }
            }
        }
    }
}

@Composable
fun OrderItem(order: Order) {
    // Định dạng ngày từ "2025-04-11" thành "11/04/2025"
    val inputFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
    val outputFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
    val formattedDate = try {
        val date = inputFormat.parse(order.date)
        outputFormat.format(date)
    } catch (e: Exception) {
        order.date // Nếu parse thất bại, giữ nguyên định dạng
    }

    // Tính tổng quantity từ items
    val totalQuantity = order.items.sumOf { it.quantity }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .height(160.dp)
            .background(Color.White, shape = RoundedCornerShape(8.dp)),
        verticalArrangement = Arrangement.SpaceEvenly
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 20.dp, end = 20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Order No:${order.orderId.take(12)}", // Giới hạn orderId để giống giao diện
                fontSize = 16.sp,
                fontWeight = FontWeight(600),
                color = Color.Black
            )
            Text(
                text = formattedDate,
                fontSize = 14.sp,
                fontWeight = FontWeight(500),
                color = Color.Gray
            )
        }
        Divider(color = Color.Black, thickness = 1.dp)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 20.dp, end = 20.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(text = buildAnnotatedString {
                withStyle(
                    style = SpanStyle(
                        color = Color.Gray,
                        fontSize = 16.sp,
                        fontWeight = FontWeight(500),
                    )
                ) {
                    append("Quantity: ")
                }
                withStyle(
                    style = SpanStyle(
                        color = Color.Black,
                        fontSize = 16.sp,
                        fontWeight = FontWeight(700),
                    )
                ) {
                    append(totalQuantity.toString())
                }
            })
            Text(text = buildAnnotatedString {
                withStyle(
                    style = SpanStyle(
                        color = Color.Gray,
                        fontSize = 16.sp,
                        fontWeight = FontWeight(500),
                    )
                ) {
                    append("Total Amount: ")
                }
                withStyle(
                    style = SpanStyle(
                        color = Color.Black,
                        fontSize = 16.sp,
                        fontWeight = FontWeight(700),
                    )
                ) {
                    append("$${String.format("%.2f", order.totalAmount)}")
                }
            })
        }
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 20.dp, end = 20.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            CustomButton(
                title = "Detail",
                modifier = Modifier
                    .width(100.dp)
                    .height(36.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFF242424))
                    .clickable(onClick = { /* TODO: Navigate to order details */ }),
                textStyle = TextStyle(
                    fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold)),
                    fontWeight = FontWeight(500),
                    fontSize = 15.sp,
                    color = Color.White
                ),
            )
            Text(
                text = order.status,
                fontSize = 16.sp,
                fontWeight = FontWeight(600),
                color = Color("#27AE60".toColorInt())
            )
        }
    }
}
