import { Stack } from "expo-router";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { store, persistor, RootState } from "../redux/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isFirstTime, isAuthenticated, isSubscribed } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isFirstTime}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={!isFirstTime && !isAuthenticated}>
        <Stack.Screen name="auth/signin" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="auth/otp-verification" />
        <Stack.Screen name="auth/reset-password" />
        <Stack.Screen name="auth/profile" />
      </Stack.Protected>

      <Stack.Protected guard={!isFirstTime && isAuthenticated && !isSubscribed}>
        <Stack.Screen name="subscription/index" />
        <Stack.Screen name="subscription/plans" />
      </Stack.Protected>

      <Stack.Protected guard={!isFirstTime && isAuthenticated && isSubscribed}>
        <Stack.Screen name="(drawer)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RootLayoutNav />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
