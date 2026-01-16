import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'Create Account'
        }}
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'Reset Password'
        }}
      />
    </Stack>
  );
}

////////////////////////////////////New Code Below////////////////////////////////////
