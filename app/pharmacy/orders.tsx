// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Modal,
//   Image,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { router, Stack } from 'expo-router';
// import { 
//   Search, 
//   Filter, 
//   Calendar, 
//   MapPin, 
//   Phone, 
//   Package, 
//   Eye, 
//   X, 
//   Clock, 
//   CheckCircle, 
//   XCircle,
//   ArrowLeft,
//   ShoppingBag
// } from 'lucide-react-native';
// import { useOrders } from '../../hooks/useOrder';
// import { colors } from '../../constants/Colors';

// export default function OrderHistoryPage() {
//   const { orders } = useOrders();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderDetails, setShowOrderDetails] = useState(false);
  
//   const confirmedOrders = orders.filter(order => order.status === 'confirmed');
//   const pendingOrders = orders.filter(order => order.status === 'pending_approval');
//   const rejectedOrders = orders.filter(order => order.status === 'rejected');

//   const filteredOrders = React.useMemo(() => {
//     return orders.filter(order => {
//       const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
//       const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
//       return matchesSearch && matchesFilter;
//     });
//   }, [orders, searchQuery, filterStatus]);

//   const handleViewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowOrderDetails(true);
//   };

//   const renderOrderDetailsModal = () => (
//     <Modal visible={showOrderDetails} animationType="slide" presentationStyle="pageSheet">
//       <SafeAreaView style={styles.modalContainer}>
//         <View style={styles.modalHeader}>
//           <TouchableOpacity 
//             style={styles.modalCloseButton}
//             onPress={() => setShowOrderDetails(false)}
//           >
//             <X size={24} color="#6b7280" />
//           </TouchableOpacity>
//           <Text style={styles.modalTitle}>Order Details</Text>
//           <View style={{ width: 40 }} />
//         </View>
        
//         {selectedOrder && (
//           <ScrollView style={styles.modalContent}>
//             <View style={styles.orderDetailsHeader}>
//               <View style={styles.orderDetailsIdContainer}>
//                 <Package size={20} color={colors.primary} />
//                 <Text style={styles.orderDetailsId}>Order #{selectedOrder.id}</Text>
//               </View>
//               <View style={styles.orderDetailsStatusContainer}>
//                 {selectedOrder.status === 'confirmed' && <CheckCircle size={18} color="#059669" />}
//                 {selectedOrder.status === 'pending_approval' && <Clock size={18} color="#ea580c" />}
//                 {selectedOrder.status === 'rejected' && <XCircle size={18} color="#dc2626" />}
//                 <Text style={[
//                   styles.orderDetailsStatus,
//                   selectedOrder.status === 'confirmed' && styles.statusConfirmed,
//                   selectedOrder.status === 'pending_approval' && styles.statusPending,
//                   selectedOrder.status === 'rejected' && styles.statusRejected,
//                 ]}>
//                   {selectedOrder.status === 'pending_approval' ? 'PENDING APPROVAL' : selectedOrder.status.toUpperCase()}
//                 </Text>
//               </View>
//             </View>
            
//             <View style={styles.orderDetailsSection}>
//               <View style={styles.sectionHeaderSmall}>
//                 <Calendar size={16} color="#6b7280" />
//                 <Text style={styles.sectionTitleSmall}>Order Information</Text>
//               </View>
//               <Text style={styles.orderDetailsText}>
//                 Date: {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 })}
//               </Text>
//               <Text style={styles.orderDetailsText}>
//                 Payment: {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
//               </Text>
//               {selectedOrder.needsPrescription && (
//                 <View style={styles.prescriptionNotice}>
//                   <Text style={styles.prescriptionNoticeText}>
//                     ⚠️ This order contains prescription medicines
//                   </Text>
//                 </View>
//               )}
//             </View>
            
