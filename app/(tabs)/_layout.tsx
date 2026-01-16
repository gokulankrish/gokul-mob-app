// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { Colors } from '../../constants/Colors';
// import { useAuth } from '../../hooks/useAuth';

// export default function TabsLayout() {
//   const { userData } = useAuth();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors.primary,
//         tabBarInactiveTintColor: Colors.textLight,
//         tabBarStyle: {
//           backgroundColor: Colors.white,
//           borderTopWidth: 1,
//           borderTopColor: Colors.border,
//         },
//         headerStyle: {
//           backgroundColor: Colors.primary,
//         },
//         headerTintColor: Colors.white,
//         headerTitleStyle: {
//           fontWeight: 'bold',
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home" size={size} color={color} />
//           ),
//           headerTitle: userData?.role === 'doctor' ? 'Doctor Dashboard' : 'Home'
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="chatbubbles" size={size} color={color} />
//           ),
//           headerTitle: userData?.role === 'doctor' ? 'Patient Chats' : 'Chat with Doctor'
//         }}
//       />
//       <Tabs.Screen
//         name="cart"
//         options={{
//           title: 'Cart',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="cart" size={size} color={color} />
//           ),
//           headerTitle: 'Shopping Cart',
//           // Optional: Add badge for cart items count
//           // tabBarBadge: cartItemsCount > 0 ? cartItemsCount : undefined,
//         }}
//       />
//       <Tabs.Screen
//         name="calendar"
//         options={{
//           title: 'Calendar',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="calendar" size={size} color={color} />
//           ),
//           headerTitle: userData?.role === 'doctor' ? 'Appointments' : 'My Appointments'
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person" size={size} color={color} />
//           ),
//           headerTitle: 'My Profile'
//         }}
//       />
//     </Tabs>
//   );
// }

// app/_layout.tsx (your existing file)

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks/useAuth';

export default function TabsLayout() {
  const { userData } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: userData?.role === 'doctor' ? 'Doctor Dashboard' : 'Home'
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
          headerShown: false, // We'll handle header inside chat layout
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
          headerTitle: 'Shopping Cart',
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
          headerTitle: userData?.role === 'doctor' ? 'Appointments' : 'My Appointments'
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerTitle: 'My Profile'
        }}
      />
    </Tabs>
  );
}