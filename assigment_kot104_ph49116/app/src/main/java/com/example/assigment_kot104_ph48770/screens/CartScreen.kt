package com.example.assigment_kot104_ph48770.screens

import androidx.compose.foundation.Image
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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.graphics.toColorInt
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import coil.compose.AsyncImage
import com.example.assigment_kot104_ph48770.R
import com.example.assigment_kot104_ph48770.models.CartItem // Import CartItem
import com.example.assigment_kot104_ph48770.service.ViewModelApp

@Composable
fun CartScreen(innerPadding: PaddingValues, navHostController: NavController, viewModel: ViewModelApp = viewModel()) {
    LaunchedEffect(Unit) {
        viewModel.fetchCartItems()
    }

    val cartItems by viewModel.cartItems
    val totalPrice: Double = cartItems.sumOf { it.product.price * it.quantity }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(
                start = 10.dp,
                top = innerPadding.calculateTopPadding(),
                end = 10.dp
            ),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        if (cartItems.isEmpty()) {
            Text(
                text = "Your cart is empty",
                modifier = Modifier.fillMaxSize(),
                textAlign = TextAlign.Center,
                fontSize = 18.sp
            )
        } else {
            CartGrid(
                cartItems = cartItems,
                viewModel = viewModel,
                modifier = Modifier.weight(1f)
            )
        }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .wrapContentHeight(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(end = 10.dp),
                contentAlignment = Alignment.TopEnd
            ) {
                var promoCode by remember { mutableStateOf("") }
                TextField(
                    placeholder = {
                        Text(
                            text = "Enter your promo code",
                            color = Color("#999999".toColorInt()),
                            fontSize = 16.sp,
                            fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_light)),
                            fontWeight = FontWeight(600)
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    value = promoCode,
                    onValueChange = { promoCode = it },
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = Color("#E0E0E0".toColorInt()),
                        unfocusedContainerColor = Color.White,
                        disabledContainerColor = Color.White,
                        unfocusedIndicatorColor = Color.White,
                    ),
                )
                Row(
                    modifier = Modifier
                        .size(45.dp)
                        .shadow(elevation = 2.dp, RoundedCornerShape(14.dp))
                        .background(color = Color("#303030".toColorInt())),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.arrownext),
                        contentDescription = null,
                        modifier = Modifier.size(22.dp)
                    )
                }
            }
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 15.dp, end = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Total:",
                    fontSize = 23.sp,
                    fontWeight = FontWeight(700),
                    color = Color("#808080".toColorInt()),
                    fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold))
                )
                Text(
                    text = "$${String.format("%.2f", totalPrice)}",
                    fontSize = 23.sp,
                    fontWeight = FontWeight(700),
                    color = Color("#000000".toColorInt()),
                    fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold))
                )
            }

            Box(
                modifier = Modifier
                    .padding(7.dp)
                    .fillMaxWidth()
                    .height(60.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(Color(0xFF242424))
                    .clickable(onClick = {
                        navHostController.navigate("checkout")
                    })
            ) {
                Row(
                    modifier = Modifier.fillMaxSize(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "Check out",
                        color = Color.White,
                        fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_light)),
                        fontWeight = FontWeight(600),
                        fontSize = 17.sp
                    )
                }
            }
        }
    }
}

@Composable
fun CartGrid(cartItems: List<CartItem>, viewModel: ViewModelApp, modifier: Modifier = Modifier) {
    LazyColumn(
        modifier = modifier,
        contentPadding = PaddingValues(16.dp)
    ) {
        items(cartItems) { cartItem ->
            CartItem(cartItem = cartItem, viewModel = viewModel)
            Spacer(modifier = Modifier.height(10.dp))
        }
    }
}

@Composable
fun CartItem(cartItem: CartItem, viewModel: ViewModelApp) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        AsyncImage(
            model = cartItem.product.image,
            contentDescription = cartItem.product.name,
            modifier = Modifier
                .size(80.dp)
                .clip(RoundedCornerShape(8.dp)),
            placeholder = painterResource(R.drawable.image3),
            error = painterResource(R.drawable.image3)
        )
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(start = 10.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = cartItem.product.name,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold))
            )
            Text(
                text = "$${String.format("%.2f", cartItem.product.price)}",
                fontSize = 14.sp,
                color = Color.Black,
                fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold))
            )
            Row(
                modifier = Modifier.padding(top = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(30.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(color = Color("#E0E0E0".toColorInt()))
                        .clickable {
                            viewModel.updateCartItemQuantity(cartItem, cartItem.quantity + 1)
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.add),
                        contentDescription = null,
                        modifier = Modifier.size(13.dp)
                    )
                }
                Text(
                    text = String.format("%02d", cartItem.quantity),
                    fontSize = 18.sp,
                    fontWeight = FontWeight(700),
                    fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold)),
                    modifier = Modifier.padding(horizontal = 8.dp)
                )
                Box(
                    modifier = Modifier
                        .size(30.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(color = Color("#E0E0E0".toColorInt()))
                        .clickable {
                            viewModel.updateCartItemQuantity(cartItem, cartItem.quantity - 1)
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.apart),
                        contentDescription = null,
                        modifier = Modifier.size(13.dp)
                    )
                }
            }
        }
        IconButton(
            onClick = {
                viewModel.updateCartItemQuantity(cartItem, 0) // Remove item
            },
            modifier = Modifier.size(24.dp)
        ) {
            Icon(
                painter = painterResource(id = R.drawable.delete),
                contentDescription = "Remove",
                tint = Color.Black,
                modifier = Modifier.size(24.dp)


            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SmallTopAppCart(navHostController: NavController, viewModel: ViewModelApp = viewModel()) {
    Scaffold(
        topBar = {
            TopAppBar(
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = Color.Black,
                ),
                title = {
                    Text(
                        "My Cart",
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth(),
                        fontFamily = FontFamily(Font(R.font.merriweather_regular))
                    )
                },
                navigationIcon = {
                    IconButton(onClick = {
                        navHostController.navigateUp()
                    }) {
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
                        onClick = { /* do something */ }) {
                    }
                },
            )
        },
    ) { innerPadding ->
        CartScreen(innerPadding = innerPadding, navHostController = navHostController, viewModel = viewModel)
    }
}