//             <View style={styles.orderDetailsSection}>
//               <View style={styles.sectionHeaderSmall}>
//                 <MapPin size={16} color="#6b7280" />
//                 <Text style={styles.sectionTitleSmall}>Delivery Address</Text>
//               </View>
//               <View style={styles.addressContainer}>
//                 <Text style={styles.addressText}>{selectedOrder.address.street}</Text>
//                 <Text style={styles.addressText}>
//                   {selectedOrder.address.city}, {selectedOrder.address.state}
//                 </Text>
//                 <Text style={styles.addressText}>PIN: {selectedOrder.address.pincode}</Text>
//                 <View style={styles.phoneContainer}>
//                   <Phone size={14} color="#059669" />
//                   <Text style={styles.phoneText}>{selectedOrder.address.phone}</Text>
//                 </View>
//               </View>
//             </View>
            
//             <View style={styles.orderDetailsSection}>
//               <View style={styles.sectionHeaderSmall}>
//                 <Package size={16} color="#6b7280" />
//                 <Text style={styles.sectionTitleSmall}>Items Ordered</Text>
//               </View>
//               {selectedOrder.items.map(item => (
//                 <View key={item.id} style={styles.orderItemDetail}>
//                   <Image source={{ uri: item.image }} style={styles.orderItemDetailImage} />
//                   <View style={styles.orderItemDetailInfo}>
//                     <Text style={styles.orderItemDetailName}>{item.name}</Text>
//                     <Text style={styles.orderItemDetailCategory}>{item.category}</Text>
//                     <Text style={styles.orderItemDetailQuantity}>Quantity: {item.quantity}</Text>
//                     {item.requiresPrescription && (
//                       <View style={styles.prescriptionBadgeContainer}>
//                         <Text style={styles.prescriptionBadgeSmall}>Prescription Required</Text>
//                       </View>
//                     )}
//                   </View>
//                   <View style={styles.orderItemDetailPricing}>
//                     {item.discount && (
//                       <Text style={styles.orderItemOriginalPrice}>₹{item.price * item.quantity}</Text>
//                     )}
//                     <Text style={styles.orderItemDetailPrice}>
//                       ₹{item.discount 
//                         ? Math.round(item.price * (1 - item.discount / 100)) * item.quantity
//                         : item.price * item.quantity}
//                     </Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
            
//             <View style={styles.orderDetailsSection}>
//               <Text style={styles.sectionTitleSmall}>Bill Summary</Text>
//               <View style={styles.billSummaryContainer}>
//                 <View style={styles.billRow}>
//                   <Text style={styles.billLabel}>Subtotal:</Text>
//                   <Text style={styles.billValue}>₹{selectedOrder.subtotal}</Text>
//                 </View>
//                 {selectedOrder.discount > 0 && (
//                   <View style={styles.billRow}>
//                     <Text style={[styles.billLabel, { color: '#059669' }]}>Discount:</Text>
//                     <Text style={[styles.billValue, { color: '#059669' }]}>-₹{selectedOrder.discount}</Text>
//                   </View>
//                 )}
//                 <View style={styles.billRow}>
//                   <Text style={styles.billLabel}>GST (18%):</Text>
//                   <Text style={styles.billValue}>₹{selectedOrder.gst}</Text>
//                 </View>
//                 <View style={styles.billDivider} />
//                 <View style={styles.billRow}>
//                   <Text style={styles.billTotalLabel}>Total Amount:</Text>
//                   <Text style={styles.billTotalValue}>₹{selectedOrder.total}</Text>
//                 </View>
//               </View>
//             </View>
//           </ScrollView>
//         )}
//       </SafeAreaView>
//     </Modal>
//   );

//   return (
//     <>
//       <Stack.Screen 
//         options={{ 
//           headerShown: true,
//           title: 'Order History',
//           headerLeft: () => (
//             <TouchableOpacity onPress={() => router.back()}>
//               <ArrowLeft size={24} color={colors.primary} />
//             </TouchableOpacity>
//           ),
//         }} 
//       />
//       <SafeAreaView style={styles.container}>
//         <View style={styles.searchFilterContainer}>
//           <View style={styles.searchBar}>
//             <Search size={20} color="#6b7280" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search orders or medicines..."
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//           </View>
          
