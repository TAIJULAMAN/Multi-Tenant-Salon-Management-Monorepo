import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/CustomDrawerContent";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="(tabs)" />
      <Drawer.Screen name="remuneration" />
      <Drawer.Screen name="social" />
      <Drawer.Screen name="files" />
      <Drawer.Screen name="support" />
      <Drawer.Screen name="settings" />
    </Drawer>
  );
}
