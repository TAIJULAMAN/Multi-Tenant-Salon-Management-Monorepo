import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawerContent from "@/components/CustomDrawerContent";

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#EEECFF",
        drawerActiveTintColor: "#635BFF",
        drawerInactiveTintColor: "#4B5563",
        drawerLabelStyle: {
          fontWeight: "600",
          fontSize: 14,
          marginLeft: -8,
        },
        drawerItemStyle: {
          borderRadius: 10,
          paddingHorizontal: 8,
          marginVertical: 4,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: "Dashboards",
          title: "Accountant Portal",
          drawerIcon: ({ color }) => <Ionicons name="grid-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="salons"
        options={{
          drawerLabel: "Salons & Invitations",
          title: "Salons & Invitations",
          drawerIcon: ({ color }) => <Ionicons name="business-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          drawerLabel: "Notifications",
          title: "Alerts & Notifications",
          drawerIcon: ({ color }) => <Ionicons name="notifications-outline" size={22} color={color} />,
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: "Profile & Settings",
          title: "Accountant Profile",
          drawerIcon: ({ color }) => <Ionicons name="person-circle-outline" size={22} color={color} />,
        }}
      />
    </Drawer>
  );
}