//           <View style={styles.filterContainer}>
//             <Filter size={16} color="#6b7280" />
//             <Text style={styles.filterLabel}>Filter:</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
//               {['all', 'confirmed', 'pending_approval', 'rejected'].map(status => (
//                 <TouchableOpacity
//                   key={status}
//                   style={[
//                     styles.filterChip,
//                     filterStatus === status && styles.filterChipActive
//                   ]}
//                   onPress={() => setFilterStatus(status)}
//                 >
//                   <Text style={[
//                     styles.filterChipText,
//                     filterStatus === status && styles.filterChipTextActive
//                   ]}>
//                     {status === 'all' ? 'All' : 
//                      status === 'pending_approval' ? 'Pending' :
//                      status.charAt(0).toUpperCase() + status.slice(1)}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </View>

//         <View style={styles.orderStats}>
//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{orders.length}</Text>
//             <Text style={styles.statLabel}>Total Orders</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={[styles.statNumber, { color: '#059669' }]}>{confirmedOrders.length}</Text>
//             <Text style={styles.statLabel}>Completed</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={[styles.statNumber, { color: '#ea580c' }]}>{pendingOrders.length}</Text>
//             <Text style={styles.statLabel}>Pending</Text>
//           </View>
//           <View style={styles.statItem}>
//             <Text style={[styles.statNumber, { color: '#dc2626' }]}>{rejectedOrders.length}</Text>
//             <Text style={styles.statLabel}>Rejected</Text>
//           </View>
//         </View>

//         <ScrollView style={styles.ordersList} contentContainerStyle={{ paddingBottom: 30 }}>
//           {filteredOrders.length === 0 ? (
//             <View style={styles.emptyOrdersState}>
//               <ShoppingBag size={48} color="#d1d5db" />
//               <Text style={styles.emptyOrdersText}>
//                 {searchQuery || filterStatus !== 'all' ? 'No orders match your search' : 'No orders found'}
//               </Text>
//               <Text style={styles.emptyOrdersSubtext}>
//                 {searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filter' : 'Start shopping to see your orders here'}
//               </Text>
//             </View>
//           ) : (
//             filteredOrders.map(order => (
//               <View key={order.id} style={styles.orderHistoryCard}>
//                 <View style={styles.orderCardHeader}>
//                   <View style={styles.orderIdContainer}>
//                     <Package size={16} color={colors.primary} />
//                     <Text style={styles.orderIdText}>Order #{order.id}</Text>
//                   </View>
//                   <View style={styles.orderStatusContainer}>
//                     {order.status === 'confirmed' && <CheckCircle size={16} color="#059669" />}
//                     {order.status === 'pending_approval' && <Clock size={16} color="#ea580c" />}
//                     {order.status === 'rejected' && <XCircle size={16} color="#dc2626" />}
//                     <Text style={[
//                       styles.orderStatusText,
//                       order.status === 'confirmed' && styles.statusConfirmed,
//                       order.status === 'pending_approval' && styles.statusPending,
//                       order.status === 'rejected' && styles.statusRejected,
//                     ]}>
//                       {order.status === 'pending_approval' ? 'PENDING' : order.status.toUpperCase()}
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.orderCardContent}>
//                   <View style={styles.orderDateContainer}>
//                     <Calendar size={14} color="#6b7280" />
//                     <Text style={styles.orderDate}>
//                       {new Date(order.createdAt).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'short',
//                         day: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </Text>
//                   </View>

