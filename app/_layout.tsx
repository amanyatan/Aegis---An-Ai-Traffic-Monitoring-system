import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAegisFonts } from '@/hooks/useAegisFonts';
import { LenisProvider } from '@/components/premium/LenisProvider';
import { COLORS } from '@/constants/theme';

if (Platform.OS === 'web') {
  require('../global.css');
}

export default function RootLayout() {
  useFrameworkReady();
  const { loaded } = useAegisFonts();

  if (!loaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={COLORS.mist} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LenisProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="auth" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="tabs" options={{ animation: 'fade' }} />
            <Stack.Screen name="notification/index" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="vehicle/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="missing/index" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="violation/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="accident/index" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="accident/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </LenisProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: COLORS.abyss,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
