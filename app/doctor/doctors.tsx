import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../../constants/Colors';

export default function DoctorProfile() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentWrapper}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
              }}
              style={styles.profileImage}
            />
            <Text style={styles.doctorName}>Dr. Aafirin ()</Text>
            <Text style={styles.specialty}>Pedodontist</Text>
            <Text style={styles.hospital}>Aafirin Medical Center,CBE</Text>
          </View>

          {/* About Section */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.infoText}>
              Dr. Aafirin is a dedicated dental specialist known for delivering
              precise, patient-focused care using modern techniques. With
              expertise in cosmetic and restorative dentistry, they craft
              confident smiles that last a lifetime
            </Text>
          </View>

          {/* Experience */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <Text style={styles.infoText}>5+ Years</Text>
          </View>

          {/* Reviews */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Text style={styles.infoText}>
              ⭐⭐⭐⭐⭐ (4.9) from 120 patients
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
            >
              <Text style={[styles.buttonText, { color: colors.white }]}>
                Book Appointment
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.outlineButton]}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                Message
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    
    
  },

  scrollContent: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    width: '100%',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  doctorName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 6,
  },
  specialty: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 4,
  },
  hospital: {
    fontSize: 14,
    color: colors.textLight,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
