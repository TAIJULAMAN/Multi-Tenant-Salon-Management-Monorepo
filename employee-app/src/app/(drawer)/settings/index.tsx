import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { signOut } from "@/redux/slices/authSlice";
import {
  UserProfileData,
  ActiveSessionData,
  NotificationPreference,
  INITIAL_USER_PROFILE,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_NOTIFICATION_PREFS,
} from "@/components/settings/settingsData";
import CustomSwitch from "@/components/ui/CustomSwitch";
import EditProfileModal from "@/components/settings/modals/EditProfileModal";
import ChangePasswordModal from "@/components/settings/modals/ChangePasswordModal";
import TwoFactorAuthModal from "@/components/settings/modals/TwoFactorAuthModal";

type SettingsTab = "Profile" | "Security" | "Notifications";
const TABS: SettingsTab[] = ["Profile", "Security", "Notifications"];

export default function SettingsHomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
  const [profile, setProfile] = useState<UserProfileData>(INITIAL_USER_PROFILE);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] =
    useState<ActiveSessionData[]>(INITIAL_ACTIVE_SESSIONS);
  const [notificationPrefs, setNotificationPrefs] =
    useState<NotificationPreference[]>(INITIAL_NOTIFICATION_PREFS);

  // Modals
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [twoFactorModalVisible, setTwoFactorModalVisible] = useState(false);

  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    Alert.alert("Session Revoked", "The device session has been signed out successfully.");
  };

  const handleRevokeAllOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    Alert.alert("Sessions Cleared", "All other device sessions have been terminated.");
  };

  const handleTogglePref = (id: string, enabled: boolean) => {
    setNotificationPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled } : p))
    );
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out of your account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => dispatch(signOut()) },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.drawerBtn}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Profile, security & notification preferences</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Profile" && (
          <View style={styles.tabSection}>
            {/* User Profile Card */}
            <View style={styles.card}>
              <View style={styles.profileHeaderRow}>
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
                  <TouchableOpacity
                    style={styles.avatarEditBadge}
                    onPress={() => setEditProfileVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="camera-outline" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={styles.profileHeaderInfo}>
                  <Text style={styles.profileName}>{profile.fullName}</Text>
                  <Text style={styles.profileRole}>{profile.jobTitle}</Text>
                  <View style={styles.salonRow}>
                    <Ionicons name="storefront-outline" size={12} color="#94A3B8" />
                    <Text style={styles.salonText}>{profile.salonName}</Text>
                  </View>
                </View>
              </View>

              {/* Info Rows */}
              <View style={styles.infoList}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoVal}>{profile.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoVal}>{profile.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Home Address</Text>
                  <Text style={styles.infoVal}>{profile.address}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.profileActionsRow}>
                <TouchableOpacity
                  style={styles.editProfileBtn}
                  onPress={() => setEditProfileVisible(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="pencil-outline" size={15} color="#FFFFFF" />
                  <Text style={styles.editProfileBtnText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.changePassBtn}
                  onPress={() => setChangePasswordVisible(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="key-outline" size={15} color="#635BFF" />
                  <Text style={styles.changePassBtnText}>Change Password</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Log out */}
            <TouchableOpacity style={styles.logoutCard} onPress={handleLogout} activeOpacity={0.8}>
              <View style={styles.logoutIconBox}>
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.logoutTitle}>Log out</Text>
                <Text style={styles.cardSubtitle}>Sign out of your account on this device</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "Security" && (
          <View style={styles.tabSection}>
            {/* Password Management */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <Ionicons name="lock-closed-outline" size={18} color="#635BFF" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.cardTitle}>Account Password</Text>
                  <Text style={styles.cardSubtitle}>Last changed 2 months ago</Text>
                </View>
                <TouchableOpacity
                  style={styles.smallActionBtn}
                  onPress={() => setChangePasswordVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.smallActionBtnText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Two-Factor Authentication */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <Ionicons name="shield-checkmark-outline" size={18} color="#635BFF" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.cardTitle}>Two-Factor Authentication (2FA)</Text>
                  <Text style={styles.cardSubtitle}>
                    {twoFactorEnabled
                      ? "Enabled with Google Authenticator"
                      : "Add an extra layer of security to your account"}
                  </Text>
                </View>
                <CustomSwitch
                  value={twoFactorEnabled}
                  onValueChange={() => setTwoFactorModalVisible(true)}
                />
              </View>
            </View>

            {/* Active Sessions */}
            <View style={styles.card}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.cardSectionHeading}>Active Device Sessions</Text>
                {activeSessions.length > 1 && (
                  <TouchableOpacity onPress={handleRevokeAllOtherSessions} activeOpacity={0.7}>
                    <Text style={styles.revokeAllText}>Sign Out Others</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.sessionsList}>
                {activeSessions.map((sess) => (
                  <View key={sess.id} style={styles.sessionItem}>
                    <View style={styles.deviceIconCircle}>
                      <Ionicons name={sess.iconName as any} size={18} color="#635BFF" />
                    </View>
                    <View style={styles.sessionInfo}>
                      <View style={styles.deviceRow}>
                        <Text style={styles.deviceName} numberOfLines={1}>
                          {sess.device}
                        </Text>
                        {sess.isCurrent && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentBadgeText}>This Device</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.sessionMeta}>
                        {sess.location} • {sess.ip} • {sess.lastActive}
                      </Text>
                    </View>
                    {!sess.isCurrent && (
                      <TouchableOpacity
                        style={styles.revokeBtn}
                        onPress={() => handleRevokeSession(sess.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.revokeBtnText}>Revoke</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === "Notifications" && (
          <View style={styles.tabSection}>
            <View style={styles.card}>
              <View>
                <Text style={styles.cardSectionHeading}>Notification Preferences</Text>
                <Text style={styles.cardSubtitle}>Choose what you want to be notified about</Text>
              </View>

              <View>
                {notificationPrefs.map((pref, index) => (
                  <View
                    key={pref.id}
                    style={[
                      styles.prefRow,
                      index < notificationPrefs.length - 1 && styles.prefRowBorder,
                    ]}
                  >
                    <View style={styles.cardIconBox}>
                      <Ionicons name={pref.iconName as any} size={18} color="#635BFF" />
                    </View>
                    <View style={styles.flex1}>
                      <Text style={styles.cardTitle}>{pref.title}</Text>
                      <Text style={styles.cardSubtitle}>{pref.description}</Text>
                    </View>
                    <CustomSwitch
                      value={pref.enabled}
                      onValueChange={(val) => handleTogglePref(pref.id, val)}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        profile={profile}
        onSave={setProfile}
      />

      <ChangePasswordModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      />

      <TwoFactorAuthModal
        visible={twoFactorModalVisible}
        onClose={() => setTwoFactorModalVisible(false)}
        isEnabled={twoFactorEnabled}
        onToggle={setTwoFactorEnabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  flex1: {
    flex: 1,
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },
  drawerBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  tabButtonActive: {
    backgroundColor: "#635BFF",
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabSection: {
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarWrap: {
    position: "relative",
  },
  avatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
  },
  avatarEditBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileHeaderInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  profileRole: {
    fontSize: 12.5,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  salonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  salonText: {
    fontSize: 11.5,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  infoList: {
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  infoRow: {
    gap: 2,
  },
  infoLabel: {
    fontSize: 10.5,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  infoVal: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  profileActionsRow: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  editProfileBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  editProfileBtnText: {
    fontSize: 12.5,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  changePassBtn: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  changePassBtnText: {
    fontSize: 12.5,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  logoutCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FFF5F5",
  },
  logoutIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#EF4444",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  cardSubtitle: {
    fontSize: 11.5,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  smallActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  smallActionBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSectionHeading: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  revokeAllText: {
    fontSize: 11.5,
    fontFamily: "Manrope_700Bold",
    color: "#EF4444",
  },
  sessionsList: {
    gap: 10,
  },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  deviceIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionInfo: {
    flex: 1,
    gap: 2,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deviceName: {
    flexShrink: 1,
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  currentBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  currentBadgeText: {
    fontSize: 9.5,
    fontFamily: "Manrope_700Bold",
    color: "#059669",
  },
  sessionMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  revokeBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
  },
  revokeBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#DC2626",
  },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  prefRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
});
