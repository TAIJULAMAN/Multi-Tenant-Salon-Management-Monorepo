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

import {
  UserProfileData,
  ActiveSessionData,
  INITIAL_USER_PROFILE,
  INITIAL_ACTIVE_SESSIONS,
} from "@/components/settings/settingsData";
import {
  SocialAccount,
  INITIAL_SOCIAL_ACCOUNTS,
} from "@/components/social/socialData";
import CustomSwitch from "@/components/ui/CustomSwitch";
import EditProfileModal from "@/components/settings/modals/EditProfileModal";
import ChangePasswordModal from "@/components/settings/modals/ChangePasswordModal";
import TwoFactorAuthModal from "@/components/settings/modals/TwoFactorAuthModal";
import DeactivateAccountModal from "@/components/settings/modals/DeactivateAccountModal";
import ConnectAccountModal from "@/components/social/modals/ConnectAccountModal";

export default function SettingsHomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<"Profile" | "Security" | "Social">("Profile");
  const [profile, setProfile] = useState<UserProfileData>(INITIAL_USER_PROFILE);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState<ActiveSessionData[]>(INITIAL_ACTIVE_SESSIONS);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_SOCIAL_ACCOUNTS);

  // Modals
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [twoFactorModalVisible, setTwoFactorModalVisible] = useState(false);
  const [deactivateVisible, setDeactivateVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [connectModalVisible, setConnectModalVisible] = useState(false);

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  const handleRevokeSession = (sessionId: string) => {
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    Alert.alert("Session Revoked", "The device session has been signed out successfully.");
  };

  const handleRevokeAllOtherSessions = () => {
    setActiveSessions((prev) => prev.filter((s) => s.isCurrent));
    Alert.alert("Sessions Cleared", "All other device sessions have been terminated.");
  };

  const handleToggleAccount = (account: SocialAccount) => {
    if (account.status === "Connected") {
      Alert.alert(
        `Disconnect ${account.name}`,
        `Are you sure you want to disconnect ${account.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: () => {
              setAccounts((prev) =>
                prev.map((acc) =>
                  acc.id === account.id
                    ? { ...acc, status: "Not Connected" }
                    : acc
                )
              );
            },
          },
        ]
      );
    } else {
      setSelectedAccount(account);
      setConnectModalVisible(true);
    }
  };

  const handleConnectConfirm = (accountId: string, handle: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? {
              ...acc,
              status: "Connected",
              handle,
            }
          : acc
      )
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.drawerBtn} onPress={handleOpenDrawer} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Account profile, security & social channels</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(["Profile", "Security", "Social"] as const).map((tab) => {
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
          /* PROFILE TAB */
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
                  <Text style={styles.profileStore}>{profile.storeName}</Text>
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
                  <Text style={styles.infoLabel}>Store Address</Text>
                  <Text style={styles.infoVal}>{profile.storeAddress}</Text>
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
          </View>
        )}

        {activeTab === "Security" && (
          /* SECURITY TAB */
          <View style={styles.tabSection}>
            {/* Password Management */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                  <Ionicons name="lock-closed-outline" size={18} color="#635BFF" />
                </View>
                <View style={{ flex: 1 }}>
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
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Two-Factor Authentication (2FA)</Text>
                  <Text style={styles.cardSubtitle}>
                    {twoFactorEnabled
                      ? "Enabled with Google Authenticator"
                      : "Add an extra layer of security to your salon account"}
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
                  <TouchableOpacity
                    onPress={handleRevokeAllOtherSessions}
                    activeOpacity={0.7}
                  >
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
                        <Text style={styles.deviceName}>{sess.device}</Text>
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

            {/* Danger Zone */}
            <View style={[styles.card, styles.dangerCard]}>
              <View style={styles.dangerHeader}>
                <Ionicons name="alert-circle-outline" size={20} color="#EF4444" />
                <Text style={styles.dangerTitle}>Danger Zone</Text>
              </View>

              <Text style={styles.dangerText}>
                Deactivating your salon business will disconnect all active staff access and disable online bookings.
              </Text>

              <TouchableOpacity
                style={styles.deactivateBtn}
                onPress={() => setDeactivateVisible(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="trash-outline" size={15} color="#FFFFFF" />
                <Text style={styles.deactivateBtnText}>Deactivate Salon Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === "Social" && (
          /* SOCIAL TAB */
          <View style={styles.tabSection}>
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Social Media Accounts</Text>

              <View style={styles.accountsGrid}>
                {accounts.map((acc) => {
                  const isConnected = acc.status === "Connected";

                  return (
                    <View key={acc.id} style={styles.accountRowCard}>
                      <View style={styles.accountLeft}>
                        {/* Platform Icon */}
                        <View style={styles.iconWrap}>
                          {acc.platform === "x" ? (
                            <Text style={styles.xLogo}>𝕏</Text>
                          ) : (
                            <Ionicons
                              name={acc.iconName as any}
                              size={20}
                              color={acc.brandColor}
                            />
                          )}
                        </View>

                        {/* Platform Name & Status Badge */}
                        <View style={styles.nameRow}>
                          <Text style={styles.accountName}>{acc.name}</Text>
                          <View
                            style={[
                              styles.statusBadge,
                              isConnected ? styles.statusBadgeConnected : styles.statusBadgeDisconnected,
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusBadgeText,
                                isConnected ? styles.statusTextConnected : styles.statusTextDisconnected,
                              ]}
                            >
                              {acc.status}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Connect / Disconnect Button */}
                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          isConnected ? styles.disconnectBtn : styles.connectBtn,
                        ]}
                        onPress={() => handleToggleAccount(acc)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.actionBtnText,
                            isConnected ? styles.disconnectBtnText : styles.connectBtnText,
                          ]}
                        >
                          {isConnected ? "Disconnect" : "Connect"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
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

      <DeactivateAccountModal
        visible={deactivateVisible}
        onClose={() => setDeactivateVisible(false)}
      />

      <ConnectAccountModal
        visible={connectModalVisible}
        onClose={() => {
          setConnectModalVisible(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
        onConnect={handleConnectConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    fontFamily: "Manrope_800ExtraBold",
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
  cardHeading: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
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
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  profileStore: {
    fontSize: 12.5,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
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
    fontFamily: "Manrope_800ExtraBold",
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
  dangerCard: {
    borderColor: "#FECACA",
    backgroundColor: "#FFF5F5",
  },
  dangerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dangerTitle: {
    fontSize: 14,
    fontFamily: "Manrope_800ExtraBold",
    color: "#EF4444",
  },
  dangerText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#7F1D1D",
    lineHeight: 17,
  },
  deactivateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  deactivateBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  accountsGrid: {
    gap: 10,
  },
  accountRowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  accountLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  xLogo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  accountName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeConnected: {
    backgroundColor: "#DCFCE7",
  },
  statusBadgeDisconnected: {
    backgroundColor: "#FEF9C3",
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  statusTextConnected: {
    color: "#16A34A",
  },
  statusTextDisconnected: {
    color: "#CA8A04",
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  connectBtn: {
    backgroundColor: "#E0E7FF",
  },
  connectBtnText: {
    fontSize: 11.5,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  disconnectBtn: {
    backgroundColor: "#FFE4E6",
  },
  disconnectBtnText: {
    fontSize: 11.5,
    fontFamily: "Manrope_700Bold",
    color: "#FF4C6A",
  },
  actionBtnText: {
    fontSize: 11.5,
  },
});
