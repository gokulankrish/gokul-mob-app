// import { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   Image
// } from 'react-native';
// import { Colors } from '../../constants/Colors';
// import { Ionicons } from '@expo/vector-icons';

// interface CartItem {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// export default function CartScreen() {
//   const [cartItems, setCartItems] = useState<CartItem[]>([
//     { id: '1', name: 'Paracetamol 500mg', description: 'Pain relief tablets, pack of 20', price: 5.99, quantity: 2, image: '💊' },
//     { id: '2', name: 'Vitamin C 1000mg', description: 'Immune support, 30 tablets', price: 12.99, quantity: 1, image: '🧪' },
//     { id: '3', name: 'Bandages', description: 'Assorted sizes, pack of 50', price: 8.49, quantity: 3, image: '🩹' },
//     { id: '4', name: 'Digital Thermometer', description: 'Fast and accurate readings', price: 24.99, quantity: 1, image: '🌡️' },
//   ]);

//   const updateQuantity = (id: string, change: number) => {
//     setCartItems(prevItems =>
//       prevItems.map(item => {
//         if (item.id === id) {
//           const newQuantity = item.quantity + change;
//           if (newQuantity < 1) return item;
//           return { ...item, quantity: newQuantity };
//         }
//         return item;
//       })
//     );
//   };

//   const removeItem = (id: string) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== id));
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   const renderCartItem = ({ item }: { item: CartItem }) => (
//     <View style={styles.cartItem}>
//       <View style={styles.itemImageContainer}>
//         <Text style={styles.itemImage}>{item.image}</Text>
//       </View>
//       <View style={styles.itemDetails}>
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemDescription}>{item.description}</Text>
//         <Text style={styles.itemPrice}>${item.price.toFixed(2)} each</Text>
//       </View>
//       <View style={styles.quantityContainer}>
//         <TouchableOpacity
//           onPress={() => updateQuantity(item.id, -1)}
//           style={styles.quantityButton}
//         >
//           <Ionicons name="remove" size={20} color={Colors.primary} />
//         </TouchableOpacity>
//         <Text style={styles.quantityText}>{item.quantity}</Text>
//         <TouchableOpacity
//           onPress={() => updateQuantity(item.id, 1)}
//           style={styles.quantityButton}
//         >
//           <Ionicons name="add" size={20} color={Colors.primary} />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.itemTotal}>
//         <Text style={styles.totalText}>${(item.price * item.quantity).toFixed(2)}</Text>
//         <TouchableOpacity
//           onPress={() => removeItem(item.id)}
//           style={styles.removeButton}
//         >
//           <Ionicons name="trash" size={20} color={Colors.error} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {/* Cart Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Shopping Cart</Text>
//         <Text style={styles.itemCount}>{cartItems.length} items</Text>
//       </View>

//       {/* Cart Items List */}
//       <FlatList
//         data={cartItems}
//         renderItem={renderCartItem}
//         keyExtractor={item => item.id}
//         contentContainerStyle={styles.cartList}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* Empty Cart State */}
//       {cartItems.length === 0 && (
//         <View style={styles.emptyContainer}>
//           <Ionicons name="cart-outline" size={80} color={Colors.textLight} />
//           <Text style={styles.emptyText}>Your cart is empty</Text>
//           <Text style={styles.emptySubtext}>Add items to get started</Text>
//           <TouchableOpacity style={styles.shopButton}>
//             <Text style={styles.shopButtonText}>Browse Products</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Order Summary */}
//       {cartItems.length > 0 && (
//         <View style={styles.summaryContainer}>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Subtotal</Text>
//             <Text style={styles.summaryValue}>${calculateTotal().toFixed(2)}</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Shipping</Text>
//             <Text style={styles.summaryValue}>$2.99</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Tax</Text>
//             <Text style={styles.summaryValue}>${(calculateTotal() * 0.08).toFixed(2)}</Text>
//           </View>
//           <View style={[styles.summaryRow, styles.totalRow]}>
//             <Text style={styles.totalLabel}>Total</Text>
//             <Text style={styles.totalValue}>
//               ${(calculateTotal() + 2.99 + (calculateTotal() * 0.08)).toFixed(2)}
//             </Text>
//           </View>

