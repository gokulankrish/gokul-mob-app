// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Colors } from '../../constants/Colors';

// interface AvatarProps {
//   name: string;
//   size?: number;
//   textSize?: number;
//   backgroundColor?: string;
//   textColor?: string;
//   showBorder?: boolean;
//   borderColor?: string;
// }

// const Avatar: React.FC<AvatarProps> = ({
//   name,
//   size = 40,
//   textSize = 16,
//   backgroundColor = Colors.primary,
//   textColor = Colors.white,
//   showBorder = false,
//   borderColor = Colors.white
// }) => {
//   const initials = name
//     .split(' ')
//     .map(word => word[0])
//     .join('')
//     .toUpperCase()
//     .slice(0, 2);

//   return (
//     <View style={[
//       styles.container,
//       {
//         width: size,
//         height: size,
//         borderRadius: size / 2,
//         backgroundColor,
//         borderWidth: showBorder ? 2 : 0,
//         borderColor: showBorder ? borderColor : 'transparent'
//       }
//     ]}>
//       <Text style={[
//         styles.text,
//         {
//           fontSize: textSize,
//           color: textColor
//         }
//       ]}>
//         {initials}
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   text: {
//     fontWeight: 'bold',
//   }
// });

// export default Avatar;

// components/ui/Avatar.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';

interface AvatarProps {
  name: string;
  size?: number;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  textSize?: number;
  style?: ViewStyle;
  onPress?: () => void;
  showBorder?: boolean;
  borderColor?: string;
  borderWidth?: number;
  isOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 40,
  imageUrl,
  backgroundColor = Colors.primary,
  textColor = Colors.white,
  textSize,
  style,
  onPress,
  showBorder = false,
  borderColor = Colors.white,
  borderWidth = 2,
  isOnline,
}) => {
  const containerSize = size;
  const borderRadius = containerSize / 2;
  const fontSize = textSize || containerSize * 0.4;
  
  const getInitials = (nameString: string) => {
    const names = nameString.trim().split(' ');
    if (names.length === 0) return '?';
    
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getColorFromName = (nameString: string) => {
    const colors = [
      Colors.primary,
      Colors.secondary,
      Colors.accent,
      Colors.success,
      Colors.warning,
      Colors.error,
      Colors.info,
      Colors.doctor,
      Colors.patient,
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FECA57',
      '#FF9FF3',
      '#54A0FF',
      '#5F27CD',
    ];
    
    const charSum = nameString
      .split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    return colors[charSum % colors.length];
  };

  const avatarBackground = imageUrl 
    ? Colors.transparent 
    : (backgroundColor || getColorFromName(name));
  const initials = getInitials(name);

  const renderAvatarContent = () => {
    if (imageUrl) {
      return (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            {
              width: containerSize,
              height: containerSize,
              borderRadius,
            },
          ]}
          resizeMode="cover"
        />
      );
    }

    return (
      <Text style={[styles.initials, { fontSize, color: textColor }]}>
        {initials}
      </Text>
    );
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <View style={[style, { position: 'relative' }]}>
      <Container
        style={[
          styles.container,
          {
            width: containerSize,
            height: containerSize,
            borderRadius,
            backgroundColor: avatarBackground,
            borderWidth: showBorder ? borderWidth : 0,
            borderColor: borderColor,
          },
        ]}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        {renderAvatarContent()}
      </Container>
      
      {isOnline !== undefined && (
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: isOnline ? Colors.online : Colors.offline,
              width: containerSize * 0.25,
              height: containerSize * 0.25,
              borderRadius: (containerSize * 0.25) / 2,
              borderWidth: 2,
              borderColor: Colors.white,
              top: containerSize * 0.75 - (containerSize * 0.25) / 2,
              left: containerSize * 0.75 - (containerSize * 0.25) / 2,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    zIndex: 10,
  },
});

export default Avatar;