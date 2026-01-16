// import React from 'react';
// import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import { Colors } from '../../constants/Colors';

// interface LoadingProps {
//   message?: string;
//   size?: 'small' | 'large';
// }

// const Loading: React.FC<LoadingProps> = ({ 
//   message = 'Loading...', 
//   size = 'large' 
// }) => {
//   return (
//     <View style={styles.container}>
//       <ActivityIndicator size={size} color={Colors.primary} />
//       <Text style={styles.text}>{message}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: Colors.background,
//     padding: 20,
//   },
//   text: {
//     marginTop: 10,
//     fontSize: 16,
//     color: Colors.gray,
//   }
// });

// export default Loading;

// components/ui/Loading.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'large',
  color = Colors.primary,
  backgroundColor = Colors.transparent,
  style,
  fullScreen = false,
}) => {
  const containerStyle = fullScreen
    ? [styles.fullScreenContainer, { backgroundColor }, style]
    : [styles.container, { backgroundColor }, style];

  return (
    <View style={containerStyle}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  message: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Loading;