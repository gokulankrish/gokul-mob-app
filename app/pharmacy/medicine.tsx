import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  CreditCard as Edit,
  Trash2,
  Check,
  X,
  Bell,
  Search,
  Filter,
  Camera,
  Image as ImageIcon,
  BarChart3,
  Eye,
  MapPin,
  Phone,
  Calendar,
  Package,
} from "lucide-react-native";
import { useMedicines } from "../../hooks/useMedicines";
import { useOrders } from "../../hooks/useOrder";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../constants/Colors";
import { Order, OrderStatus } from '../../types/order'; // Adjust the import path

export default function DoctorPage() {
  const [activeTab, setActiveTab] = useState("statistics");
  const [showAddModal, setShowAddModal] = useState(false);
  // const [editingMedicine, setEditingMedicine] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  // const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const { medicines, addMedicine, updateMedicine, deleteMedicine } =
    useMedicines();
  const { orders, approveOrder, rejectOrder } = useOrders();

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    category: "tablets",
    description: "",
    price: "",
    requiresPrescription: false,
    stock: "",
    image: "",
  });

  const pendingOrders = orders.filter(
    (order) => order.status === "pending_approval"
  );
  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed"
  );
  const rejectedOrders = orders.filter((order) => order.status === "rejected");
  const totalRevenue = confirmedOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (
      !newMedicine.name ||
      !newMedicine.description ||
      !newMedicine.price ||
      !newMedicine.stock ||
      !newMedicine.image
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields including image"
      );
      return;
    }

    addMedicine({
      ...newMedicine,
      id: Date.now().toString(),
      price: parseFloat(newMedicine.price),
      stock: parseInt(newMedicine.stock),
    });

    setNewMedicine({
      name: "",
      category: "tablets",
      description: "",
      price: "",
      requiresPrescription: false,
      stock: "",
      image: "",
    });
    setShowAddModal(false);
    Alert.alert("Success", "Medicine added successfully");
  };

  const handleUpdateMedicine = () => {
    if (
      !editingMedicine.name ||
      !editingMedicine.description ||
      !editingMedicine.price ||
      !editingMedicine.stock ||
      !editingMedicine.image
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields including image"
      );
      return;
    }

    updateMedicine(editingMedicine.id, {
      ...editingMedicine,
      price: parseFloat(editingMedicine.price),
      stock: parseInt(editingMedicine.stock),
    });

    setEditingMedicine(null);
    Alert.alert("Success", "Medicine updated successfully");
  };

  const handleDeleteMedicine = (id: string) => {
    Alert.alert(
      "Delete Medicine",
      "Are you sure you want to delete this medicine?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteMedicine(id);
            Alert.alert("Success", "Medicine deleted successfully");
          },
        },
      ]
    );
  };

  const handleApproveOrder = (orderId: string) => {
    Alert.alert(
      "Approve Order",
      "Are you sure you want to approve this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            approveOrder(orderId);
            Alert.alert(
              "Success",
              "Order approved and notification sent to patient"
            );
          },
        },
      ]
    );
  };

  const handleRejectOrder = (orderId: string) => {
    Alert.alert("Reject Order", "Are you sure you want to reject this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          rejectOrder(orderId);
          Alert.alert("Order Rejected", "Patient will be notified");
        },
      },
    ]);
  };

  const handleImageSelection = (imageUrl: string) => {
    if (isEditingImage && editingMedicine) {
      setEditingMedicine({ ...editingMedicine, image: imageUrl });
    } else {
      setNewMedicine({ ...newMedicine, image: imageUrl });
    }
    setShowImagePicker(false);
    setIsEditingImage(false);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera permission is required to take photos."
        );
        return false;
      }
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Gallery permission is required to select photos."
        );
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const handleSelectFromGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        handleImageSelection(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.");
    }
  };

  const predefinedImages = [
    "https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg",
    "https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg",
    "https://images.pexels.com/photos/3683084/pexels-photo-3683084.jpeg",
    "https://images.pexels.com/photos/4047146/pexels-photo-4047146.jpeg",
    "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg",
    "https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg",
  ];

