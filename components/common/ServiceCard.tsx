import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ServiceCardProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  icon,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon}
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textDark,
    marginTop: 8,
    textAlign: 'center',
  },
});