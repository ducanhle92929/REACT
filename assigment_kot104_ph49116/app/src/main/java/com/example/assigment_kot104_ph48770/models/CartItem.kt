package com.example.assigment_kot104_ph48770.models

data class CartItem(

    val product: Product,
    val quantity: Int
)

//private fun clearCart() {
//    viewModelScope.launch {
//        try {
//            _cartItems.value.forEach { cartItem ->
//                cartItem.id?.let { id ->
//                    RetrofitInstance.api.deleteCartItem(id)
//                }
//            }
//            _cartItems.value = emptyList()
//        } catch (e: Exception) {
//            Log.d("ClearCartError", e.message.toString())
//        }
//    }
//}