const handleViewOrderDetails = (order: Order | Partial<Order>) => {
  setSelectedOrder(order as Order);
  setShowOrderDetails(true);
};

  const renderStatisticsTab = () => (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.sectionHeader}>
        <BarChart3 size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>Order Statistics</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{orders.length}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#059669" }]}>
            {confirmedOrders.length}
          </Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#ea580c" }]}>
            {pendingOrders.length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: "#dc2626" }]}>
            {rejectedOrders.length}
          </Text>
          <Text style={styles.statLabel}>Rejected</Text>
        </View>
      </View>

      <View style={styles.revenueCard}>
        <Text style={styles.revenueTitle}>Total Revenue</Text>
        <Text style={styles.revenueAmount}>
          ₹{totalRevenue.toLocaleString()}
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Package size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>All Orders</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No orders found</Text>
        </View>
      ) : (
        orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.orderHeaderRight}>
                <Text
                  style={[
                    styles.orderStatus,
                    order.status === "confirmed" && styles.statusConfirmed,
                    order.status === "pending_approval" && styles.statusPending,
                    order.status === "rejected" && styles.statusRejected,
                  ]}
                >
                  {order.status.replace("_", " ").toUpperCase()}
                </Text>
                <Text style={styles.orderTotal}>₹{order.total}</Text>
              </View>
            </View>

            <View style={styles.orderSummary}>
              <Text style={styles.orderItemsCount}>
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </Text>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => handleViewOrderDetails(order)}
              >
                <Eye size={16} color={colors.primary} />
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderOrdersTab = () => (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.sectionHeader}>
        <Bell size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>
          Pending Approvals ({pendingOrders.length})
        </Text>
      </View>

      {pendingOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No pending orders</Text>
        </View>
      ) : (
        pendingOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.orderDate}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </View>

            {/* Order Items */}
            <View style={styles.orderItems}>
              {order.items
                .filter((item) => item.requiresPrescription)
                .map((item) => (
                  <Text key={item.id} style={styles.orderItem}>
                    • {item.name} x{item.quantity}
                  </Text>
                ))}
            </View>

            {/* ✅ Order Summary Section */}
            <View style={styles.orderSummary}>
              <Text style={styles.orderItemsCount}>
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </Text>
              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => handleViewOrderDetails(order)}
              >
                <Eye size={16} color={colors.primary} />
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>

            {/* Order Actions */}
            <View style={styles.orderActions}>
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => handleApproveOrder(order.id)}
              >
                <Check size={16} color="#ffffff" />
                <Text style={styles.approveButtonText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectButton}
                onPress={() => handleRejectOrder(order.id)}
              >
                <X size={16} color="#ffffff" />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );

  const renderMedicinesTab = () => (
    <ScrollView
      style={styles.tabContent}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.medicinesHeader}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {filteredMedicines.map((medicine) => (
        <View key={medicine.id} style={styles.medicineCard}>
          <View style={styles.medicineInfo}>
            <Text style={styles.medicineName}>{medicine.name}</Text>
            <Text style={styles.medicineCategory}>{medicine.category}</Text>
            <Text style={styles.medicinePrice}>₹{medicine.price}</Text>
            {medicine.requiresPrescription && (
              <Text style={styles.prescriptionBadge}>
                Prescription Required
              </Text>
            )}
            <View style={styles.stockContainer}>
              <Text
                style={[
                  styles.stockText,
                  medicine.stock < 50
                    ? styles.stockLow
                    : medicine.stock < 100
                    ? styles.stockMedium
                    : styles.stockHigh,
                ]}
              >
                Stock: {medicine.stock}
              </Text>
            </View>
          </View>
          <View style={styles.medicineActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditingMedicine(medicine)}
            >
              <Edit size={16} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteMedicine(medicine.id)}
            >
              <Trash2 size={16} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderMedicineModal = (
    medicine: any,
    onSave: () => void,
    onCancel: () => void
  ) => (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            {editingMedicine ? "Edit Medicine" : "Add Medicine"}
          </Text>
          <TouchableOpacity onPress={onSave}>
            <Text style={styles.modalSaveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.imageSection}>
            <Text style={styles.inputLabel}>Medicine Image</Text>
            <TouchableOpacity
              style={styles.imageSelector}
              onPress={() => {
                setIsEditingImage(!!editingMedicine);
                setShowImagePicker(true);
              }}
            >
              {medicine.image ? (
                <Image
                  source={{ uri: medicine.image }}
                  style={styles.selectedImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <ImageIcon size={40} color="#9ca3af" />
                  <Text style={styles.imagePlaceholderText}>Select Image</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.modalInput}
            placeholder="Medicine Name"
            value={medicine.name}
            onChangeText={(text) =>
              editingMedicine
                ? setEditingMedicine({ ...editingMedicine, name: text })
                : setNewMedicine({ ...newMedicine, name: text })
            }
          />

          <View style={styles.categoryContainer}>
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryButtons}>
              {["tablets", "capsules", "syrup", "injection"].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    medicine.category === category &&
                      styles.categoryButtonActive,
                  ]}
                  onPress={() =>
                    editingMedicine
                      ? setEditingMedicine({ ...editingMedicine, category })
                      : setNewMedicine({ ...newMedicine, category })
                  }
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      medicine.category === category &&
                        styles.categoryButtonTextActive,
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TextInput
            style={styles.modalTextArea}
            placeholder="Description"
            value={medicine.description}
            onChangeText={(text) =>
              editingMedicine
                ? setEditingMedicine({ ...editingMedicine, description: text })
                : setNewMedicine({ ...newMedicine, description: text })
            }
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={styles.modalInput}
            placeholder="Price"
            value={medicine.price.toString()}
            onChangeText={(text) =>
              editingMedicine
                ? setEditingMedicine({ ...editingMedicine, price: text })
                : setNewMedicine({ ...newMedicine, price: text })
            }
            keyboardType="numeric"
          />

          <TextInput
            style={styles.modalInput}
            placeholder="Stock Quantity"
            value={medicine.stock.toString()}
            onChangeText={(text) =>
              editingMedicine
                ? setEditingMedicine({ ...editingMedicine, stock: text })
                : setNewMedicine({ ...newMedicine, stock: text })
            }
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.prescriptionToggle}
            onPress={() =>
              editingMedicine
                ? setEditingMedicine({
                    ...editingMedicine,
                    requiresPrescription: !editingMedicine.requiresPrescription,
                  })
                : setNewMedicine({
                    ...newMedicine,
                    requiresPrescription: !newMedicine.requiresPrescription,
                  })
            }
          >
            <View
              style={[
                styles.checkbox,
                medicine.requiresPrescription && styles.checkboxChecked,
              ]}
            >
              {medicine.requiresPrescription && (
                <Check size={16} color="#ffffff" />
              )}
            </View>
            <Text style={styles.prescriptionToggleText}>
              Requires Prescription
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Image Picker Modal */}
        <Modal
          visible={showImagePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowImagePicker(false)}
        >
          <View style={styles.imagePickerOverlay}>
            <View style={styles.imagePickerModalCenter}>
              <View style={styles.imagePickerHeader}>
                <Text style={styles.imagePickerTitle}>
                  Select Medicine Image
                </Text>
                <TouchableOpacity onPress={() => setShowImagePicker(false)}>
                  <X size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.imagePickerContent}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* Take Photo / From Gallery */}
                <View style={styles.cameraGallerySection}>
                  <TouchableOpacity
                    style={styles.cameraGalleryButton}
                    onPress={handleTakePhoto}
                  >
                    <Camera size={32} color={colors.primary} />
                    <Text style={styles.cameraGalleryText}>Take Photo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cameraGalleryButton}
                    onPress={handleSelectFromGallery}
                  >
                    <ImageIcon size={32} color={colors.primary} />
                    <Text style={styles.cameraGalleryText}>From Gallery</Text>
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.sectionDivider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>
                    Or choose from templates
                  </Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Predefined Images */}
                <View style={styles.imageGridContainer}>
                  {predefinedImages.map((imageUrl, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.imageOption}
                      onPress={() => handleImageSelection(imageUrl)}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.imageOptionImage}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );

  const renderOrderDetailsModal = () => (
    <Modal
      visible={showOrderDetails}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowOrderDetails(false)}>
            <Text style={styles.modalCancelText}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Order Details</Text>
          <View style={{ width: 50 }} />
        </View>

        {selectedOrder && (
          <ScrollView
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            <View style={styles.orderDetailsHeader}>
              <Text style={styles.orderDetailsId}>
                Order #{selectedOrder.id}
              </Text>
              <Text
                style={[
                  styles.orderDetailsStatus,
                  selectedOrder.status === "confirmed" &&
                    styles.statusConfirmed,
                  selectedOrder.status === "pending_approval" &&
                    styles.statusPending,
                  selectedOrder.status === "rejected" && styles.statusRejected,
                ]}
              >
                {selectedOrder.status.replace("_", " ").toUpperCase()}
              </Text>
            </View>

            <View style={styles.orderDetailsSection}>
              <View style={styles.sectionHeaderSmall}>
                <Calendar size={16} color="#6b7280" />
                <Text style={styles.sectionTitleSmall}>Order Information</Text>
              </View>
              <Text style={styles.orderDetailsText}>
                Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.orderDetailsText}>
                Payment:{" "}
                {selectedOrder.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Online Payment"}
              </Text>
              {selectedOrder.needsPrescription && (
                <Text style={styles.prescriptionNote}>
                  ⚠️ Prescription Required
                </Text>
              )}
            </View>

            <View style={styles.orderDetailsSection}>
              <View style={styles.sectionHeaderSmall}>
                <MapPin size={16} color="#6b7280" />
                <Text style={styles.sectionTitleSmall}>Delivery Address</Text>
              </View>
              <Text style={styles.addressText}>
                {selectedOrder.address.street}
              </Text>
              <Text style={styles.addressText}>
                {selectedOrder.address.city}, {selectedOrder.address.state}
              </Text>
              <Text style={styles.addressText}>
                PIN: {selectedOrder.address.pincode}
              </Text>
              <View style={styles.phoneContainer}>
                <Phone size={14} color="#6b7280" />
                <Text style={styles.phoneText}>
                  {selectedOrder.address.phone}
                </Text>
              </View>
            </View>

            <View style={styles.orderDetailsSection}>
              <View style={styles.sectionHeaderSmall}>
                <Package size={16} color="#6b7280" />
                <Text style={styles.sectionTitleSmall}>Items Ordered</Text>
              </View>
              {selectedOrder.items.map((item) => (
                <View key={item.id} style={styles.orderItemDetail}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.orderItemImage}
                  />
                  <View style={styles.orderItemInfo}>
                    <Text style={styles.orderItemName}>{item.name}</Text>
                    <Text style={styles.orderItemCategory}>
                      {item.category}
                    </Text>
                    <Text style={styles.orderItemQuantity}>
                      Qty: {item.quantity}
                    </Text>
                    {item.requiresPrescription && (
                      <Text style={styles.prescriptionBadgeSmall}>
                        Prescription Required
                      </Text>
                    )}
                  </View>
                  <View style={styles.orderItemPricing}>
                    {item.discount && (
                      <Text style={styles.orderItemOriginalPrice}>
                        ₹{item.price * item.quantity}
                      </Text>
                    )}
                    <Text style={styles.orderItemPrice}>
                      ₹
                      {item.discount
                        ? Math.round(item.price * (1 - item.discount / 100)) *
                          item.quantity
                        : item.price * item.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.orderDetailsSection}>
              <Text style={styles.sectionTitleSmall}>Bill Summary</Text>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Subtotal:</Text>
                <Text style={styles.billValue}>₹{selectedOrder.subtotal}</Text>
              </View>
              {selectedOrder.discount > 0 && (
                <View style={styles.billRow}>
                  <Text style={[styles.billLabel, { color: "#059669" }]}>
                    Discount:
                  </Text>
                  <Text style={[styles.billValue, { color: "#059669" }]}>
                    -₹{selectedOrder.discount}
                  </Text>
                </View>
              )}
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>GST (18%):</Text>
                <Text style={styles.billValue}>₹{selectedOrder.gst}</Text>
              </View>
              <View style={styles.billDivider} />
              <View style={styles.billRow}>
                <Text style={styles.billTotalLabel}>Total Amount:</Text>
                <Text style={styles.billTotalValue}>
                  ₹{selectedOrder.total}
                </Text>
              </View>
            </View>

            {selectedOrder.status === "pending_approval" && (
              <View style={styles.orderActions}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => {
                    handleApproveOrder(selectedOrder.id);
                    setShowOrderDetails(false);
                  }}
                >
                  <Check size={16} color="#ffffff" />
                  <Text style={styles.approveButtonText}>Approve Order</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => {
                    handleRejectOrder(selectedOrder.id);
                    setShowOrderDetails(false);
                  }}
                >
                  <X size={16} color="#ffffff" />
                  <Text style={styles.rejectButtonText}>Reject Order</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Doctor Dashboard</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "statistics" && styles.tabActive]}
          onPress={() => setActiveTab("statistics")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "statistics" && styles.tabTextActive,
            ]}
          >
            Statistics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "orders" && styles.tabActive]}
          onPress={() => setActiveTab("orders")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "orders" && styles.tabTextActive,
            ]}
          >
            Pending ({pendingOrders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "medicines" && styles.tabActive]}
          onPress={() => setActiveTab("medicines")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "medicines" && styles.tabTextActive,
            ]}
          >
            Medicines
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "statistics" && renderStatisticsTab()}
      {activeTab === "orders" && renderOrdersTab()}
      {activeTab === "medicines" && renderMedicinesTab()}

      {showAddModal &&
        renderMedicineModal(newMedicine, handleAddMedicine, () =>
          setShowAddModal(false)
        )}

      {editingMedicine &&
        renderMedicineModal(editingMedicine, handleUpdateMedicine, () =>
          setEditingMedicine(null)
        )}

      {renderOrderDetailsModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingBottom: 10,
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6b7280",
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,

    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  orderDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  orderActions: {
    flexDirection: "row",
    gap: 12,
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#059669",
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  approveButtonText: {
    color: "#ffffff",
    fontWeight: "500",
    marginLeft: 6,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#dc2626",
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectButtonText: {
    color: "#ffffff",
    fontWeight: "500",
    marginLeft: 6,
  },
  medicinesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  medicineCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  medicineCategory: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  medicinePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 4,
  },
  prescriptionBadge: {
    fontSize: 10,
    color: "#dc2626",
    fontWeight: "500",
  },
  medicineActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#fef2f2",
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#6b7280",
  },
  modalSaveText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonText: {
    color: "#6b7280",
    fontWeight: "500",
  },
  categoryButtonTextActive: {
    color: "#ffffff",
  },
  prescriptionToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#d1d5db",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  prescriptionToggleText: {
    fontSize: 16,
    color: "#374151",
  },
  imageSection: {
    marginBottom: 16,
  },
  imageSelector: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 8,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: "#9ca3af",
  },
  imagePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center", // center vertically
    alignItems: "center", // center horizontally
    paddingHorizontal: 20,
  },
  imagePickerModalCenter: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    width: "100%", // ensures modal fits on small screens
    overflow: "hidden",
  },
  imagePickerModal: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  imagePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  imageGrid: {
    flex: 1,
  },
  imageGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 12,
  },
  imageOption: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
  },
  imageOptionImage: {
    width: "100%",
    height: "100%",
  },
  cameraGallerySection: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cameraGalleryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
    minWidth: 120,
  },
  cameraGalleryText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  dividerText: {
    marginHorizontal: 15,
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  stockContainer: {
    marginTop: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "500",
  },
  stockHigh: {
    color: "#059669",
  },
  stockMedium: {
    color: "#ea580c",
  },
  stockLow: {
    color: "#dc2626",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  revenueCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  revenueTitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#059669",
  },
  orderHeaderRight: {
    alignItems: "flex-end",
  },
  orderStatus: {
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  orderSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  orderItemsCount: {
    fontSize: 14,
    color: "#6b7280",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewDetailsText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "500",
    marginLeft: 4,
  },
  orderDetailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  orderDetailsId: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  orderDetailsStatus: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  orderDetailsSection: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeaderSmall: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleSmall: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginLeft: 8,
  },
  orderDetailsText: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  prescriptionNote: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "500",
    marginTop: 8,
  },
  addressText: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 2,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  phoneText: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 6,
  },
  orderItemDetail: {
    flexDirection: "row",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  orderItemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
  },
  orderItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 2,
  },
  orderItemCategory: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
    textTransform: "capitalize",
  },
  orderItemQuantity: {
    fontSize: 12,
    color: "#4b5563",
  },
  prescriptionBadgeSmall: {
    fontSize: 10,
    color: "#dc2626",
    fontWeight: "500",
    marginTop: 2,
  },
  orderItemPricing: {
    alignItems: "flex-end",
  },
  orderItemOriginalPrice: {
    fontSize: 12,
    color: "#6b7280",
    textDecorationLine: "line-through",
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#059669",
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  billLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  billValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  billDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
  },
  billTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
  },

  statusConfirmed: {
    color: "#10B981", // Green color for confirmed
  },

  statusPending: {
    color: "#F59E0B", // Amber/Orange color for pending
  },

  statusRejected: {
    color: "#EF4444", // Red color for rejected
  },
  imagePickerContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    // If you want horizontal scrolling instead of vertical:
    // flexDirection: 'row',
  },
});
