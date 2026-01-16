// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
// import { colors } from '../../constants/Colors';

// interface ButtonProps {
//   title: string;
//   onPress: () => void;
//   variant?: 'primary' | 'secondary' | 'outline' | 'text';
//   size?: 'small' | 'medium' | 'large';
//   disabled?: boolean;
//   loading?: boolean;
//   style?: ViewStyle;
//   textStyle?: TextStyle;
//   icon?: React.ReactNode;
// }

// export const Button: React.FC<ButtonProps> = ({
//   title,
//   onPress,
//   variant = 'primary',
//   size = 'medium',
//   disabled = false,
//   loading = false,
//   style,
//   textStyle,
//   icon,
// }) => {
//   const getButtonStyle = () => {
//     switch (variant) {
//       case 'primary':
//         return styles.primaryButton;
//       case 'secondary':
//         return styles.secondaryButton;
//       case 'outline':
//         return styles.outlineButton;
//       case 'text':
//         return styles.textButton;
//       default:
//         return styles.primaryButton;
//     }
//   };

//   const getTextStyle = () => {
//     switch (variant) {
//       case 'primary':
//         return styles.primaryText;
//       case 'secondary':
//         return styles.secondaryText;
//       case 'outline':
//         return styles.outlineText;
//       case 'text':
//         return styles.textButtonText;
//       default:
//         return styles.primaryText;
//     }
//   };

//   const getSizeStyle = () => {
//     switch (size) {
//       case 'small':
//         return styles.smallButton;
//       case 'medium':
//         return styles.mediumButton;
//       case 'large':
//         return styles.largeButton;
//       default:
//         return styles.mediumButton;
//     }
//   };

//   const getTextSizeStyle = () => {
//     switch (size) {
//       case 'small':
//         return styles.smallText;
//       case 'medium':
//         return styles.mediumText;
//       case 'large':
//         return styles.largeText;
//       default:
//         return styles.mediumText;
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={[
//         styles.button,
//         getButtonStyle(),
//         getSizeStyle(),
//         disabled && styles.disabledButton,
//         style,
//       ]}
//       onPress={onPress}
//       disabled={disabled || loading}
//       activeOpacity={0.8}
//     >
//       {loading ? (
//         <ActivityIndicator
//           color={variant === 'outline' || variant === 'text' ? colors.primary : colors.white}
//           size="small"
//         />
//       ) : (
//         <>
//           {icon}
//           <Text
//             style={[
//               styles.text,
//               getTextStyle(),
//               getTextSizeStyle(),
//               disabled && styles.disabledText,
//               icon && styles.textWithIcon,
//               textStyle,
//             ]}
//           >
//             {title}
//           </Text>
//         </>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   button: {
//     borderRadius: 8,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   primaryButton: {
//     backgroundColor: colors.primary,
//   },
//   secondaryButton: {
//     backgroundColor: colors.secondary,
//   },
//   outlineButton: {
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: colors.primary,
//   },
//   textButton: {
//     backgroundColor: 'transparent',
//   },
//   smallButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//   },
//   mediumButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//   },
//   largeButton: {
//     paddingVertical: 16,
//     paddingHorizontal: 32,
//   },
//   text: {
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   primaryText: {
//     color: colors.white,
//   },
//   secondaryText: {
//     color: colors.white,
//   },
//   outlineText: {
//     color: colors.primary,
//   },
//   textButtonText: {
//     color: colors.primary,
//   },
//   smallText: {
//     fontSize: 14,
//   },
//   mediumText: {
//     fontSize: 16,
//   },
//   largeText: {
//     fontSize: 18,
//   },
//   disabledButton: {
//     backgroundColor: colors.gray[300],
//     borderColor: colors.gray[300],
//   },
//   disabledText: {
//     color: colors.gray[500],
//   },
//   textWithIcon: {
//     marginLeft: 8,
//   },
// });

import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../constants/Colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const isDisabled = disabled || loading;

  const buttonStyles = useMemo(
    () => [
      styles.button,
      variantStyles[variant],
      sizeStyles[size],
      isDisabled && styles.disabledButton,
      style,
    ],
    [variant, size, isDisabled, style],
  );

  const textStyles = useMemo(
    () => [
      styles.text,
      textVariantStyles[variant],
      textSizeStyles[size],
      isDisabled && styles.disabledText,
      !!icon && styles.textWithIcon,
      textStyle,
    ],
    [variant, size, isDisabled, icon, textStyle],
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isDisabled}
      style={buttonStyles}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'text'
              ? colors.primary
              : colors.white
          }
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

/* ===================== STYLES ===================== */

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
  },
});

const textVariantStyles = StyleSheet.create({
  primary: { color: colors.white },
  secondary: { color: colors.white },
  outline: { color: colors.primary },
  text: { color: colors.primary },
});

const sizeStyles = StyleSheet.create({
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
});

const textSizeStyles = StyleSheet.create({
  small: { fontSize: 14 },
  medium: { fontSize: 16 },
  large: { fontSize: 18 },
});

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  textWithIcon: {
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: colors.gray[300],
    borderColor: colors.gray[300],
  },
  disabledText: {
    color: colors.gray[500],
  },
});
