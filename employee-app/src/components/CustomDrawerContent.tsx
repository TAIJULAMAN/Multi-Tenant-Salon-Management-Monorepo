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
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "@/redux/slices/authSlice";
import type { RootState } from "@/redux/store";
import { MOCK_EMPLOYEE_USER } from "@/components/auth/authData";

interface DrawerItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  // Pathname prefix used to highlight the active item
  match: string;
  href: string;
}

const mainItems: DrawerItem[] = [
  { label: "Dashboard", icon: "grid-outline", match: "/", href: "/(drawer)/(tabs)/(home)" },
  { label: "Appointments", icon: "calendar-outline", match: "/calendar", href: "/(drawer)/(tabs)/calendar" },
  { label: "Clients", icon: "people-outline", match: "/clients", href: "/(drawer)/(tabs)/clients" },
  { label: "Remuneration", icon: "wallet-outline", match: "/remuneration", href: "/(drawer)/remuneration" },
  { label: "Scheduled Shifts", icon: "shuffle-outline", match: "/shifts", href: "/(drawer)/(tabs)/shifts" },
  { label: "Worked Shifts", icon: "time-outline", match: "/shifts/worked", href: "/(drawer)/(tabs)/shifts/worked" },
  { label: "Statistics", icon: "stats-chart-outline", match: "/statistics", href: "/(drawer)/(tabs)/statistics" },
  { label: "Social Media", icon: "globe-outline", match: "/social", href: "/(drawer)/social" },
];

const otherItems: DrawerItem[] = [
  { label: "Files", icon: "folder-outline", match: "/files", href: "/(drawer)/files" },
  { label: "Support", icon: "help-buoy-outline", match: "/support", href: "/(drawer)/support" },
  { label: "Settings", icon: "settings-outline", match: "/settings", href: "/(drawer)/settings" },
];

const allItems = [...mainItems, ...otherItems];

// The most specific matching prefix wins, so "/shifts/worked" beats "/shifts".
function getActiveItem(pathname: string) {
  let best: DrawerItem | undefined;
  for (const item of allItems) {
    const matches =
      item.match === "/"
        ? pathname === "/"
        : pathname === item.match || pathname.startsWith(item.match + "/");
    if (matches && (!best || item.match.length > best.match.length)) {
      best = item;
    }
  }
  return best;
}

export default function CustomDrawerContent({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user) ?? MOCK_EMPLOYEE_USER;
  const activeItem = getActiveItem(pathname);

  const handlePress = (item: DrawerItem) => {
    navigation.closeDrawer();
    router.navigate(item.href as any);
  };

  const renderItem = (item: DrawerItem) => {
    const isActive = activeItem?.label === item.label;

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
            source={{ uri: user.avatarUrl }}
            style={styles.userAvatar}
          />
          <View style={styles.onlineBadge} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
          <Text style={styles.userRole} numberOfLines={1}>{user.role}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            navigation.closeDrawer();
            Alert.alert("Log Out", "Are you sure you want to log out?", [
              { text: "Cancel", style: "cancel" },
              { text: "Log Out", style: "destructive", onPress: () => dispatch(signOut()) },
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
