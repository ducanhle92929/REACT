package com.example.assigment_kot104_ph48770.navigations

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.example.assigment_kot104_ph48770.screens.*
import com.example.assigment_kot104_ph48770.screens.admin.AdminScreen
import com.example.assigment_kot104_ph48770.screens.admin.ListCategoryScreen
import com.example.assigment_kot104_ph48770.screens.admin.ListProductScreen
import com.example.assigment_kot104_ph48770.service.ViewModelApp

enum class ROUTE_NAME {
    welcome,
    login,
    home,
    signup,
    detail,
    cart,
    checkout,
    success,
    order,
    addShipment,
    addPayment,
    paymentMethod,
    setting,
    selectShipment,
    myReview,
    rating,
    payment,
    listProduct,
    listCategory,
    admin
}

@Composable
fun AppNavHost(
    navController: NavHostController,
    innerPadding: PaddingValues
) {
    NavHost(navController = navController, startDestination = ROUTE_NAME.home.name) {
        composable(ROUTE_NAME.welcome.name) { WelComeScreen(navController) }
        composable(ROUTE_NAME.login.name) { LoginScreen(navController) }
        composable(ROUTE_NAME.home.name) { FurnitureApp(navController) }
        composable(ROUTE_NAME.signup.name) { SignupScreen(navController) }
        composable(ROUTE_NAME.cart.name) { SmallTopAppCart(navController) }
        composable(ROUTE_NAME.checkout.name) { CheckoutScreen(navController) }
        composable(ROUTE_NAME.success.name) { FinalScreen(navController) }
        composable(ROUTE_NAME.order.name) {
            OrderScreenRun(navController, viewModel = viewModel())
        }
        composable(ROUTE_NAME.addShipment.name) { AddShipmentScreen(navController) }
        composable(ROUTE_NAME.addPayment.name) { AddPaymentScreen(navController) }
        composable(ROUTE_NAME.paymentMethod.name) { SelectPaymentScreen(navController) }
        composable(ROUTE_NAME.setting.name) { settingScreens(navController) }
        composable(ROUTE_NAME.selectShipment.name) { AddressScreen(navController) }
        composable(ROUTE_NAME.myReview.name) { MyReViewTopBar(navController) }
        composable(ROUTE_NAME.rating.name) { ReView(navController) }
        composable(ROUTE_NAME.rating.name) { FavoriteScreen(innerPadding) }
        composable(ROUTE_NAME.payment.name) { PaymentMethod() }

        // Updated route for product details with dynamic productId
        composable(
            route = "detail/{productId}"
        ) { backStackEntry ->
            val productId = backStackEntry.arguments?.getString("productId") ?: ""
            ProductDetailScreen(productId = productId, navController = navController)
        }

        composable(ROUTE_NAME.listProduct.name) { ListProductScreen(navController) }
        composable(ROUTE_NAME.listCategory.name) { ListCategoryScreen(navController) }
        composable(ROUTE_NAME.admin.name) { AdminScreen(navController) }

    }
}


