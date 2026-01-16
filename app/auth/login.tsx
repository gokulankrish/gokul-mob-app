// ////////////////////////////////////New Code Below////////////////////////////////////


// app/auth/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
    }
  };

  const handleDemoLogin = async (role: 'doctor' | 'patient') => {
    setLoading(true);
    const result = await demoLogin(role);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Demo Login Failed', 'Please check your internet connection');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8fafc', '#e0f2fe']}
        style={styles.background}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={[Colors.primary, '#3b82f6']}
                  style={styles.logoGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="medical" size={40} color="white" />
                </LinearGradient>
              </View>
              
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in for App
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <View style={styles.form}>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabel}>
                    <Ionicons name="mail-outline" size={18} color={Colors.primary} style={styles.inputIcon} />
                    <Text style={styles.label}>Email Address</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="john.doe@example.com"
                      placeholderTextColor={Colors.placeholder}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      editable={!loading}
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.inputLabel}>
                    <Ionicons name="lock-closed-outline" size={18} color={Colors.primary} style={styles.inputIcon} />
                    <Text style={styles.label}>Password</Text>
                  </View>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="••••••••"
                      placeholderTextColor={Colors.placeholder}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={22}
                        color={Colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, loading && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={[Colors.primary, '#3b82f6']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Ionicons name="log-in-outline" size={22} color="white" />
                        <Text style={styles.buttonText}>Sign In</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}


                {/* Sign Up Link */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account? </Text>
                  <TouchableOpacity 
                    onPress={() => router.push('/auth/signup')}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.signupLink}>Sign up now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: height,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  inputWrapper: {
    position: 'relative',
    backgroundColor: Colors.lightBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.7,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: '500',
  },
  demoContainer: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  demoButtons: {
    gap: 12,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorButton: {
    backgroundColor: '#10b981',
  },
  patientButton: {
    backgroundColor: Colors.primary,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  demoHint: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    color: Colors.textLight,
    fontSize: 15,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});