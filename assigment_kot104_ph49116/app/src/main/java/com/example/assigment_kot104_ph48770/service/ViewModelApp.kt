package com.example.assigment_kot104_ph48770.service

import Order
import android.util.Log
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.assigment_kot104_ph48770.models.CartItem
import com.example.assigment_kot104_ph48770.models.Category
import com.example.assigment_kot104_ph48770.models.Product
import com.example.assigment_kot104_ph48770.models.User
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class ViewModelApp : ViewModel() {
    // Existing states (unchanged)
    private val _currentUser = mutableStateOf<User?>(null)
    val currentUser: State<User?> = _currentUser

    private val _isLoading = mutableStateOf(false)
    val isLoading: State<Boolean> = _isLoading
    private val _errorMessage = mutableStateOf<String?>(null)
    val errorMessage: State<String?> = _errorMessage

    private val _listProduct = mutableStateOf<List<Product>?>(null)
    val listProduct: State<List<Product>?> = _listProduct

    private val _listCategory = mutableStateOf<List<Category>?>(null)
    val listCategory: State<List<Category>?> = _listCategory

    private val _cartItems = mutableStateOf<List<CartItem>>(emptyList())
    val cartItems: State<List<CartItem>> = _cartItems

    private val _orders = mutableStateOf<List<Order>>(emptyList())
    val orders: State<List<Order>> = _orders

    // New state for category-specific products
    private val _categoryProducts = mutableStateOf<List<Product>?>(null)
    val categoryProducts: State<List<Product>?> = _categoryProducts

    // Fetch products by category
    fun getProductsByCategory(categoryName: String) {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _categoryProducts.value = RetrofitInstance.api.getProductsByCategory(categoryName)
            } catch (e: Exception) {
                _errorMessage.value = "Failed to load products for category $categoryName: ${e.message}"
                Log.e("CategoryProductsError", e.message.toString())
            } finally {
                _isLoading.value = false
            }
        }
    }

    // Existing functions (unchanged, included for completeness)
    fun getListProduct() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _listProduct.value = RetrofitInstance.api.getProducts()
            } catch (e: Exception) {
                _errorMessage.value = "Failed to load products: ${e.message}"
                Log.e("ProductError", e.message.toString())
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun getListCategory() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _listCategory.value = RetrofitInstance.api.getCategories()
            } catch (e: Exception) {
                _errorMessage.value = "Failed to load categories: ${e.message}"
                Log.e("CategoryError", e.message.toString())
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun fetchCartItems() {
        viewModelScope.launch {
            try {
                _cartItems.value = RetrofitInstance.api.getCartItems()
            } catch (e: Exception) {
                _errorMessage.value = "Failed to load cart: ${e.message}"
                Log.e("CartError", e.message.toString())
            }
        }
    }


    fun updateCartItemQuantity(cartItem: CartItem, newQuantity: Int) {
        if (newQuantity <= 0) {
            _cartItems.value = _cartItems.value.filter { it.product.id != cartItem.product.id }
        } else {
            _cartItems.value = _cartItems.value.map {
                if (it.product.id == cartItem.product.id) it.copy(quantity = newQuantity) else it
            }
        }
    }

    fun fetchOrders() {
        viewModelScope.launch {
            try {
                _orders.value = RetrofitInstance.api.getOrders()
            } catch (e: Exception) {
                _errorMessage.value = "Failed to load orders: ${e.message}"
                Log.e("OrdersError", e.message.toString())
            }
        }
    }

    fun submitOrder(cartItems: List<CartItem>, totalAmount: Double) {
        viewModelScope.launch {
            try {
                val order = Order(
                    orderId = UUID.randomUUID().toString(),
                    date = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date()),
                    items = cartItems,
                    totalAmount = totalAmount,
                    status = "Delivered"
                )
                RetrofitInstance.api.saveOrder(order)
                clearCart()
                fetchOrders()
            } catch (e: Exception) {
                _errorMessage.value = "Failed to submit order: ${e.message}"
                Log.e("SubmitOrderError", e.message.toString())
            }
        }
    }

    private fun clearCart() {
        viewModelScope.launch {
            try {
                _cartItems.value = emptyList()
            } catch (e: Exception) {
                _errorMessage.value = "Failed to clear cart: ${e.message}"
                Log.e("ClearCartError", e.message.toString())
            }
        }
    }
//private fun clearCart() {
//    viewModelScope.launch {
//        try {
//            // Gửi yêu cầu xóa giỏ hàng trên server
//            val response = RetrofitInstance.api.clearCart()  // Giả sử đây là API để xóa giỏ hàng
//
//            if (response.isSuccessful) {
//                // Nếu xóa giỏ hàng thành công trên server, xóa giỏ hàng trong ứng dụng
//                _cartItems.value = emptyList()
//            } else {
//                // Nếu có lỗi từ server, hiển thị thông báo
//                _errorMessage.value = "Failed to clear cart on server: ${response.message()}"
//                Log.e("ClearCartError", "Failed to clear cart on server: ${response.message()}")
//            }
//        } catch (e: Exception) {
//            _errorMessage.value = "Failed to clear cart: ${e.message}"
//            Log.e("ClearCartError", e.message.toString())
//        }
//    }
//}



    // Danh sách sản phẩm yêu thích
