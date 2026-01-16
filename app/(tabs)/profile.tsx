import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../constants/Colors';
import { USER_ROLES } from '../../constants/Config';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ProfileScreen() {
  const { user, userData, logout, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [specialty, setSpecialty] = useState(userData?.specialty || '');
  const [experience, setExperience] = useState(userData?.experience || '');

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              router.replace('/auth/login');
            } else {
              Alert.alert('Error', result.error || 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const result = await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      specialty: specialty.trim(),
      experience: experience.trim()
    });

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } else {
      Alert.alert('Error', result.error || 'Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setName(userData?.name || '');
    setPhone(userData?.phone || '');
    setSpecialty(userData?.specialty || '');
    setExperience(userData?.experience || '');
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Avatar 
          name={userData?.name || ''}
          size={100}
          textSize={36}
        />
        <Text style={styles.name}>{userData?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[
          styles.roleBadge,
          userData?.role === USER_ROLES.DOCTOR 
            ? styles.doctorBadge 
            : styles.patientBadge
        ]}>
          <Text style={[
            styles.roleText,
            userData?.role === USER_ROLES.DOCTOR 
              ? styles.doctorText 
              : styles.patientText
          ]}>
            {userData?.role === USER_ROLES.DOCTOR ? '👨‍⚕️ Doctor' : '👤 Patient'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        {isEditing ? (
          <>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              editable={!loading}
            />

            <Input
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              editable={!loading}
            />

            {userData?.role === USER_ROLES.DOCTOR && (
              <>
                <Input
                  label="Specialty"
                  value={specialty}
                  onChangeText={setSpecialty}
                  placeholder="e.g., General Dentistry"
                  editable={!loading}
                />

                <Input
                  label="Experience"
                  value={experience}
                  onChangeText={setExperience}
                  placeholder="e.g., 10 years"
                  editable={!loading}
                />
              </>
            )}
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{userData?.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{userData?.phone || 'Not set'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role:</Text>
              <Text style={styles.infoValue}>
                {userData?.role === USER_ROLES.DOCTOR ? 'Doctor' : 'Patient'}
              </Text>
            </View>

            {userData?.role === USER_ROLES.DOCTOR && userData?.specialty && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Specialty:</Text>
                <Text style={styles.infoValue}>{userData.specialty}</Text>
              </View>
            )}

            {userData?.role === USER_ROLES.DOCTOR && userData?.experience && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Experience:</Text>
                <Text style={styles.infoValue}>{userData.experience}</Text>
              </View>
            )}
          </>
        )}

        {isEditing ? (
          <View style={styles.editButtons}>
            <Button
              title="Cancel"
              onPress={handleCancelEdit}
              variant="secondary"
              disabled={loading}
              style={styles.editButton}
            />
            <Button
              title="Save Changes"
              onPress={handleSaveProfile}
              loading={loading}
              disabled={loading}
              style={styles.editButton}
            />
          </View>
        ) : (
          <Button
            title="Edit Profile"
            onPress={() => setIsEditing(true)}
            style={styles.editButton}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Actions</Text>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="key" size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} Color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="notifications" size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} Color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="shield" size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} Color={Colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-text" size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} Color={Colors.gray} />
        </TouchableOpacity>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="danger"
        icon={<Ionicons name="log-out" size={20} color={Colors.white} />}
        style={styles.logoutButton}
      />

      <View style={styles.footer}>
        <Text style={styles.version}>Dental Chat v1.0.0</Text>
        <Text style={styles.copyright}>© 2024 Dental Health Solutions</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 15,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: Colors.textLight,
    marginBottom: 10,
  },
  roleBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 5,
  },
  doctorBadge: {
    backgroundColor: Colors.doctorBadge,
  },
  patientBadge: {
    backgroundColor: Colors.patientBadge,
  },
  roleText: {
    fontWeight: '600',
    fontSize: 14,
  },
  doctorText: {
    color: Colors.success,
  },
  patientText: {
    color: Colors.warning,
  },
  section: {
    backgroundColor: Colors.white,
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.textLight,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
    flex: 2,
    textAlign: 'right',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  editButton: {
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  logoutButton: {
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  version: {
    color: Colors.textLight,
    marginBottom: 5,
    fontSize: 14,
  },
  copyright: {
    color: Colors.textLight,
    fontSize: 12,
  },
});