//                   <View style={styles.orderItemsPreview}>
//                     <Text style={styles.orderItemsTitle}>Items ({order.items.length}):</Text>
//                     <View style={styles.orderItemsList}>
//                       {order.items.slice(0, 2).map(item => (
//                         <View key={item.id} style={styles.orderItemPreview}>
//                           <Image source={{ uri: item.image }} style={styles.orderItemImage} />
//                           <View style={styles.orderItemInfo}>
//                             <Text style={styles.orderItemName}>{item.name}</Text>
//                             <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
//                             {item.requiresPrescription && (
//                               <Text style={styles.prescriptionBadge}>Rx Required</Text>
//                             )}
//                           </View>
//                         </View>
//                       ))}
//                       {order.items.length > 2 && (
//                         <Text style={styles.moreItemsText}>+{order.items.length - 2} more items</Text>
//                       )}
//                     </View>
//                   </View>

//                   <View style={styles.orderAddressPreview}>
//                     <MapPin size={14} color="#6b7280" />
//                     <Text style={styles.orderAddressText}>
//                       {order.address.city}, {order.address.state}
//                     </Text>
//                   </View>
//                 </View>

//                 <View style={styles.orderCardFooter}>
//                   <View style={styles.orderTotalContainer}>
//                     <Text style={styles.orderTotalLabel}>Total:</Text>
//                     <Text style={styles.orderTotalAmount}>₹{order.total}</Text>
//                   </View>
//                   <TouchableOpacity
//                     style={styles.viewOrderButton}
//                     onPress={() => handleViewOrderDetails(order)}
//                   >
//                     <Eye size={16} color={colors.primary} />
//                     <Text style={styles.viewOrderButtonText}>View Details</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ))
//           )}
//         </ScrollView>

//         {renderOrderDetailsModal()}
//       </SafeAreaView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//     marginTop: -40,
//   },
//   searchFilterContainer: {
//     backgroundColor: '#ffffff',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginBottom: 16,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 12,
//     fontSize: 16,
//     color: '#1f2937',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   filterLabel: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginLeft: 8,
//     marginRight: 12,
//     fontWeight: '500',
//   },
//   filterScroll: {
//     flex: 1,
//   },
//   filterChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     backgroundColor: '#f3f4f6',
//     borderRadius: 20,
//     marginRight: 8,
//   },
//   filterChipActive: {
//     backgroundColor: '#2563eb',
//   },
//   filterChipText: {
//     fontSize: 12,
//     color: '#6b7280',
//     fontWeight: '500',
//   },
//   filterChipTextActive: {
//     color: '#ffffff',
//   },
//   orderStats: {
//     flexDirection: 'row',
//     backgroundColor: '#ffffff',
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//   },
//   statItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.primary,
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6b7280',
//     textAlign: 'center',
//   },
//   ordersList: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 15,
//     paddingBottom: 150,
//   },
//   emptyOrdersState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 80,
//     paddingHorizontal: 40,
//   },
//   emptyOrdersText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#6b7280',
//     marginTop: 16,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptyOrdersSubtext: {
//     fontSize: 14,
//     color: '#9ca3af',
//     textAlign: 'center',
//   },
//   orderHistoryCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   orderCardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   orderIdContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   orderIdText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginLeft: 8,
//   },

