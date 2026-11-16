import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";

interface DrawerItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  isPlaceholder?: boolean;
}

const mainItems: DrawerItem[] = [
  { label: "Home", icon: "home-outline", route: "/" },
  { label: "Appointments", icon: "calendar-outline", route: "/calendar" },
  { label: "Salaries", icon: "card-outline", route: "/team/salaries" },
  { label: "Services", icon: "cut-outline", route: "/services" },
];

const otherItems: DrawerItem[] = [
  { label: "Roles", icon: "shield-checkmark-outline", route: "/roles" },
  { label: "Waivers", icon: "document-attach-outline", route: "/waivers" },
  { label: "Files", icon: "folder-outline", route: "/files" },
  { label: "Settings", icon: "settings-outline", route: "/settings" },
  { label: "Support", icon: "help-circle-outline", route: "/support" },
];

export default function CustomDrawerContent({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  const handlePress = (item: DrawerItem) => {
    navigation.closeDrawer();
    if (item.isPlaceholder) {
      Alert.alert(
        "Coming Soon",
        `The ${item.label} feature is currently under development.`,
        [{ text: "OK" }]
      );
      return;
    }

    if (item.route === "/") {
      router.replace("/(drawer)/(tabs)/(home)" as any);
    } else if (item.route === "/calendar") {
      router.replace("/(drawer)/(tabs)/calendar" as any);
    } else if (item.route === "/team/salaries") {
      router.push("/(drawer)/(tabs)/team/salaries" as any);
    } else if (item.route === "/services") {
      router.push("/(drawer)/services" as any);
    } else if (item.route === "/finance") {
      router.push("/(drawer)/(tabs)/finance" as any);
    } else if (item.route === "/waivers") {
      router.push("/(drawer)/waivers" as any);
    } else if (item.route === "/files") {
      router.push("/(drawer)/files" as any);
    } else if (item.route === "/roles") {
      router.push("/(drawer)/roles" as any);
    } else if (item.route === "/settings") {
      router.push("/(drawer)/settings" as any);
    } else if (item.route === "/support") {
      router.push("/(drawer)/support" as any);
    }
  };

  const renderItem = (item: DrawerItem) => {
    // Check if the current route matches this item
    let isActive = false;
    if (item.route === "/" && (pathname === "/" || pathname.includes("(home)"))) {
      isActive = true;
    } else if (item.route === "/calendar" && pathname.includes("calendar")) {
      isActive = true;
    } else if (item.route === "/services" && pathname.includes("services")) {
      isActive = true;
    } else if (item.route === "/finance" && pathname.includes("finance")) {
      isActive = true;
    } else if (item.route === "/waivers" && pathname.includes("waivers")) {
      isActive = true;
    } else if (item.route === "/files" && pathname.includes("files")) {
      isActive = true;
    } else if (item.route === "/roles" && pathname.includes("roles")) {
      isActive = true;
    } else if (item.route === "/settings" && pathname.includes("settings")) {
      isActive = true;
    } else if (item.route === "/support" && pathname.includes("support")) {
      isActive = true;
    }

    return (
      <TouchableOpacity
        key={item.label}
        style={[styles.itemContainer, isActive && styles.itemContainerActive]}
        onPress={() => handlePress(item)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={item.icon}
          size={20}
          color={isActive ? "#FFFFFF" : "#6B7280"}
          style={styles.itemIcon}
        />
        <Text style={[styles.itemText, isActive && styles.itemTextActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20), paddingBottom: Math.max(insets.bottom, 20) }]}>
      {/* Brand Header */}
      <View style={styles.headerRow}>
        <View style={styles.brandContainer}>
          <Image
            source={require("../../assets/app/transparentIcon.png")}
            style={styles.brandIcon}
            resizeMode="contain"
          />
          <Text style={styles.brandText}>GlamPro</Text>
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.closeDrawer()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Main Section */}
        <View style={styles.section}>
          {mainItems.map(renderItem)}
        </View>

        <View style={styles.divider} />

        {/* Other Section */}
        <View style={styles.section}>
          {otherItems.map(renderItem)}
        </View>
      </ScrollView>

      {/* Footer / User Profile */}
      <View style={styles.footer}>
        <View style={styles.userAvatarContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" }}
            style={styles.userAvatar}
          />
          <View style={styles.onlineBadge} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>Elena Gilbert</Text>
          <Text style={styles.userRole} numberOfLines={1}>Salon Manager</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            navigation.closeDrawer();
            Alert.alert("Log Out", "Are you sure you want to log out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out", style: "destructive", onPress: () => router.replace("/(drawer)/(tabs)/(home)" as any) },
            ]);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandIcon: {
    width: 32,
    height: 32,
  },
  brandText: {
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
    color: "#111827",
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  section: {
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
    marginHorizontal: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    gap: 12,
  },
  itemContainerActive: {
    backgroundColor: "#635BFF",
  },
  itemIcon: {
    width: 24,
    textAlign: "center",
  },
  itemText: {
    fontSize: 15,
    fontFamily: "Manrope_500Medium",
    color: "#374151",
  },
  itemTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_600SemiBold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 12,
  },
  userAvatarContainer: {
    position: "relative",
  },
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#111827",
  },
  userRole: {
    fontSize: 12,
    fontFamily: "Manrope_400Regular",
    color: "#6B7280",
    marginTop: 1,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
});
