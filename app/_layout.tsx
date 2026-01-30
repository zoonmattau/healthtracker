import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from '../src/constants/theme';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { DashboardProvider } from '../src/context/DashboardContext';
import { DataProvider } from '../src/context/DataContext';
import { RestTimerProvider } from '../src/context/RestTimerContext';
import { ExerciseSelectionProvider } from '../src/context/ExerciseSelectionContext';
import AuthPromptModal from '../src/components/AuthPromptModal';

function RootLayoutContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: colors.background.primary,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color={colors.accent.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background.primary },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="log" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="program" options={{ headerShown: false }} />
      </Stack>
      <AuthPromptModal />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DataProvider>
          <RestTimerProvider>
            <ExerciseSelectionProvider>
              <DashboardProvider>
                <RootLayoutContent />
              </DashboardProvider>
            </ExerciseSelectionProvider>
          </RestTimerProvider>
        </DataProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