private val _favoriteProducts = mutableStateOf<List<Product>>(emptyList())
    var favoriteProducts: State<List<Product>> = _favoriteProducts

    // Hàm thêm sản phẩm vào danh sách yêu thích
    fun addToFavorites(product: Product) {
        val currentFavorites = _favoriteProducts.value.toMutableList()
        if (!currentFavorites.contains(product)) { // Tránh thêm trùng
            currentFavorites.add(product)
            _favoriteProducts.value = currentFavorites
        }
    }

    // Hàm xóa sản phẩm khỏi danh sách yêu thích (nếu cần)
    fun removeFromFavorites(product: Product) {
        val currentFavorites = _favoriteProducts.value.toMutableList()
        currentFavorites.remove(product)
        _favoriteProducts.value = currentFavorites
    }

//    fun addToCart(product: Product) {
//        viewModelScope.launch {
//            try {
//                val existingItem = _cartItems.value.find { it.product.id == product.id }
//                if (existingItem != null) {
//                    _cartItems.value = _cartItems.value.map {
//                        if (it.product.id == product.id) it.copy(quantity = it.quantity + 1) else it
//                    }
//                } else {
//                    val newCartItem = CartItem(product, 1)
//                    val response = RetrofitInstance.api.addToCart(newCartItem)
//                    _cartItems.value = _cartItems.value + response
//                }
//            } catch (e: Exception) {
//                _errorMessage.value = "Failed to add to cart: ${e.message}"
//                Log.e("AddToCartError", e.message.toString())
//            }
//        }
//    }
fun addToCart(product: Product) {
    viewModelScope.launch {
        try {
            // Kiểm tra xem item đã tồn tại trong giỏ hàng chưa
            val currentList = _cartItems.value
            val existingItem = currentList.find { it.product.id == product.id }

            if (existingItem != null) {
                // Nếu đã có thì chỉ tăng số lượng và cập nhật lại
                updateCartItemQuantity(existingItem, existingItem.quantity + 1)
            } else {
                // Nếu chưa có, thì mới gọi API để thêm
                val newCartItem = CartItem(product, 1)
                val response = RetrofitInstance.api.addToCart(newCartItem)

                // Cập nhật danh sách giỏ hàng
                _cartItems.value = currentList + response
            }
        } catch (e: Exception) {
            _errorMessage.value = "Failed to add to cart: ${e.message}"
            Log.e("AddToCartError", e.message.toString())
        }
    }
}


    // ADMIN
    fun deleteProduct(id:String) {
        viewModelScope.launch {
            try {
                val result = RetrofitInstance.api.deleteProduct(id)
                if (result.isSuccessful) {
                    Log.d("===", result.message())
                    getListProduct()
                } else {
                    Log.d("===", result.message())
                }
            }catch (e:Exception){
                Log.d("===",e.message.toString())
            }
        }
    }
    // In ViewModelApp.kt
    fun createProduct(product: Product) {
        viewModelScope.launch {
            try {
                val result = RetrofitInstance.api.createProduct(product)
                if (result.isSuccessful) {
                    Log.d("===", "Product created successfully")
                    getListProduct() // Refresh the list after creation
                } else {
                    Log.d("===", result.message())
                }
            } catch (e: Exception) {
                Log.d("===", e.message.toString())
            }
        }
    }
    //cap nhat du lieu
    fun updateProduct(id:String,product: Product) {
        viewModelScope.launch {
            try {
                val result = RetrofitInstance.api.updateProduct(id, product)
                if (result.isSuccessful) {
                    Log.d("===", result.message())
                    getListProduct()
                } else {
                    Log.d("===", result.message())
                }
            } catch (e: Exception) {
                Log.d("===", e.message.toString())
            }
        }
    }

    fun deleteCategory(id:String) {
        viewModelScope.launch {
            try {
                val result = RetrofitInstance.api.deleteCategory(id)
                if (result.isSuccessful) {
                    Log.d("===", result.message())
                    getListCategory()
                } else {
                    Log.d("===", result.message())
                }
            }catch (e:Exception){
                Log.d("===",e.message.toString())
            }
        }
    }
    // In ViewModelApp.kt
    fun createCategory(category: Category) {
        viewModelScope.launch {
            try {
                val result = RetrofitInstance.api.createCategory(category)
                if (result.isSuccessful) {
                    Log.d("===", "Product created successfully")
                    getListCategory() // Refresh the list after creation
                } else {
                    Log.d("===", result.message())
                }
            } catch (e: Exception) {
                Log.d("===", e.message.toString())
            }
        }
    }
    //cap nhat du lieu
    fun updateCategory(id:String,category: Category) {
        viewModelScope.launch {
            try {
                val result = RetrofitInstance.api.updateCategory(id, category)
                if (result.isSuccessful) {
                    Log.d("===", result.message())
                    getListCategory()
                } else {
                    Log.d("===", result.message())
                }
            } catch (e: Exception) {
                Log.d("===", e.message.toString())
            }
        }
    }
}