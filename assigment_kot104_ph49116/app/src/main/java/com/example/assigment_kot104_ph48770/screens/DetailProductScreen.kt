package com.example.assigment_kot104_ph48770.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import androidx.core.graphics.toColorInt
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.example.assigment_kot104_ph48770.R
import com.example.assigment_kot104_ph48770.service.ViewModelApp

@Composable
fun ProductDetailScreen(
    productId: String,
    navController: NavController,
    viewModelApp: ViewModelApp = viewModel()
) {
    LaunchedEffect(productId) {
        viewModelApp.getListProduct()
    }

    val product = viewModelApp.listProduct.value?.find { it.id == productId }
    val favoriteProducts = viewModelApp.favoriteProducts.value
    val isFavorite = favoriteProducts.contains(product)

    if (product == null) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "Product not found",
                fontSize = 18.sp,
                color = Color.Gray
            )
        }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        Custom(navController, product.image)
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(end = 20.dp, start = 20.dp, top = 10.dp),
            verticalArrangement = Arrangement.SpaceAround
        ) {
            Text(
                text = product.name,
                fontSize = 24.sp,
                fontWeight = FontWeight(500),
                fontFamily = FontFamily(Font(R.font.gelasio_bold))
            )
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "\$ ${product.price}",
                    fontSize = 30.sp,
                    fontWeight = FontWeight(700),
                    fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold))
                )
                Row(
                    modifier = Modifier.width(113.dp),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(30.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(color = Color("#E0E0E0".toColorInt())),
                        contentAlignment = Alignment.Center
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.add),
                            contentDescription = "Increase quantity",
                            modifier = Modifier.size(13.dp)
                        )
                    }
                    Text(
                        text = "01",
                        fontSize = 18.sp,
                        fontWeight = FontWeight(700),
                        fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold))
                    )
                    Box(
                        modifier = Modifier
                            .size(30.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(color = Color("#E0E0E0".toColorInt())),
                        contentAlignment = Alignment.Center
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.apart),
                            contentDescription = "Decrease quantity",
                            modifier = Modifier.size(13.dp)
                        )
                    }
                }
            }
            Row(
                modifier = Modifier.width(200.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Image(
                    painter = painterResource(id = R.drawable.star),
                    contentDescription = "Rating star",
                    modifier = Modifier.size(20.dp)
                )
                Text(
                    text = "4.5",
                    fontSize = 18.sp,
                    fontWeight = FontWeight(700),
                    fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold)),
                    modifier = Modifier.padding(7.dp)
                )
                Text(
                    text = "(50 reviews)",
                    fontSize = 14.sp,
                    fontWeight = FontWeight(500),
                    color = Color("#808080".toColorInt()),
                    fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_bold)),
                    modifier = Modifier
                        .padding(start = 15.dp)
                        .clickable {
                            navController.navigate("rating")
                        }
                        .semantics { contentDescription = "View reviews" }
                )
            }
            Text(
                text = "No description available",
                fontSize = 15.sp,
                textAlign = TextAlign.Justify,
                fontWeight = FontWeight(500),
                color = Color("#606060".toColorInt()),
                fontFamily = FontFamily(Font(R.font.nunitosans_7pt_condensed_light))
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(
                    modifier = Modifier
                        .size(60.dp)
                        .shadow(elevation = 2.dp, RoundedCornerShape(8.dp))
                        .background(color = Color("#F5F5F5".toColorInt()))
                        .clickable {
                            if (isFavorite) {
                                viewModelApp.removeFromFavorites(product)
                            } else {
                                viewModelApp.addToFavorites(product)
                                navController.navigate("favorite")
                            }
                        }
                        .semantics { contentDescription = if (isFavorite) "Remove from favorites" else "Add to favorites" },
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Image(
                        painter = painterResource(id = if (isFavorite) R.drawable.marker else R.drawable.marker),
                        contentDescription = null,
                        modifier = Modifier.size(22.dp)
                    )
                }
                Box(
                    modifier = Modifier
                        .padding(7.dp)
                        .width(270.dp)
                        .height(60.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFF242424))
                        .clickable(onClick = {
                            viewModelApp.addToCart(product)
                            navController.navigate("cart")
                        })
                        .semantics { contentDescription = "Add to cart" }
                ) {
                    Row(
                        modifier = Modifier.fillMaxSize(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "Add to cart",
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
}

@Composable
fun Custom(navController: NavController, imageUrl: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(390.dp)
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Box {}
                AsyncImage(
                    model = imageUrl,
                    contentDescription = "Product image",
                    modifier = Modifier
                        .width(330.dp)
                        .fillMaxHeight()
                        .shadow(
                            elevation = 2.dp,
                            shape = RoundedCornerShape(bottomStart = 52.dp)
                        )
                        .zIndex(1f),
                    contentScale = ContentScale.FillBounds,
                    placeholder = painterResource(R.drawable.image3),
                    error = painterResource(R.drawable.image3)
                )
            }
        }
        Box(
            modifier = Modifier
                .width(130.dp)
                .fillMaxHeight()
        ) {
            Column(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.SpaceEvenly,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    modifier = Modifier
                        .size(45.dp)
                        .clickable { navController.navigateUp() }
                        .background(color = Color.White, RoundedCornerShape(14.dp))
                        .shadow(elevation = 0.dp, shape = RoundedCornerShape(14.dp), clip = true)
                        .semantics { contentDescription = "Back" },
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.arrowback),
                        contentDescription = null,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Column(
                    modifier = Modifier
                        .height(192.dp)
                        .shadow(elevation = 4.dp, shape = RoundedCornerShape(40.dp), clip = true)
                        .width(64.dp)
                        .background(Color.White, shape = RoundedCornerShape(40.dp)),
                    verticalArrangement = Arrangement.SpaceEvenly,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.color1),
                        contentDescription = "Color option 1",
                        modifier = Modifier.size(34.dp)
                    )
                    Image(
                        painter = painterResource(id = R.drawable.color2),
                        contentDescription = "Color option 2",
                        modifier = Modifier.size(34.dp)
                    )
                    Image(
                        painter = painterResource(id = R.drawable.color3),
                        contentDescription = "Color option 3",
                        modifier = Modifier.size(34.dp)
                    )
                }
                Row {}
            }
        }
    }
}