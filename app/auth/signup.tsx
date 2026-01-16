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
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function SignupScreen() {
  const { signUp, error, clearError, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient'>(USER_ROLES.PATIENT);

  const handleSignup = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    clearError();
    const result = await signUp(email, password, {
      name,
      role,
      phone
    });

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Ionicons name="person-add" size={60} color={Colors.primary} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Dental our community</Text>
      </View>

      <View style={styles.form}>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Input
          label="Full Name *"
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          editable={!loading}
        />

        <Input
          label="Email Address *"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <Input
          label="Phone Number (Optional)"
          value={phone}
          onChangeText={setPhone}
          placeholder="+1 (555) 123-4567"
          keyboardType="phone-pad"
          editable={!loading}
        />

        <View style={styles.roleSection}>
          <Text style={styles.label}>I am a: *</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === USER_ROLES.DOCTOR && styles.roleButtonActive
              ]}
              onPress={() => setRole(USER_ROLES.DOCTOR)}
              disabled={loading}
            >
              <Ionicons 
                name="medkit" 
                size={20} 
                color={role === USER_ROLES.DOCTOR ? Colors.white : Colors.primary} 
              />
              <Text style={[
                styles.roleButtonText,
                role === USER_ROLES.DOCTOR && styles.roleButtonTextActive
              ]}>
                Doctor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === USER_ROLES.PATIENT && styles.roleButtonActive
              ]}
              onPress={() => setRole(USER_ROLES.PATIENT)}
              disabled={loading}
            >
              <Ionicons 
                name="person" 
                size={20} 
                color={role === USER_ROLES.PATIENT ? Colors.white : Colors.primary} 
              />
              <Text style={[
                styles.roleButtonText,
                role === USER_ROLES.PATIENT && styles.roleButtonTextActive
              ]}>
                Patient
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Input
          label="Password *"
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password (min 6 characters)"
          secureTextEntry
          editable={!loading}
        />

        <Input
          label="Confirm Password *"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter your password"
          secureTextEntry
          editable={!loading}
        />

        <Button
          title="Create Account"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.loginLink}>
          <Text 
            style={styles.linkText}
            onPress={() => router.back()}
          >
            Already have an account? <Text style={styles.linkBold}>Login</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 5,
  },
  form: {
    marginTop: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    flex: 1,
  },
  roleSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: Colors.white,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: Colors.textLight,
    fontSize: 16,
  },
  linkBold: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

