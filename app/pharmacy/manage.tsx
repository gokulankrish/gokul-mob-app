import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, ShoppingBag, Settings, LogOut } from 'lucide-react-native';
import { useOrders } from '../../hooks/useOrder';
import { colors } from '../../constants/Colors';

export default function ProfilePage() {
  const { orders } = useOrders();
  
  const confirmedOrders = orders.filter(order => order.status === 'confirmed');
  const pendingOrders = orders.filter(order => order.status === 'pending_approval');
  const rejectedOrders = orders.filter(order => order.status === 'rejected');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User size={40} color={colors.primary} />
          </View>
          <Text style={styles.userName}>Dr Aafrin</Text>
          <Text style={styles.userEmail}>aafrin@example.com</Text>
        </View>
        
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Order Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{confirmedOrders.length}</Text>
              <Text style={styles.statLabel}>Completed Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#ea580c' }]}>{pendingOrders.length}</Text>
              <Text style={styles.statLabel}>Pending Approval</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#dc2626' }]}>{rejectedOrders.length}</Text>
              <Text style={styles.statLabel}>Rejected</Text>
            </View>
          </View>
        </View>

        
        <View style={styles.recentOrders}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          {orders.slice(0, 3).map(order => (
            <View key={order.id} style={styles.orderItem}>
              <View>
                <Text style={styles.orderText}>Order #{order.id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.orderStatus}>
                <Text style={[
                  styles.statusText,
                  order.status === 'confirmed' && styles.statusConfirmed,
                  order.status === 'pending_approval' && styles.statusPending,
                  order.status === 'rejected' && styles.statusRejected,
                ]}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </Text>
                <Text style={styles.orderTotal}>₹{order.total}</Text>
              </View>
            </View>
          ))}
        </View>
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
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#eff6ff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 16,
  },
  recentOrders: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  orderDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  orderStatus: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusConfirmed: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  statusRejected: {
    backgroundColor: '#fecaca',
    color: '#dc2626',
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
    marginTop: 4,
  },
});