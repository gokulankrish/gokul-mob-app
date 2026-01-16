
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { MapPin, CreditCard, FileText, Upload, CircleCheck as CheckCircle, ArrowLeft, Camera, Image as ImageIcon, Receipt } from 'lucide-react-native';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '../../hooks/useOrder';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../constants/Colors';

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [prescriptionImages, setPrescriptionImages] = useState<string[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return false;
      }
    }
    return true;
  };

  const requestGalleryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Gallery permission is required to select photos.');
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
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPrescriptionImages([...prescriptionImages, result.assets[0].uri]);
        setShowImagePicker(false);
        Alert.alert('Success', 'Prescription image captured successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handleSelectFromGallery = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPrescriptionImages([...prescriptionImages, result.assets[0].uri]);
        setShowImagePicker(false);
        Alert.alert('Success', 'Prescription image selected successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const prescriptionItems = cartItems.filter(item => item.requiresPrescription);
  const needsPrescription = prescriptionItems.length > 0;

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discount 
        ? Math.round(item.price * (1 - item.discount / 100))
        : item.price;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      if (item.discount) {
        const discountAmount = Math.round(item.price * (item.discount / 100));
        return total + (discountAmount * item.quantity);
      }
      return total;
    }, 0);
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.18); // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate address
      if (!address.street || !address.city || !address.state || !address.pincode || !address.phone) {
        Alert.alert('Incomplete Address', 'Please fill in all address fields.');
        return;
      }
    } else if (currentStep === 2) {
      // Payment step - no validation needed for COD
    } else if (currentStep === 3 && needsPrescription) {
      // Prescription step
      if (prescriptionImages.length === 0) {
        Alert.alert('Prescription Required', 'Please upload at least one prescription image to continue.');
        return;
      }
    }
    
    if (currentStep < (needsPrescription ? 4 : 3)) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePlaceOrder();
    }
  };