//   orderStatusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//   },
//   orderStatusText: {
//     fontSize: 10,
//     fontWeight: 'bold',
//     marginLeft: 6,
//   },
//   statusConfirmed: {
//     backgroundColor: '#dcfce7',
//     color: '#15803d',
//   },
//   statusPending: {
//     backgroundColor: '#fef3c7',
//     color: '#d97706',
//   },
//   statusRejected: {
//     backgroundColor: '#fecaca',
//     color: '#dc2626',
//   },
//   orderCardContent: {
//     marginBottom: 16,
//   },
//   orderDateContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   orderDate: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginLeft: 8,
//   },
//   orderItemsPreview: {
//     marginBottom: 12,
//   },
//   orderItemsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 8,
//   },
//   orderItemsList: {
//     gap: 8,
//   },
//   orderItemPreview: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f9fafb',
//     borderRadius: 8,
//     padding: 8,
//   },
//   orderItemImage: {
//     width: 32,
//     height: 32,
//     borderRadius: 6,
//     backgroundColor: '#e5e7eb',
//   },
//   orderItemInfo: {
//     flex: 1,
//     marginLeft: 8,
//   },
//   orderItemName: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#1f2937',
//   },
//   orderItemQuantity: {
//     fontSize: 10,
//     color: '#6b7280',
//   },
//   prescriptionBadge: {
//     fontSize: 8,
//     color: '#dc2626',
//     fontWeight: '500',
//     marginTop: 2,
//   },
//   moreItemsText: {
//     fontSize: 12,
//     color: '#6b7280',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     paddingVertical: 4,
//   },
//   orderAddressPreview: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   orderAddressText: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginLeft: 6,
//   },
//   orderCardFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#f3f4f6',
//   },
//   orderTotalContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   orderTotalLabel: {
//     fontSize: 14,
//     color: '#6b7280',
//     marginRight: 8,
//   },
//   orderTotalAmount: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#059669',
//   },
//   viewOrderButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#eff6ff',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   viewOrderButtonText: {
//     fontSize: 12,
//     color: colors.primary,
//     fontWeight: '500',
//     marginLeft: 6,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//     backgroundColor: '#ffffff',
//   },
//   modalCloseButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#f3f4f6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   modalContent: {
//     flex: 1,
//     backgroundColor: '#f9fafb',
//   },
//   orderDetailsHeader: {
//     backgroundColor: '#ffffff',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   orderDetailsIdContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   orderDetailsId: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginLeft: 8,
//   },
//   orderDetailsStatusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f3f4f6',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   orderDetailsStatus: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginLeft: 8,
//   },
//   orderDetailsSection: {
//     backgroundColor: '#ffffff',
//     marginHorizontal: 20,
//     marginVertical: 8,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   sectionHeaderSmall: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f3f4f6',
//   },
//   sectionTitleSmall: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1f2937',
//     marginLeft: 8,
//   },
//   orderDetailsText: {
//     fontSize: 14,
//     color: '#4b5563',
//     marginBottom: 6,
//     lineHeight: 20,
//   },
//   prescriptionNotice: {
//     backgroundColor: '#fef2f2',
//     borderRadius: 8,
//     padding: 12,
//     marginTop: 8,
//   },
//   prescriptionNoticeText: {
//     fontSize: 12,
//     color: '#dc2626',
//     fontWeight: '500',
//   },
//   addressContainer: {
//     backgroundColor: '#f9fafb',
//     borderRadius: 8,
//     padding: 12,
//   },
//   addressText: {
//     fontSize: 14,
//     color: '#4b5563',
//     marginBottom: 4,
//     lineHeight: 20,
//   },
//   phoneContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//     backgroundColor: '#f0fdf4',
//     borderRadius: 6,
//     padding: 8,
//   },
//   phoneText: {
//     fontSize: 14,
//     color: '#059669',
//     marginLeft: 6,
//     fontWeight: '500',
//   },
//   orderItemDetail: {
//     flexDirection: 'row',
//     backgroundColor: '#f9fafb',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//   },
//   orderItemDetailImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 8,
//     backgroundColor: '#e5e7eb',
//   },
//   orderItemDetailInfo: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   orderItemDetailName: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#1f2937',
//     marginBottom: 4,
//   },
//   orderItemDetailCategory: {
//     fontSize: 12,
//     color: '#6b7280',
//     marginBottom: 4,
//     textTransform: 'capitalize',
//   },
//   orderItemDetailQuantity: {
//     fontSize: 12,
//     color: '#4b5563',
//     marginBottom: 4,
//   },
//   prescriptionBadgeContainer: {
//     alignSelf: 'flex-start',
//   },
//   prescriptionBadgeSmall: {
//     fontSize: 10,
//     color: '#dc2626',
//     fontWeight: '500',
//     backgroundColor: '#fef2f2',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   orderItemDetailPricing: {
//     alignItems: 'flex-end',
//     justifyContent: 'center',
//   },
//   orderItemOriginalPrice: {
//     fontSize: 12,
//     color: '#6b7280',
//     textDecorationLine: 'line-through',
//     marginBottom: 2,
//   },
//   orderItemDetailPrice: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#059669',
//   },
//   billSummaryContainer: {
//     backgroundColor: '#f9fafb',
//     borderRadius: 8,
//     padding: 16,
//   },
//   billRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   billLabel: {
//     fontSize: 14,
//     color: '#6b7280',
//   },
//   billValue: {
//     fontSize: 14,
//     color: '#1f2937',
//     fontWeight: '500',
//   },
//   billDivider: {
//     height: 1,
//     backgroundColor: '#e5e7eb',
//     marginVertical: 12,
//   },
//   billTotalLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1f2937',
//   },
//   billTotalValue: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: colors.primary,
//   },
// });

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Phone, 
  Package, 
  Eye, 
  X, 
  Clock, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react-native';
