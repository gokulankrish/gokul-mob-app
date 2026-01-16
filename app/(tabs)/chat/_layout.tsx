import { Stack } from 'expo-router';
import { Colors } from '../../../constants/Colors';

export default function ChatLayout() {
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
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'Chats',
        }}
      />
      <Stack.Screen
        name="conversation"
        options={{
          headerShown: false,
          presentation: 'modal',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}