import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type MainSalonSection = "MySalons" | "PendingInvitations" | "RequestAccess";
export type MySalonsSubTab = "MySalons" | "InvitationsSent" | "RevenueShare" | "Payouts" | "Settings";

interface SalonsHeaderTabsProps {
  activeSection: MainSalonSection;
  onSelectSection: (section: MainSalonSection) => void;
  activeSubTab: MySalonsSubTab;
  onSelectSubTab: (subTab: MySalonsSubTab) => void;
  pendingCount: number;
}

export default function SalonsHeaderTabs({
  activeSection,
  onSelectSection,
  activeSubTab,
  onSelectSubTab,
  pendingCount,
}: SalonsHeaderTabsProps) {
  const mainTabs = [
    {
      id: "MySalons" as MainSalonSection,
      label: "My Salons",
      icon: "business-outline" as const,
      activeIcon: "business" as const,
    },
    {
      id: "PendingInvitations" as MainSalonSection,
      label: "Pending Invitations",
      icon: "mail-outline" as const,
      activeIcon: "mail" as const,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: "RequestAccess" as MainSalonSection,
      label: "Request Access",
      icon: "paper-plane-outline" as const,
      activeIcon: "paper-plane" as const,
    },
  ];

  const subTabs = [
    { id: "MySalons" as MySalonsSubTab, label: "My Salons", icon: "storefront-outline" as const },
    { id: "InvitationsSent" as MySalonsSubTab, label: "Invitations Sent", icon: "send-outline" as const },
    { id: "RevenueShare" as MySalonsSubTab, label: "Revenue Share", icon: "trending-up-outline" as const },
    { id: "Payouts" as MySalonsSubTab, label: "Payouts", icon: "wallet-outline" as const },
    { id: "Settings" as MySalonsSubTab, label: "Bank Settings", icon: "settings-outline" as const },
  ];

  return (
    <View style={styles.container}>
      {/* Main Top Navigation Segment - Horizontally Scrollable for Full Space */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mainTabsContent}
        style={styles.mainTabsScrollView}
      >
        {mainTabs.map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.mainTabButton, isActive && styles.mainTabButtonActive]}
              onPress={() => onSelectSection(tab.id)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={17}
                color={isActive ? "#635BFF" : "#6B7280"}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[styles.mainTabText, isActive && styles.mainTabTextActive]}
              >
                {tab.label}
              </Text>
              {tab.badge !== undefined && (
                <View
                  style={[
                    styles.badgeWrap,
                    isActive ? styles.badgeWrapActive : styles.badgeWrapInactive,
                  ]}
                >
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sub Tabs Bar when My Salons is active */}
      {activeSection === "MySalons" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subTabsContent}
          style={styles.subTabsScrollView}
        >
          {subTabs.map((sub) => {
            const isActive = activeSubTab === sub.id;
            return (
              <TouchableOpacity
                key={sub.id}
                style={[styles.subTabPill, isActive && styles.subTabPillActive]}
                onPress={() => onSelectSubTab(sub.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={sub.icon}
                  size={14}
                  color={isActive ? "#635BFF" : "#6B7280"}
                  style={{ marginRight: 5 }}
                />
                <Text style={[styles.subTabText, isActive && styles.subTabTextActive]}>
                  {sub.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  mainTabsScrollView: {
    backgroundColor: "#FFFFFF",
  },
  mainTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  mainTabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  mainTabButtonActive: {
    backgroundColor: "#EEECFF",
    borderColor: "#635BFF",
  },
  mainTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  mainTabTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  badgeWrap: {
    marginLeft: 8,
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeWrapActive: {
    backgroundColor: "#635BFF",
  },
  badgeWrapInactive: {
    backgroundColor: "#9CA3AF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  subTabsScrollView: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  subTabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  subTabPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  subTabPillActive: {
    backgroundColor: "#EEECFF",
    borderWidth: 1,
    borderColor: "#635BFF",
  },
  subTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  subTabTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
});
