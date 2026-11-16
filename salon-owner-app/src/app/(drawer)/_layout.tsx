import { Drawer } from "expo-router/drawer";
import * as SplashScreen from "expo-splash-screen";
import CustomDrawerContent from "@/components/CustomDrawerContent";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {

  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" />
      <Drawer.Screen name="services" />
      <Drawer.Screen name="waivers" />
      <Drawer.Screen name="files" />
      <Drawer.Screen name="roles" />
      <Drawer.Screen name="support" />
      <Drawer.Screen name="settings" />
      <Drawer.Screen name="checkout" />
    </Drawer>
  );
}
