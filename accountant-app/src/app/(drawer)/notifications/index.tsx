import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import {
  NOTIFICATIONS_DATA,
  NotificationItem,
} from "@/data/notificationsData";

export default function NotificationsScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [filter, setFilter] = useState<"All" | "Unread" | "Read">("All");
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_DATA);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    Alert.alert("Completed", "All notifications marked as read.");
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "Unread") return !n.isRead;
    if (filter === "Read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeStyle = (type: NotificationItem["type"]) => {
    switch (type) {
      case "error":
        return {
          bg: "#FFF1F2",
          border: "#FFE4E6",
          iconBg: "#FFFFFF",
          iconColor: "#F43F5E",
          iconName: "alert-circle",
        };
      case "warning":
        return {
          bg: "#FFFBEB",
          border: "#FEF3C7",
          iconBg: "#FFFFFF",
          iconColor: "#F59E0B",
          iconName: "warning",
        };
      case "success":
        return {
          bg: "#F0FDF4",
          border: "#DCFCE7",
          iconBg: "#FFFFFF",
          iconColor: "#10B981",
          iconName: "checkmark-circle",
        };
      case "info":
      default:
        return {
          bg: "#EEECFF",
          border: "#E0E7FF",
          iconBg: "#FFFFFF",
          iconColor: "#635BFF",
          iconName: "information-circle",
        };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.drawerToggle}
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={26} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSub}>ACCOUNTANT ALERTS</Text>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllBtn}
            onPress={markAllAsRead}
            activeOpacity={0.8}
          >
            <Text style={styles.markAllBtnText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={{ backgroundColor: "#F9FAFB" }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Greeting matching web */}
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerDescription}>
            Review and manage your accountant compliance alerts, payroll approvals, and budget status.
          </Text>
        </View>

        {/* Filter Pills Bar */}
        <View style={styles.filterBar}>
          {(["All", "Unread", "Read"] as const).map((tab) => {
            const isActive = filter === tab;
            const count =
              tab === "Unread"
                ? unreadCount
                : tab === "Read"
                ? notifications.filter((n) => n.isRead).length
                : notifications.length;

            return (
              <TouchableOpacity
                key={tab}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setFilter(tab)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextActive,
                  ]}
                >
                  {tab} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notifications List */}
        <View style={styles.notifList}>
          {filteredNotifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="notifications-outline" size={28} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No notifications found</Text>
              <Text style={styles.emptySubtitle}>Everything is up to date!</Text>
            </View>
          ) : (
            filteredNotifications.map((notif) => {
              const typeSty = getTypeStyle(notif.type);

              return (
                <View
                  key={notif.id}
                  style={[
                    styles.notifCard,
                    {
                      backgroundColor: typeSty.bg,
                      borderColor: typeSty.border,
                      opacity: notif.isRead ? 0.85 : 1,
                    },
                  ]}
                >
                  {/* Status Icon */}
                  <View style={[styles.iconWrap, { backgroundColor: typeSty.iconBg }]}>
                    <Ionicons
                      name={typeSty.iconName as any}
                      size={20}
                      color={typeSty.iconColor}
                    />
                  </View>

                  {/* Content Detail */}
                  <View style={styles.cardContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.cardTitle}>{notif.title}</Text>
                      {!notif.isRead && <View style={styles.unreadDot} />}
                    </View>

                    <Text style={styles.salonName}>{notif.salon}</Text>
                    <Text style={styles.descriptionText}>{notif.description}</Text>
                    <Text style={styles.timeText}>{notif.time}</Text>
                  </View>

                  {/* Action Icons (Toggle Read & Delete) */}
                  <View style={styles.actionsCol}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => toggleReadStatus(notif.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={notif.isRead ? "mail-unread-outline" : "checkmark-circle-outline"}
                        size={16}
                        color={notif.isRead ? "#6B7280" : "#10B981"}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => deleteNotification(notif.id)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  drawerToggle: {
    padding: 6,
    marginRight: 8,
    borderRadius: 8,
  },
  headerSub: {
    fontSize: 9,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  markAllBtn: {
    backgroundColor: "#EEECFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#635BFF",
  },
  markAllBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 14,
  },
  bannerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bannerDescription: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
  },
  filterBar: {
    flexDirection: "row",
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterTabActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  notifList: {
    gap: 12,
  },
  notifCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardContent: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    flexShrink: 1,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
    marginLeft: 6,
  },
  salonName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 11,
    color: "#4B5563",
    lineHeight: 16,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  actionsCol: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 4,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  emptySubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
});