const handlePlaceOrder = () => {
  const order = {
    id: Date.now().toString(),
    items: cartItems,
    subtotal: calculateSubtotal(),
    discount: calculateDiscount(),
    gst: calculateGST(),
    total: calculateTotal(),
    address,
    paymentMethod,
    status: (needsPrescription ? 'pending_approval' : 'confirmed') as 'pending_approval' | 'confirmed' | 'rejected',
    needsPrescription,
    prescriptionUploaded: prescriptionImages.length > 0,
    createdAt: new Date().toISOString(),
  };

  addOrder(order);
  clearCart();
  
  Alert.alert(
    'Order Placed Successfully!',
    needsPrescription 
      ? 'Your order is pending doctor approval. You will receive a notification once approved.'
      : 'Your order has been confirmed and will be processed shortly.',
    [
      { text: 'OK', onPress: () => router.replace('/') }
    ]
  );
};

  const handleImageUpload = (source: 'camera' | 'gallery') => {
    if (source === 'camera') {
      handleTakePhoto();
    } else {
      handleSelectFromGallery();
    }
  };

  const removePrescriptionImage = (index: number) => {
    const newImages = prescriptionImages.filter((_, i) => i !== index);
    setPrescriptionImages(newImages);
  };

  const renderStepIndicator = () => {
    const totalSteps = needsPrescription ? 4 : 3;
    return (
      <View style={styles.stepIndicator}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={[
              styles.stepCircle,
              currentStep > i + 1 ? styles.stepCompleted :
              currentStep === i + 1 ? styles.stepActive : styles.stepInactive
            ]}>
              {currentStep > i + 1 ? (
                <CheckCircle size={16} color="#ffffff" />
              ) : (
                <Text style={[
                  styles.stepNumber,
                  currentStep === i + 1 ? styles.stepNumberActive : styles.stepNumberInactive
                ]}>{i + 1}</Text>
              )}
            </View>
            {i < totalSteps - 1 && <View style={styles.stepLine} />}
          </View>
        ))}
      </View>
    );
  };

  const renderAddressStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <MapPin size={24} color={colors.primary} />
        <Text style={styles.stepTitle}>Delivery Address</Text>
      </View>
      
      <TextInput
        style={styles.input}
        placeholder="Street Address"
        value={address.street}
        onChangeText={(text) => setAddress({...address, street: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={address.city}
        onChangeText={(text) => setAddress({...address, city: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="State"
        value={address.state}
        onChangeText={(text) => setAddress({...address, state: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="PIN Code"
        value={address.pincode}
        onChangeText={(text) => setAddress({...address, pincode: text})}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={address.phone}
        onChangeText={(text) => setAddress({...address, phone: text})}
        keyboardType="phone-pad"
      />
    </View>
  );

  const renderPaymentStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <CreditCard size={24} color={colors.primary} />
        <Text style={styles.stepTitle}>Payment Method</Text>
      </View>
      
      <TouchableOpacity
        style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionSelected]}
        onPress={() => setPaymentMethod('cod')}
      >
        <View style={styles.radioButton}>
          {paymentMethod === 'cod' && <View style={styles.radioButtonSelected} />}
        </View>
        <Text style={styles.paymentOptionText}>Cash on Delivery</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.paymentOption, paymentMethod === 'online' && styles.paymentOptionSelected]}
        onPress={() => setPaymentMethod('online')}
      >
        <View style={styles.radioButton}>
          {paymentMethod === 'online' && <View style={styles.radioButtonSelected} />}
        </View>
        <Text style={styles.paymentOptionText}>Online Payment</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPrescriptionStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <FileText size={24} color={colors.primary} />
        <Text style={styles.stepTitle}>Upload Prescription</Text>
      </View>
      
      <Text style={styles.prescriptionNote}>
        The following medicines require a prescription:
      </Text>
      
      {prescriptionItems.map(item => (
        <View key={item.id} style={styles.prescriptionItem}>
          <Image source={{ uri: item.image }} style={styles.prescriptionItemImage} />
          <Text style={styles.prescriptionItemName}>{item.name}</Text>
        </View>
      ))}
      
      <Text style={styles.uploadInstructions}>
        Please upload clear images of your prescription(s):
      </Text>
      
      {prescriptionImages.length > 0 && (
        <View style={styles.uploadedImages}>
          {prescriptionImages.map((imageUri, index) => (
            <View key={index} style={styles.uploadedImageContainer}>
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removePrescriptionImage(index)}
              >
                <Text style={styles.removeImageText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={() => setShowImagePicker(true)}
      >
        <Upload size={20} color="#6b7280" />
        <Text style={styles.uploadButtonText}>
          Add Prescription Image
        </Text>
      </TouchableOpacity>
      
      {/* Image Picker Modal */}
      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.imagePickerModal}>
            <Text style={styles.imagePickerTitle}>Select Image Source</Text>
            
            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={() => handleImageUpload('camera')}
            >
              <Camera size={24} color={colors.primary} />
              <Text style={styles.imagePickerOptionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={() => handleImageUpload('gallery')}
            >
              <ImageIcon size={24} color={colors.primary} />
              <Text style={styles.imagePickerOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.imagePickerCancel}
              onPress={() => setShowImagePicker(false)}
            >
              <Text style={styles.imagePickerCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  const renderReviewStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <CheckCircle size={24} color={colors.primary} />
        <Text style={styles.stepTitle}>Review Order</Text>
      </View>
      
      <View style={styles.orderSummary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        {cartItems.map(item => (
          <View key={item.id} style={styles.summaryItem}>
            <View style={styles.summaryItemInfo}>
              <Text style={styles.summaryItemName}>{item.name} x{item.quantity}</Text>
              {item.discount && (
                <Text style={styles.summaryItemDiscount}>{item.discount}% OFF</Text>
              )}
            </View>
            <View style={styles.summaryItemPrices}>
              {item.discount && (
                <Text style={styles.summaryItemOriginalPrice}>₹{item.price * item.quantity}</Text>
              )}
              <Text style={styles.summaryItemPrice}>
                ₹{item.discount 
                  ? Math.round(item.price * (1 - item.discount / 100)) * item.quantity
                  : item.price * item.quantity}
              </Text>
            </View>
          </View>
        ))}
        
        <View style={styles.billingSummary}>
          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>Subtotal:</Text>
            <Text style={styles.billingValue}>₹{calculateSubtotal()}</Text>
          </View>
          
          {calculateDiscount() > 0 && (
            <View style={styles.billingRow}>
              <Text style={[styles.billingLabel, styles.discountLabel]}>Discount:</Text>
              <Text style={[styles.billingValue, styles.discountValue]}>-₹{calculateDiscount()}</Text>
            </View>
          )}
          
          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>GST (18%):</Text>
            <Text style={styles.billingValue}>₹{calculateGST()}</Text>
          </View>
          
          <View style={styles.billingDivider} />
          
          <View style={styles.billingRow}>
            <Text style={styles.billingTotalLabel}>Total Amount:</Text>
            <Text style={styles.billingTotalValue}>₹{calculateTotal()}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Checkout',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        {renderStepIndicator()}
        
        <ScrollView style={styles.content}>
          {currentStep === 1 && renderAddressStep()}
          {currentStep === 2 && renderPaymentStep()}
          {currentStep === 3 && needsPrescription && renderPrescriptionStep()}
          {((currentStep === 3 && !needsPrescription) || (currentStep === 4 && needsPrescription)) && renderReviewStep()}
        </ScrollView>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNextStep}
          >
            <Text style={styles.nextButtonText}>
              {((currentStep === 3 && !needsPrescription) || (currentStep === 4 && needsPrescription)) ? 'Place Order' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCompleted: {
    backgroundColor: '#059669',
  },
  stepActive: {
    backgroundColor: colors.primary,
  },
  stepInactive: {
    backgroundColor: '#e5e7eb',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: '#ffffff',
  },
  stepNumberInactive: {
    color: '#6b7280',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 10,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  paymentOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#eff6ff',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#1f2937',
  },
  prescriptionNote: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 15,
  },
  prescriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  prescriptionItemImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  prescriptionItemName: {
    fontSize: 14,
    color: '#1f2937',
  },
  uploadInstructions: {
    fontSize: 14,
    color: '#374151',
    marginTop: 20,
    marginBottom: 15,
    fontWeight: '500',
  },
  uploadedImages: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  uploadedImageContainer: {
    position: 'relative',
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  imagePickerModal: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePickerOptionText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 16,
  },
  imagePickerCancel: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  imagePickerCancelText: {
    fontSize: 16,
    color: '#6b7280',
  },
  orderSummary: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  summaryItemInfo: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: 14,
    color: '#4b5563',
  },
  summaryItemDiscount: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginTop: 2,
  },
  summaryItemPrices: {
    alignItems: 'flex-end',
  },
  summaryItemOriginalPrice: {
    fontSize: 12,
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  billingSummary: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 8,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  billingLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  billingValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  discountLabel: {
    color: '#059669',
  },
  discountValue: {
    color: '#059669',
  },
  billingDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  billingTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  billingTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  footer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});