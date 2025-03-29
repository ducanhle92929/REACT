import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

type RootParamList = {
    Login: undefined;
    SignUp: undefined;
    app: undefined;
    Payment: { selectedItems: CartItem[] }; // Updated to include params
};

type NavigationProp = StackNavigationProp<RootParamList, 'Login'>;

interface CartItem {
    id: string;
    name: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
    checked: boolean;
    categoryId: string;
    productId: string;
}

const CartScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch dữ liệu từ API khi component mount
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const cartsResponse = await fetch("https://67e5137018194932a584633a.mockapi.io/carts");
                const cartsData = await cartsResponse.json();
                console.log("Raw carts data:", cartsData); // Debug log

                const productsResponse = await fetch("https://67e5137018194932a584633a.mockapi.io/products");
                const productsData = await productsResponse.json();

                const combinedData: CartItem[] = cartsData.map((cart: any) => {
                    const product = productsData.find((p: any) => p.id === cart.productId);
                    if (product) {
                        // Safely parse quantity
                        const rawQuantity = cart.quantity;
                        let quantity = 1; // Giá trị mặc định
                        if (typeof rawQuantity === "string") {
                            quantity = parseInt(rawQuantity.replace("quantity ", "")) || 1;
                        } else if (typeof rawQuantity === "number") {
                            quantity = rawQuantity;
                        }

                        return {
                            id: cart.id,
                            name: product.name,
                            category: product.type || "Không xác định",
                            price: parseFloat(product.price.replace("đ", "").replace(".", "")),
                            quantity,
                            image: product.image,
                            checked: false,
                            categoryId: product.categoryId,
                            productId: cart.productId,
                        };
                    }
                    return null;
                }).filter((item: CartItem | null) => item !== null);

                setCartItems(combinedData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cart data:", error);
                setLoading(false);
            }
        };

        fetchCartData();
    }, []);

    const updateQuantity = (id: string, type: "increase" | "decrease") => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id
                    ? { ...item, quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    const removeItem = async (id: string) => {
        try {
            const itemToDelete = cartItems.find((item) => item.id === id);
            if (!itemToDelete) {
                console.error(`Item with id ${id} not found in cartItems`);
                return;
            }

            const { categoryId, productId } = itemToDelete;

            const response = await fetch(
                `https://67e5137018194932a584633a.mockapi.io/categories/${categoryId}/products/${productId}/carts/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
                console.log(`Item ${id} deleted successfully from API`);
            } else {
                const errorText = await response.text();
                console.error(`Failed to delete item ${id} from API. Status: ${response.status}, Message: ${errorText}`);
                if (response.status === 404) {
                    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
                    console.log(`Item ${id} not found on API, removed from local state`);
                }
            }
        } catch (error) {
            console.error("Error deleting item from API:", error instanceof Error ? error.message : error);
        }
    };

    const showDeleteItemConfirmation = (id: string) => {
        Alert.alert(
            "Bạn có chắc chắn muốn xóa không?",
            "Thao tác này sẽ không thể khôi phục.",
            [
                {
                    text: "Hủy",
                    style: "cancel",
                },
                {
                    text: "Đồng ý",
                    style: "destructive",
                    onPress: () => removeItem(id),
                },
            ],
            { cancelable: true }
        );
    };

    const toggleCheck = (id: string) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const clearCart = async () => {
        try {
            const deletePromises = cartItems.map((item) =>
                fetch(
                    `https://67e5137018194932a584633a.mockapi.io/categories/${item.categoryId}/products/${item.productId}/carts/${item.id}`,
                    { method: "DELETE" }
                )
            );
            await Promise.all(deletePromises);
            setCartItems([]);
            console.log("Cart cleared successfully");
        } catch (error) {
            console.error("Error clearing cart:", error instanceof Error ? error.message : error);
            setCartItems([]);
        }
    };

    const showClearCartConfirmation = () => {
        Alert.alert(
            "Xác nhận xóa tất cả đơn hàng?",
            "Thao tác này sẽ không thể khôi phục.",
            [
                {
                    text: "Hủy bỏ",
                    style: "cancel",
                },
                {
                    text: "Đồng ý",
                    style: "destructive",
                    onPress: clearCart,
                },
            ],
            { cancelable: true }
        );
    };

    const handlePayment = () => {
        const selectedItems = cartItems.filter(item => item.checked);

        if (selectedItems.length === 0) {
            Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sản phẩm để thanh toán");
            return;
        }

        navigation.navigate("Payment", { selectedItems });
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>GIỎ HÀNG</Text>
                <TouchableOpacity onPress={showClearCartConfirmation}>
                    <Icon name="trash-2" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Cart List */}
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 12 }}>
                        {/* Checkbox */}
                        <BouncyCheckbox
                            isChecked={item.checked}
                            onPress={() => toggleCheck(item.id)}
                            fillColor="black"
                            disableText={true}
                            iconStyle={{
                                borderRadius: 4,
                                borderWidth: 2,
                                borderColor: "black",
                                backgroundColor: item.checked ? "black" : "white",
                            }}
                            innerIconStyle={{
                                borderRadius: 4,
                            }}
                            useBuiltInState={false}
                        />

                        {/* Product Image */}
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: 60, height: 60, borderRadius: 8, marginLeft: 10 }}
                        />

                        {/* Product Info */}
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>{item.name}</Text>
                            <Text style={{ color: "green", fontSize: 16, fontWeight: "bold" }}>
                                {item.price.toLocaleString()}đ
                            </Text>
                        </View>

                        {/* Quantity Controls */}
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => updateQuantity(item.id, "decrease")}>
                                <Icon name="minus-square" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: 8, fontSize: 16 }}>{item.quantity}</Text>
                            <TouchableOpacity onPress={() => updateQuantity(item.id, "increase")}>
                                <Icon name="plus-square" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        {/* Remove Item */}
                        <TouchableOpacity onPress={() => showDeleteItemConfirmation(item.id)} style={{ marginLeft: 10 }}>
                            <Text style={{ color: "black", textDecorationLine: "underline" }}>Xoá</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Thanh toán */}
            <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: "white" }}>
                {/* Tạm tính - Only for checked items */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                    <Text style={{ color: "gray", fontSize: 14 }}>Tạm tính</Text>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        {cartItems
                            .filter(item => item.checked)
                            .reduce((total, item) => total + item.price * item.quantity, 0)
                            .toLocaleString()}đ
                    </Text>
                </View>

                {/* Nút Thanh Toán */}
                <TouchableOpacity
                    onPress={handlePayment}
                    style={{
                        backgroundColor: "green",
                        paddingVertical: 14,
                        borderRadius: 8,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Tiến hành thanh toán</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CartScreen;