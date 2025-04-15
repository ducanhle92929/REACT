package com.example.assigment_kot104_ph48770.service

import Order
import com.example.assigment_kot104_ph48770.models.CartItem
import com.example.assigment_kot104_ph48770.models.Category
import com.example.assigment_kot104_ph48770.models.Product
import com.example.assigment_kot104_ph48770.models.User
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

interface ApiService {
//    USER
    @POST("users")
    suspend fun registerUser(@Body user: User): User
    @GET("users")
    suspend fun getUsers(@Query("email") email: String): List<User>

    @GET("product")
    suspend fun getProducts(): List<Product>
    @GET("category")
    suspend fun getCategories(): List<Category>
    @GET("category/{categoryName}/products")
    suspend fun getProductsByCategory(@Path("categoryName") categoryName: String): List<Product>

    // CART
    @GET("cart")
    suspend fun getCartItems(): List<CartItem>
    // Add a cart item to JSON Server
    @POST("cart")
    suspend fun addToCart(@Body cartItem: CartItem): CartItem
    // Update a cart item on JSON Server
    @PUT("cart/{id}")
    suspend fun updateCartItem(@Path("id") id: Int, @Body cartItem: CartItem): CartItem
    @DELETE("cart/{id}")
    suspend fun deleteCartItem(@Path("id") id: Int): Response<Unit>

    // ORDER
    @GET("orders")
    suspend fun getOrders(): List<Order>
    @POST("orders")
    suspend fun saveOrder(@Body order: Order): Order


//    ADMIN
    @POST("product")
    suspend fun createProduct(@Body product: Product): Response<Product>
    @PUT("product/{id}")
    suspend fun updateProduct(@Path("id") id: String,@Body product: Product): Response<Product>
    @DELETE("product/{id}")
    suspend fun deleteProduct(@Path("id") id: String): Response<Unit>
    @POST("category")
    suspend fun createCategory(@Body category: Category): Response<Product>
    @PUT("category/{id}")
    suspend fun updateCategory(@Path("id") id: String,@Body category: Category): Response<Category>
    @DELETE("category/{id}")
    suspend fun deleteCategory(@Path("id") id: String): Response<Unit>
//    interface ApiService {
//        @DELETE("/cart")  // Đảm bảo đúng endpoint để xóa giỏ hàng
//        suspend fun clearCart(): Response<Void>
//    }
}

// Create Retrofit object
object RetrofitInstance {
    private const val BASE_URL = "http://192.168.1.11:3000/" // Ensure this matches your JSON Server URL
    val api: ApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}