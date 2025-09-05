import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/components/firebaseConfig';
import LoginPage from '@/components/LoginPage';

export default function RootLayout() {
  useFrameworkReady();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;
  if (!user) return <LoginPage />;

  return (
    <FinanceProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </FinanceProvider>
  );
}