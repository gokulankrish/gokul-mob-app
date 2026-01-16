// import React, { useState } from 'react';
// import { StyleSheet, TextInput, View, Text, TouchableOpacity, TextInputProps, ViewStyle } from 'react-native';
// import { Eye, EyeOff } from 'lucide-react-native';
// import { colors } from '../../constants/Colors';

// interface InputProps extends TextInputProps {
//   label?: string;
//   error?: string;
//   containerStyle?: ViewStyle;
//   leftIcon?: React.ReactNode;
//   rightIcon?: React.ReactNode;
//   secureTextEntry?: boolean;
// }

// export const Input: React.FC<InputProps> = ({
//   label,
//   error,
//   containerStyle,
//   leftIcon,
//   rightIcon,
//   secureTextEntry,
//   ...props
// }) => {
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);

//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };

//   return (
//     <View style={[styles.container, containerStyle]}>
//       {label && <Text style={styles.label}>{label}</Text>}
//       <View style={[styles.inputContainer, error && styles.inputError]}>
//         {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
//         <TextInput
//           style={[
//             styles.input,
//             leftIcon && styles.inputWithLeftIcon,
//             (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
//           ]}
//           placeholderTextColor={colors.gray[400]}
//           secureTextEntry={secureTextEntry && !isPasswordVisible}
//           {...props}
//         />
//         {secureTextEntry && (
//           <TouchableOpacity style={styles.rightIcon} onPress={togglePasswordVisibility}>
//             {isPasswordVisible ? (
//               <EyeOff size={20} color={colors.gray[500]} />
//             ) : (
//               <Eye size={20} color={colors.gray[500]} />
//             )}
//           </TouchableOpacity>
//         )}
//         {rightIcon && !secureTextEntry && <View style={styles.rightIcon}>{rightIcon}</View>}
//       </View>
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 6,
//     color: colors.text,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: colors.gray[300],
//     borderRadius: 8,
//     backgroundColor: colors.white,
//   },
//   input: {
//     flex: 1,
//     height: 48,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: colors.text,
//   },
//   inputWithLeftIcon: {
//     paddingLeft: 8,
//   },
//   inputWithRightIcon: {
//     paddingRight: 8,
//   },
//   leftIcon: {
//     paddingLeft: 16,
//   },
//   rightIcon: {
//     paddingRight: 16,
//   },
//   inputError: {
//     borderColor: colors.error,
//   },
//   errorText: {
//     color: colors.error,
//     fontSize: 12,
//     marginTop: 4,
//   },
// });

import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../../constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = React.memo(
  ({
    label,
    error,
    containerStyle,
    leftIcon,
    rightIcon,
    secureTextEntry = false,
    ...props
  }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = useCallback(() => {
      setIsPasswordVisible(prev => !prev);
    }, []);

    const inputStyle: StyleProp<TextStyle> = [
      styles.input,
      leftIcon ? styles.inputWithLeftIcon : undefined,
      rightIcon || secureTextEntry ? styles.inputWithRightIcon : undefined,
    ];

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View style={[styles.inputContainer, error ? styles.inputError : undefined]}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

          <TextInput
            {...props}
            style={inputStyle}
            placeholderTextColor={colors.gray[400]}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
          />

          {secureTextEntry ? (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.rightIcon}
              activeOpacity={0.7}
            >
              {isPasswordVisible ? (
                <EyeOff size={20} color={colors.gray[500]} />
              ) : (
                <Eye size={20} color={colors.gray[500]} />
              )}
            </TouchableOpacity>
          ) : (
            rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
});