import { useOrders } from '../../hooks/useOrder';
import { colors } from '../../constants/Colors';
import { Order, OrderItem, OrderAddress } from '../../types/order';

export default function OrderHistoryPage() {
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  const confirmedOrders = orders.filter(order => order.status === 'confirmed');
  const pendingOrders = orders.filter(order => order.status === 'pending_approval');
  const rejectedOrders = orders.filter(order => order.status === 'rejected');

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order: Order) => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [orders, searchQuery, filterStatus]);

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const renderOrderDetailsModal = () => (
    <Modal visible={showOrderDetails} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            style={styles.modalCloseButton}
            onPress={() => setShowOrderDetails(false)}
          >
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Order Details</Text>
          <View style={{ width: 40 }} />
        </View>
        
        {selectedOrder && (
          <ScrollView style={styles.modalContent}>
            <View style={styles.orderDetailsHeader}>
              <View style={styles.orderDetailsIdContainer}>
                <Package size={20} color={colors.primary} />
                <Text style={styles.orderDetailsId}>Order #{selectedOrder.id}</Text>
              </View>
              <View style={styles.orderDetailsStatusContainer}>
                {selectedOrder.status === 'confirmed' && <CheckCircle size={18} color="#059669" />}
                {selectedOrder.status === 'pending_approval' && <Clock size={18} color="#ea580c" />}
                {selectedOrder.status === 'rejected' && <XCircle size={18} color="#dc2626" />}
                <Text style={[
                  styles.orderDetailsStatus,
                  selectedOrder.status === 'confirmed' && styles.statusConfirmed,
                  selectedOrder.status === 'pending_approval' && styles.statusPending,
                  selectedOrder.status === 'rejected' && styles.statusRejected,
                ]}>
                  {selectedOrder.status === 'pending_approval' ? 'PENDING APPROVAL' : selectedOrder.status.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.orderDetailsSection}>
              <View style={styles.sectionHeaderSmall}>
                <Calendar size={16} color="#6b7280" />
                <Text style={styles.sectionTitleSmall}>Order Information</Text>
              </View>
              <Text style={styles.orderDetailsText}>
                Date: {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text style={styles.orderDetailsText}>
                Payment: {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
              </Text>
              {selectedOrder.needsPrescription && (
                <View style={styles.prescriptionNotice}>
                  <Text style={styles.prescriptionNoticeText}>
                    ⚠️ This order contains prescription medicines
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.orderDetailsSection}>
              <View style={styles.sectionHeaderSmall}>
                <MapPin size={16} color="#6b7280" />
                <Text style={styles.sectionTitleSmall}>Delivery Address</Text>
              </View>
              <View style={styles.addressContainer}>
                <Text style={styles.addressText}>{selectedOrder.address.street}</Text>
                <Text style={styles.addressText}>
                  {selectedOrder.address.city}, {selectedOrder.address.state}
                </Text>
                <Text style={styles.addressText}>PIN: {selectedOrder.address.pincode}</Text>
                <View style={styles.phoneContainer}>
                  <Phone size={14} color="#059669" />
                  <Text style={styles.phoneText}>{selectedOrder.address.phone}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.orderDetailsSection}>
              <View style={styles.sectionHeaderSmall}>
                <Package size={16} color="#6b7280" />
                <Text style={styles.sectionTitleSmall}>Items Ordered</Text>
              </View>
              {selectedOrder.items.map((item: OrderItem) => (
                <View key={item.id} style={styles.orderItemDetail}>
                  <Image source={{ uri: item.image }} style={styles.orderItemDetailImage} />
                  <View style={styles.orderItemDetailInfo}>
                    <Text style={styles.orderItemDetailName}>{item.name}</Text>
                    <Text style={styles.orderItemDetailCategory}>{item.category}</Text>
                    <Text style={styles.orderItemDetailQuantity}>Quantity: {item.quantity}</Text>
                    {item.requiresPrescription && (
                      <View style={styles.prescriptionBadgeContainer}>
                        <Text style={styles.prescriptionBadgeSmall}>Prescription Required</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.orderItemDetailPricing}>
                    {item.discount && (
                      <Text style={styles.orderItemOriginalPrice}>₹{item.price * item.quantity}</Text>
                    )}
                    <Text style={styles.orderItemDetailPrice}>
                      ₹{item.discount 
                        ? Math.round(item.price * (1 - item.discount / 100)) * item.quantity
                        : item.price * item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            
            <View style={styles.orderDetailsSection}>
              <Text style={styles.sectionTitleSmall}>Bill Summary</Text>
              <View style={styles.billSummaryContainer}>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Subtotal:</Text>
                  <Text style={styles.billValue}>₹{selectedOrder.subtotal}</Text>
                </View>
                {selectedOrder.discount > 0 && (
                  <View style={styles.billRow}>
                    <Text style={[styles.billLabel, { color: '#059669' }]}>Discount:</Text>
                    <Text style={[styles.billValue, { color: '#059669' }]}>-₹{selectedOrder.discount}</Text>
                  </View>
                )}
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>GST (18%):</Text>
                  <Text style={styles.billValue}>₹{selectedOrder.gst}</Text>
                </View>
                <View style={styles.billDivider} />
                <View style={styles.billRow}>
                  <Text style={styles.billTotalLabel}>Total Amount:</Text>
                  <Text style={styles.billTotalValue}>₹{selectedOrder.total}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Order History',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search orders or medicines..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <Filter size={16} color="#6b7280" />
            <Text style={styles.filterLabel}>Filter:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {['all', 'confirmed', 'pending_approval', 'rejected'].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    filterStatus === status && styles.filterChipActive
                  ]}
                  onPress={() => setFilterStatus(status)}
                >
                  <Text style={[
                    styles.filterChipText,
                    filterStatus === status && styles.filterChipTextActive
                  ]}>
                    {status === 'all' ? 'All' : 
                     status === 'pending_approval' ? 'Pending' :
                     status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.orderStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{orders.length}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#059669' }]}>{confirmedOrders.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#ea580c' }]}>{pendingOrders.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#dc2626' }]}>{rejectedOrders.length}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>

        <ScrollView style={styles.ordersList} contentContainerStyle={{ paddingBottom: 30 }}>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyOrdersState}>
              <ShoppingBag size={48} color="#d1d5db" />
              <Text style={styles.emptyOrdersText}>
                {searchQuery || filterStatus !== 'all' ? 'No orders match your search' : 'No orders found'}
              </Text>
              <Text style={styles.emptyOrdersSubtext}>
                {searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filter' : 'Start shopping to see your orders here'}
              </Text>
            </View>
          ) : (
            filteredOrders.map((order: Order) => (
              <View key={order.id} style={styles.orderHistoryCard}>
                <View style={styles.orderCardHeader}>
                  <View style={styles.orderIdContainer}>
                    <Package size={16} color={colors.primary} />
                    <Text style={styles.orderIdText}>Order #{order.id}</Text>
                  </View>
                  <View style={styles.orderStatusContainer}>
                    {order.status === 'confirmed' && <CheckCircle size={16} color="#059669" />}
                    {order.status === 'pending_approval' && <Clock size={16} color="#ea580c" />}
                    {order.status === 'rejected' && <XCircle size={16} color="#dc2626" />}
                    <Text style={[
                      styles.orderStatusText,
                      order.status === 'confirmed' && styles.statusConfirmed,
                      order.status === 'pending_approval' && styles.statusPending,
                      order.status === 'rejected' && styles.statusRejected,
                    ]}>
                      {order.status === 'pending_approval' ? 'PENDING' : order.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderCardContent}>
                  <View style={styles.orderDateContainer}>
                    <Calendar size={14} color="#6b7280" />
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>

                  <View style={styles.orderItemsPreview}>
                    <Text style={styles.orderItemsTitle}>Items ({order.items.length}):</Text>
                    <View style={styles.orderItemsList}>
                      {order.items.slice(0, 2).map((item: OrderItem) => (
                        <View key={item.id} style={styles.orderItemPreview}>
                          <Image source={{ uri: item.image }} style={styles.orderItemImage} />
                          <View style={styles.orderItemInfo}>
                            <Text style={styles.orderItemName}>{item.name}</Text>
                            <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
                            {item.requiresPrescription && (
                              <Text style={styles.prescriptionBadge}>Rx Required</Text>
                            )}
                          </View>
                        </View>
                      ))}
                      {order.items.length > 2 && (
                        <Text style={styles.moreItemsText}>+{order.items.length - 2} more items</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.orderAddressPreview}>
                    <MapPin size={14} color="#6b7280" />
                    <Text style={styles.orderAddressText}>
                      {order.address.city}, {order.address.state}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderCardFooter}>
                  <View style={styles.orderTotalContainer}>
                    <Text style={styles.orderTotalLabel}>Total:</Text>
                    <Text style={styles.orderTotalAmount}>₹{order.total}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewOrderButton}
                    onPress={() => handleViewOrderDetails(order)}
                  >
                    <Eye size={16} color={colors.primary} />
                    <Text style={styles.viewOrderButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {renderOrderDetailsModal()}
      </SafeAreaView>
    </>
  );
}

// ... (keep all your existing styles)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchFilterContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    marginLeft: 8,
    marginRight: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterScroll: {
    flex: 1,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: 'white',
  },
  orderStats: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  ordersList: {
    flex: 1,
    padding: 16,
  },
  orderHistoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatusText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  statusConfirmed: {
    color: '#059669',
  },
  statusPending: {
    color: '#ea580c',
  },
  statusRejected: {
    color: '#dc2626',
  },
  orderCardContent: {
    marginBottom: 16,
  },
  orderDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  orderItemsPreview: {
    marginBottom: 12,
  },
  orderItemsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  orderItemsList: {},
  orderItemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  orderItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  orderItemQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  prescriptionBadge: {
    fontSize: 10,
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  moreItemsText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  orderAddressPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderAddressText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },
  orderTotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderTotalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginRight: 8,
  },
  orderTotalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
  },
  viewOrderButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  orderDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  orderDetailsIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDetailsId: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  orderDetailsStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDetailsStatus: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  orderDetailsSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleSmall: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  orderDetailsText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  prescriptionNotice: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  prescriptionNoticeText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
  },
  addressContainer: {
    marginTop: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phoneText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  orderItemDetail: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderItemDetailImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  orderItemDetailInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orderItemDetailName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  orderItemDetailCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  orderItemDetailQuantity: {
    fontSize: 14,
    color: '#6b7280',
  },
  prescriptionBadgeContainer: {
    marginTop: 4,
  },
  prescriptionBadgeSmall: {
    fontSize: 10,
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  orderItemDetailPricing: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  orderItemOriginalPrice: {
    fontSize: 12,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  orderItemDetailPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  billSummaryContainer: {
    marginTop: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  emptyOrdersState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyOrdersText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyOrdersSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});