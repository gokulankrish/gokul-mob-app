import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/ui/Loading';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <Loading message="Checking authentication..." />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/auth/login" />;
}

