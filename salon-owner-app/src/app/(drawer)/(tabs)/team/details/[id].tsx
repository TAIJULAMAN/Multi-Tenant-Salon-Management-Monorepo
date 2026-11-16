import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Modular Tabs matching Web Dashboard https://salon-owner-dashboard.vercel.app/dashboard/team/members/1
import BasicDataTab from "@/components/team/ViewTeam/BasicDataTab";
import RemunerationTab from "@/components/team/ViewTeam/RemunerationTab";
import ActivityTab from "@/components/team/ViewTeam/ActivityTab";
import CalendarTab from "@/components/team/ViewTeam/CalendarTab";
import ShiftsTab from "@/components/team/ViewTeam/ShiftsTab";
import ProductionTab from "@/components/team/ViewTeam/ProductionTab";
import PermissionsTab from "@/components/team/ViewTeam/PermissionsTab";
import DocumentationTab from "@/components/team/ViewTeam/DocumentationTab";
import MediaTab from "@/components/team/ViewTeam/MediaTab";
import EvaluationTab from "@/components/team/ViewTeam/EvaluationTab";

// Action Modals
import AddTimeOffModal from "@/components/team/modals/AddTimeOffModal";
import EditAdditionalDataModal from "@/components/team/modals/EditAdditionalDataModal";
import TerminateContractModal from "@/components/team/modals/TerminateContractModal";

interface TabItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  { id: "Basic Data", name: "Basic Data", icon: "person-outline" },
  { id: "Remuneration", name: "Remuneration", icon: "cash-outline" },
  { id: "Activity in Salon", name: "Activity in Salon", icon: "trending-up-outline" },
  { id: "Calendar", name: "Calendar", icon: "calendar-outline" },
  { id: "Schedules/Shifts", name: "Schedules/Shifts", icon: "time-outline" },
  { id: "Production", name: "Production", icon: "pie-chart-outline" },
  { id: "Evaluation", name: "Evaluation", icon: "star-outline" },
  { id: "Permissions", name: "Permissions", icon: "shield-checkmark-outline" },
  { id: "Documentation", name: "Documentation", icon: "document-text-outline" },
  { id: "Media", name: "Media", icon: "images-outline" },
];

