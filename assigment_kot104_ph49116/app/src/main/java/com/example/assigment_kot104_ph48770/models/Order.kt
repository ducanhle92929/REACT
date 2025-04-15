import com.example.assigment_kot104_ph48770.models.CartItem

data class Order(
    val orderId: String,
    val date: String,
    val items: List<CartItem>,
    val totalAmount: Double,
    val status: String
)