import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, ShoppingCart, Plus, Tag, Percent } from 'lucide-react-native';
import { useCart } from '@/hooks/useCart';
import { useMedicines } from '../../hooks/useMedicines';
import { useRouter } from 'expo-router'; // 👈 import router
import { colors } from '../../constants/Colors';

export default function PharmacyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  const [filterAnimation] = useState(new Animated.Value(0));
  const { addToCart, cartCount, cartItems, updateQuantity, removeFromCart } = useCart();
  const { medicines } = useMedicines();
  const router = useRouter(); // 👈 initialize router

  const [medicineAnimations] = useState(
    (medicines || []).reduce((acc, medicine) => {
      acc[medicine.id] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  const categories = ['all', 'tablets', 'capsules', 'syrup', 'injection'];

  const filteredMedicines = useMemo(() => {
    return medicines.filter(medicine => {
      const matchesSearch =
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        medicine.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || medicine.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFilter = () => {
    const toValue = showFilter ? 0 : 1;
    setShowFilter(!showFilter);

    Animated.timing(filterAnimation, {
      toValue,
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  };

  const animateAddToCart = (medicineId: string) => {
    const animation = medicineAnimations[medicineId];

    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToCart = (medicine: any) => {
    animateAddToCart(medicine.id);
    addToCart(medicine);
    Alert.alert('Success', `${medicine.name} added to cart!`);
  };

  const getItemQuantity = (medicineId: string) => {
    const item = cartItems.find(item => item.id === medicineId);
    return item ? item.quantity : 0;
  };

  const handleIncrement = (medicine: any) => {
    const currentQuantity = getItemQuantity(medicine.id);
    if (currentQuantity === 0) {
      addToCart(medicine);
    } else {
      updateQuantity(medicine.id, currentQuantity + 1);
    }
    animateAddToCart(medicine.id);
  };

  const handleDecrement = (medicineId: string) => {
    const currentQuantity = getItemQuantity(medicineId);
    if (currentQuantity > 1) {
      updateQuantity(medicineId, currentQuantity - 1);
    } else if (currentQuantity === 1) {
      removeFromCart(medicineId);
    }
  };

  const filterHeight = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const filterOpacity = filterAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pharmacy</Text>
        <View style={styles.headerRight}>
          <View style={styles.saleTag}>
            <Percent size={12} color="#ffffff" />
            <Text style={styles.saleText}>SALE</Text>
          </View>

          {/* Cart Button with Navigation */}
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/(tabs)/cart')}
            activeOpacity={0.7}
          >
            <ShoppingCart size={24} color={colors.primary} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Discount Banner */}
      <View style={styles.discountBanner}>
        <Tag size={16} color="#dc2626" />
        <Text style={styles.discountText}>Up to 20% OFF on selected medicines!</Text>
      </View>

      {/* Search + Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, showFilter && styles.filterButtonActive]}
          onPress={toggleFilter}
        >
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Categories */}
      <Animated.View
        style={[
          styles.categoryContainer,
          {
            height: filterHeight,
            opacity: filterOpacity,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Medicine List */}
      <ScrollView style={styles.medicineList}>
        {filteredMedicines.map(medicine => (
          <Animated.View
            key={medicine.id}
            style={[
              styles.medicineCard,
              {
                transform: [{ scale: medicineAnimations[medicine.id] }],
              },
            ]}
          >
            <Image source={{ uri: medicine.image }} style={styles.medicineImage} />
            {medicine.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>{medicine.discount}% OFF</Text>
              </View>
            )}
            <View style={styles.medicineInfo}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.medicineCategory}>{medicine.category}</Text>
              <Text style={styles.medicineDescription}>{medicine.description}</Text>
              <View style={styles.medicineFooter}>
                <View>
                  <View style={styles.priceContainer}>
                    {medicine.discount && (
                      <Text style={styles.originalPrice}>₹{medicine.price}</Text>
                    )}
                    <Text style={styles.medicinePrice}>
                      ₹
                      {medicine.discount
                        ? Math.round(medicine.price * (1 - medicine.discount / 100))
                        : medicine.price}
                    </Text>
                  </View>
                  {medicine.requiresPrescription && (
                    <Text style={styles.prescriptionRequired}>
                      Prescription Required
                    </Text>
                  )}
                </View>
                {getItemQuantity(medicine.id) === 0 ? (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(medicine)}
                  >
                    <Plus size={20} color="#ffffff" />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleDecrement(medicine.id)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {getItemQuantity(medicine.id)}
                    </Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleIncrement(medicine)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  saleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  saleText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cartButton: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discountBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  discountText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    marginLeft: 15,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryContainer: {
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    color: '#6b7280',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#ffffff',
  },
  medicineList: {
    flex: 1,
    padding: 20,
  },
  medicineCard: {
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  medicineImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#dc2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 1,
  },
  discountBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  medicineInfo: {
    flex: 1,
    marginLeft: 15,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  medicineCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  medicineDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  medicineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'line-through',
  },
  medicinePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  prescriptionRequired: {
    fontSize: 10,
    color: '#dc2626',
    fontWeight: '500',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    minWidth: 20,
    textAlign: 'center',
  },
});