export default function MemberDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const memberId = (params.id as string) || "1";
  const name = (params.name as string) || "Maria Rodriguez";
  const role = (params.role as string) || "Stylist";
  const avatar =
    (params.avatar as string) ||
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80";

  const [activeTab, setActiveTab] = useState("Basic Data");
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isTimeOffModalOpen, setIsTimeOffModalOpen] = useState(false);
  const [isEditAdditionalDataOpen, setIsEditAdditionalDataOpen] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [isPlatformAccessDisabled, setIsPlatformAccessDisabled] = useState(false);

  // Actions
  const handleToggleAccess = () => {
    setIsActionsModalOpen(false);
    const newStatus = !isPlatformAccessDisabled;
    Alert.alert(
      newStatus ? "Disable Platform Access" : "Enable Platform Access",
      `Are you sure you want to ${newStatus ? "disable" : "enable"} portal access for ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: newStatus ? "Disable" : "Enable",
          style: newStatus ? "destructive" : "default",
          onPress: () => {
            setIsPlatformAccessDisabled(newStatus);
            Alert.alert("Success", `Platform access ${newStatus ? "disabled" : "enabled"} for ${name}.`);
          },
        },
      ]
    );
  };

  const handleTerminateContract = () => {
    setIsActionsModalOpen(false);
    setIsTerminateModalOpen(true);
  };

  const handleToggleSuspend = () => {
    setIsActionsModalOpen(false);
    const newStatus = !isSuspended;
    Alert.alert(
      newStatus ? "Suspend Member" : "Reactivate Member",
      `Are you sure you want to ${newStatus ? "suspend" : "reactivate"} ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: newStatus ? "Suspend" : "Reactivate",
          style: newStatus ? "destructive" : "default",
          onPress: () => {
            setIsSuspended(newStatus);
            Alert.alert("Success", `${name} is now ${newStatus ? "suspended" : "active"}.`);
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top App Header */}
      <View style={styles.appHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.appHeaderTitle} numberOfLines={1}>
          {name}
        </Text>
        <TouchableOpacity
          style={styles.actionMenuBtn}
          onPress={() => setIsActionsModalOpen(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 20) + 60 }]}
      >
        {/* Banner with Profile Info Matching Web Dashboard */}
        <View style={styles.profileBanner}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
            }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay} />

          <View style={styles.bannerContent}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatar }} style={styles.avatar} />
              <View style={styles.avatarBorder} />
            </View>

            <View style={styles.profileNameRow}>
              <Text style={styles.profileName}>{name}</Text>
              <View style={[styles.statusBadge, isSuspended && styles.statusBadgeSuspended]}>
                <Text style={[styles.statusText, isSuspended && styles.statusTextSuspended]}>
                  {isSuspended ? "Suspended" : "Active"}
                </Text>
              </View>
            </View>

            <Text style={styles.profileLocation}>Bologna, Italy</Text>

            {/* Quick stats row */}
            <View style={styles.quickStatsRow}>
              <View style={styles.quickStatItem}>
                <Ionicons name="person-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.quickStatText}>May 31, 2022</Text>
              </View>
              <View style={styles.quickStatDivider} />
              <View style={styles.quickStatItem}>
                <Ionicons name="briefcase-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.quickStatText}>Permanent</Text>
              </View>
              <View style={styles.quickStatDivider} />
              <View style={styles.quickStatItem}>
                <Ionicons name="star" size={14} color="#FBBF24" />
                <Text style={styles.quickStatText}>4.8 Rating</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Horizontal Navigation Tabs Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
          style={styles.tabsContainer}
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={isActive ? "#635BFF" : "#64748B"}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Active Tab Content Area */}
        <View style={styles.tabContentArea}>
          {activeTab === "Basic Data" && (
            <BasicDataTab
              member={{ id: memberId, name, role, avatar }}
              onNavigateToPermissions={() => setActiveTab("Permissions")}
            />
          )}
          {activeTab === "Remuneration" && <RemunerationTab />}
          {activeTab === "Activity in Salon" && <ActivityTab />}
          {activeTab === "Calendar" && <CalendarTab />}
          {activeTab === "Schedules/Shifts" && <ShiftsTab />}
          {activeTab === "Production" && <ProductionTab />}
          {activeTab === "Evaluation" && <EvaluationTab />}
          {activeTab === "Permissions" && <PermissionsTab />}
          {activeTab === "Documentation" && <DocumentationTab />}
          {activeTab === "Media" && <MediaTab />}
        </View>
      </ScrollView>

      {/* Member Actions Dropdown / Sheet */}
      <Modal
        visible={isActionsModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsActionsModalOpen(false)}
      >
        <TouchableOpacity
          style={[
            styles.actionsModalOverlay,
            { paddingTop: Math.max(insets.top, 15) + 56 },
          ]}
          activeOpacity={1}
          onPress={() => setIsActionsModalOpen(false)}
        >
          <View style={styles.actionsCard}>
            <View style={styles.actionsCardHeader}>
              <Text style={styles.actionsCardTitle}>Actions for {name}</Text>
              <TouchableOpacity onPress={() => setIsActionsModalOpen(false)}>
                <Ionicons name="close" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* 1. Edit */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setIsActionsModalOpen(false);
                setIsEditAdditionalDataOpen(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={18} color="#334155" style={styles.actionItemIcon} />
              <Text style={styles.actionItemText}>Edit</Text>
            </TouchableOpacity>

            {/* 2. Add Time Off */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => {
                setIsActionsModalOpen(false);
                setIsTimeOffModalOpen(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={18} color="#334155" style={styles.actionItemIcon} />
              <Text style={styles.actionItemText}>Add Time Off</Text>
            </TouchableOpacity>

            {/* 3. Terminate Contract */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleTerminateContract}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" style={styles.actionItemIcon} />
              <Text style={[styles.actionItemText, { color: "#EF4444" }]}>Terminate Contract</Text>
            </TouchableOpacity>

            {/* 4. Disable / Enable Platform Access */}
            <TouchableOpacity
              style={styles.actionItem}
              onPress={handleToggleAccess}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPlatformAccessDisabled ? "checkmark-circle-outline" : "ban-outline"}
                size={18}
                color="#64748B"
                style={styles.actionItemIcon}
              />
              <Text style={styles.actionItemText}>
                {isPlatformAccessDisabled ? "Enable Platform Access" : "Disable Platform Access"}
              </Text>
            </TouchableOpacity>

            {/* 5. Suspend / Reactivate */}
            <TouchableOpacity
              style={[styles.actionItem, { borderBottomWidth: 0 }]}
              onPress={handleToggleSuspend}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSuspended ? "refresh-outline" : "pause-circle-outline"}
                size={18}
                color="#F59E0B"
                style={styles.actionItemIcon}
              />
              <Text style={[styles.actionItemText, { color: "#F59E0B" }]}>
                {isSuspended ? "Reactivate Member" : "Suspend Member"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Time Off Modal */}
      <AddTimeOffModal
        visible={isTimeOffModalOpen}
        onClose={() => setIsTimeOffModalOpen(false)}
      />

      {/* Edit Additional Data Modal */}
      <EditAdditionalDataModal
        visible={isEditAdditionalDataOpen}
        onClose={() => setIsEditAdditionalDataOpen(false)}
      />

      {/* Terminate Contract Modal */}
      <TerminateContractModal
        visible={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        memberName={name}
        onConfirm={() => {
          setIsTerminateModalOpen(false);
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  appHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 6,
  },
  appHeaderTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  actionMenuBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileBanner: {
    position: "relative",
    width: "100%",
    backgroundColor: "#1E1B4B",
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  bannerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.35,
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
  },
  bannerContent: {
    alignItems: "center",
    zIndex: 1,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontFamily: "Manrope_800ExtraBold",
    color: "#FFFFFF",
  },
  statusBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  statusBadgeSuspended: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "#EF4444",
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#22C55E",
  },
  statusTextSuspended: {
    color: "#EF4444",
  },
  profileLocation: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
  },
  quickStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  quickStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  quickStatDivider: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 10,
  },
  quickStatText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#FFFFFF",
  },
  tabsContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabsScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tabButtonActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  tabTextActive: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  tabContentArea: {
    padding: 16,
  },
  actionsModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    alignItems: "flex-end",
    paddingRight: 16,
  },
  actionsCard: {
    width: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  actionsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  actionsCardTitle: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  actionItemIcon: {
    marginRight: 10,
  },
  actionItemText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
});
