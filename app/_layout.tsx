// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { Colors } from '../constants/Colors';

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <Stack
//         screenOptions={{
//           headerStyle: {
//             backgroundColor: Colors.primary,
//           },
//           headerTintColor: Colors.white,
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//           contentStyle: {
//             backgroundColor: Colors.background,
//           },
//         }}
//       >
//         <Stack.Screen 
//           name="index" 
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen 
//           name="auth" 
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen 
//           name="(tabs)" 
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen 
//           name="chat/[id]" 
//           options={{ 
//             title: 'Chat',
//             headerBackTitle: 'Back'
//           }}
//         />
//       </Stack>
//       <StatusBar style="light" />
//     </SafeAreaProvider>
//   );
// }


import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
 // Adjust path as needed
import { AppointmentProvider } from '../contexts/AppointmentContext'; // Adjust path as needed
import { AuthProvider } from '../contexts/AuthContext';


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* Wrap everything with AuthProvider first */}
     <AuthProvider>
        {/* Then wrap with AppointmentProvider */}
        <AppointmentProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              headerTintColor: Colors.white,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              contentStyle: {
                backgroundColor: Colors.background,
              },
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="auth" 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="(tabs)" 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="chat/[id]" 
              options={{ 
                title: 'Chat',
                headerBackTitle: 'Back'
              }}
            />
            {/* Add more screens as needed */}
          </Stack>
          <StatusBar style="light" />
        </AppointmentProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}