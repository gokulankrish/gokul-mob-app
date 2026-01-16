// components/ui/Input.tsx - FOR CHAT SCREEN
import React from 'react';
import { 
  TextInput, 
  View, 
  Text, 
  StyleSheet,
  TextInputProps
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  multiline?: boolean;
  containerStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  multiline = false,
  containerStyle,
  style,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        multiline && styles.multilineContainer,
        error && styles.errorContainer,
        rest.editable === false && styles.disabledContainer
      ]}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            style
          ]}
          placeholderTextColor={Colors.placeholder}
          multiline={multiline}
          selectionColor={Colors.primary}
          cursorColor={Colors.primary}
          {...rest}
        />
      </View>
      
      {error && (
        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  multilineContainer: {
    minHeight: 100,
  },
  errorContainer: {
    borderColor: Colors.danger,
  },
  disabledContainer: {
    backgroundColor: Colors.border,
    opacity: 0.7,
  },
  input: {
    padding: 15,
    fontSize: 16,
    color: Colors.text,
    minHeight: 50,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorMessageContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginLeft: 4,
  },
});

export default Input;