//           {/* Checkout Button */}
//           <TouchableOpacity style={styles.checkoutButton}>
//             <Text style={styles.checkoutText}>Proceed to Checkout</Text>
//           </TouchableOpacity>

//           {/* Continue Shopping */}
//           <TouchableOpacity style={styles.continueButton}>
//             <Text style={styles.continueText}>Continue Shopping</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: Colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   itemCount: {
//     fontSize: 14,
//     color: Colors.textLight,
//   },
//   cartList: {
//     paddingBottom: 250, // Space for summary
//   },
//   cartItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.white,
//     marginHorizontal: 15,
//     marginBottom: 10,
//     padding: 15,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   itemImageContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 10,
//     backgroundColor: Colors.lightGray,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   itemImage: {
//     fontSize: 24,
//   },
//   itemDetails: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: Colors.text,
//     marginBottom: 4,
//   },
//   itemDescription: {
//     fontSize: 12,
//     color: Colors.textLight,
//     marginBottom: 4,
//   },
//   itemPrice: {
//     fontSize: 14,
//     color: Colors.primary,
//     fontWeight: '600',
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 15,
//   },
//   quantityButton: {
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: Colors.lightGray,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginHorizontal: 10,
//     minWidth: 20,
//     textAlign: 'center',
//   },
//   itemTotal: {
//     alignItems: 'center',
//   },
//   totalText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: Colors.text,
//     marginBottom: 5,
//   },
//   removeButton: {
//     padding: 5,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 100,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: Colors.text,
//     marginTop: 20,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: Colors.textLight,
//     marginTop: 5,
//     marginBottom: 20,
//   },
//   shopButton: {
//     backgroundColor: Colors.primary,
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 25,
//   },
//   shopButtonText: {
//     color: Colors.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   summaryContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: Colors.white,
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: Colors.textLight,
//   },
//   summaryValue: {
//     fontSize: 14,
//     color: Colors.text,
//     fontWeight: '500',
//   },
//   totalRow: {
//     marginTop: 10,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//   },
//   totalLabel: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.text,
//   },
//   totalValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: Colors.primary,
//   },
//   checkoutButton: {
//     backgroundColor: Colors.primary,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 15,
//   },
//   checkoutText: {
//     color: Colors.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   continueButton: {
//     padding: 15,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   continueText: {
//     color: Colors.primary,
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });



import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Trash2, CreditCard } from 'lucide-react-native';
import { useCart } from '../../hooks/useCart';
import { router } from 'expo-router';

export default function CartScreen() {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add some medicines to your cart first.');
      return;
    }
    router.push('/pharmacy/checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.emptyCart}>
          <View style={styles.emptyCartIcon}>
            <CreditCard size={48} color="#d1d5db" />
          </View>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtext}>Add some medicines to get started</Text>
          <TouchableOpacity 
            style={styles.goToPharmacyButton}
            onPress={() => router.push('/pharmacy/pharmacy')}
          >
            <Text style={styles.goToPharmacyButtonText}>Go to Pharmacy</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.cartList}>
        {cartItems.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              {item.requiresPrescription && (
                <Text style={styles.prescriptionRequired}>Prescription Required</Text>
              )}
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Minus size={16} color="#6b7280" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeFromCart(item.id)}
            >
              <Trash2 size={20} color="#dc2626" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.cartFooter}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>₹{getTotalPrice()}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <CreditCard size={20} color="#ffffff" />
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#dc2626',
    fontWeight: '500',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartIcon: {
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 30,
  },
  goToPharmacyButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  goToPharmacyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartList: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  prescriptionRequired: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '500',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  removeButton: {
    padding: 8,
  },
  cartFooter: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});