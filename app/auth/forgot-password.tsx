import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../constants/Colors';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ForgotPasswordScreen() {
  const { resetPassword, error, clearError, loading } = useAuth();
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    clearError();
    const result = await resetPassword(email);

    if (result.success) {
      Alert.alert(
        'Email Sent',
        'Password reset instructions have been sent to your email.',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Ionicons name="lock-closed" size={60} color={Colors.primary} />
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email to receive password reset instructions
        </Text>
      </View>

      <View style={styles.form}>
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color={Colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your registered email"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <Button
          title="Send Reset Instructions"
          onPress={handleResetPassword}
          loading={loading}
          disabled={loading}
        />

        <View style={styles.backLink}>
          <Text 
            style={styles.linkText}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={16} color={Colors.primary} />
            {' '}Back to Login
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
    marginTop: 60,
    marginBottom: 40,
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
    marginTop: 8,
    lineHeight: 22,
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
  backLink: {
    alignItems: 'center',
    marginTop: 30,
  },
  linkText: {
    color: Colors.primary,
    fontSize: 16,
  },
});