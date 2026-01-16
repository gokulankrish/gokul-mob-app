import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  buttonText,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#0077B6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
  },
});

export default EmptyState;