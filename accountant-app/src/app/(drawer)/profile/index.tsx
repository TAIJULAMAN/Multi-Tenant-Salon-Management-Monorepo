import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { useDispatch } from "react-redux";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { signOut } from "@/redux/slices/authSlice";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import CustomSwitch from "@/components/ui/CustomSwitch";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

// Demo profile matching accountant-dashboard/components/settings/data.ts
const INITIAL_PROFILE = {
  name: "Mathew Anderson",
  store: "Maxima Studio",
  email: "info@modernize.com",
  phone: "(219) 555-0114",
  address: "3891 Ranchview Dr. Richardson, California 62639",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
};

// Demo devices matching accountant-dashboard/components/settings/data.ts
const INITIAL_DEVICES = [
  {
    id: "1",
    type: "smartphone" as const,
    name: "iPhone 14",
    location: "London UK",
    date: "Oct 23 at 1:15 AM",
  },
  {
    id: "2",
    type: "laptop" as const,
    name: "Macbook Air",
    location: "Gujarat India",
    date: "Oct 24 at 3:15 AM",
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  // Active Tab ("Profile" | "Security") matching SettingsPage on dashboard
  const [activeTab, setActiveTab] = useState<"Profile" | "Security">("Profile");

  // Profile State
  const [profile, setProfile] = useState(INITIAL_PROFILE);

  // Security State matching SecurityTab on dashboard
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("test@test.com");
  const [recoveryPhone, setRecoveryPhone] = useState("3482938493");
  const [devices, setDevices] = useState(INITIAL_DEVICES);

  // Bottom Sheet Visibility States
  const [showEditProfileSheet, setShowEditProfileSheet] = useState(false);
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [showRecoveryEmailSheet, setShowRecoveryEmailSheet] = useState(false);
  const [showRecoveryPhoneSheet, setShowRecoveryPhoneSheet] = useState(false);
  const [showSignOutAllSheet, setShowSignOutAllSheet] = useState(false);
  const [deviceToSignOut, setDeviceToSignOut] = useState<typeof INITIAL_DEVICES[0] | null>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState(profile.name);
  const [editStore, setEditStore] = useState(profile.store);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editAddress, setEditAddress] = useState(profile.address);

  // Change Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Recovery Form State
  const [editRecoveryEmail, setEditRecoveryEmail] = useState(recoveryEmail);
  const [editRecoveryPhone, setEditRecoveryPhone] = useState(recoveryPhone);

  const handleOpenEditProfile = () => {
    setEditName(profile.name);
    setEditStore(profile.store);
    setEditEmail(profile.email);
    setEditPhone(profile.phone);
    setEditAddress(profile.address);
    setShowEditProfileSheet(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Required Fields", "Please enter your name and email address.");
      return;
    }
    setProfile({
      ...profile,
      name: editName.trim(),
      store: editStore.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      address: editAddress.trim(),
    });
    setShowEditProfileSheet(false);
    Alert.alert("Success", "Profile details updated successfully.");
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing Fields", "Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "New password and confirmation do not match.");
      return;
    }
    setShowPasswordSheet(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    Alert.alert("Success", "Your password has been changed.");
  };

  const handleSaveRecoveryEmail = () => {
    if (!editRecoveryEmail.trim() || !editRecoveryEmail.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid recovery email address.");
      return;
    }
    setRecoveryEmail(editRecoveryEmail.trim());
    setShowRecoveryEmailSheet(false);
    Alert.alert("Success", "Recovery email configured successfully.");
  };

  const handleSaveRecoveryPhone = () => {
    if (!editRecoveryPhone.trim()) {
      Alert.alert("Invalid Phone", "Please enter a valid recovery phone number.");
      return;
    }
    setRecoveryPhone(editRecoveryPhone.trim());
    setShowRecoveryPhoneSheet(false);
    Alert.alert("Success", "Recovery phone number configured successfully.");
  };

  const handleConfirmSignOutAll = () => {
    setDevices([]);
    setShowSignOutAllSheet(false);
    Alert.alert("Signed Out", "All active device sessions have been revoked.");
  };

  const handleConfirmSignOutDevice = () => {
    if (!deviceToSignOut) return;
    setDevices((prev) => prev.filter((d) => d.id !== deviceToSignOut.id));
    setDeviceToSignOut(null);
    Alert.alert("Signed Out", `${deviceToSignOut.name} session signed out.`);
  };

  const handleSignOutApp = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            dispatch(signOut());
            router.replace("/auth/signin" as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.drawerToggle}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={26} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <TouchableOpacity
          style={styles.logoutHeaderBtn}
          onPress={handleSignOutApp}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Segmented Tabs matching SettingsPage ("Profile" | "Security") */}
      <View style={styles.tabsContainer}>
        {(["Profile", "Security"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}>
                {tab}
              </Text>
              {isActive && <View style={styles.activeTabIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={{ backgroundColor: "#F8FAFC" }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= TAB 1: PROFILE ================= */}
        {activeTab === "Profile" && (
          <View style={styles.tabContentWrap}>
            {/* Profile Overview Card matching ProfileDetails.tsx */}
            <View style={styles.card}>
              <View style={styles.profileHeaderRow}>
                <Image
                  source={{ uri: profile.avatarUrl }}
                  style={styles.avatarImage}
                />
                <View style={styles.profileInfoText}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileStore}>Store: {profile.store}</Text>
                </View>
              </View>

              <CustomButton
                title="Edit Profile"
                onPress={handleOpenEditProfile}
                variant="primary"
                style={{ marginTop: 16 }}
              />
            </View>

            {/* Personal Details Card matching ProfileDetails.tsx */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Personal Details</Text>

              <View style={styles.detailBlock}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <Text style={styles.fieldValue}>{profile.email}</Text>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailBlock}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <Text style={styles.fieldValue}>{profile.phone}</Text>
              </View>

              <View style={styles.detailDivider} />

              <View style={styles.detailBlock}>
                <Text style={styles.fieldLabel}>Store Address</Text>
                <Text style={styles.fieldValue}>{profile.address}</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= TAB 2: SECURITY ================= */}
        {activeTab === "Security" && (
          <View style={styles.tabContentWrap}>
            {/* Security Settings List matching SecuritySettingsList.tsx */}
            <View style={styles.card}>
              {/* 1. Two-factor Authentication */}
              <View style={styles.settingRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.settingTitle}>Two-factor Authentication</Text>
                  <Text style={styles.settingSubtitle}>
                    Mandatory 2FA for all super admin accounts
                  </Text>
                </View>
                <CustomSwitch
                  value={twoFactorEnabled}
                  onValueChange={setTwoFactorEnabled}
                />
              </View>

              <View style={styles.detailDivider} />

              {/* 2. Password */}
              <View style={styles.settingRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.settingTitle}>Password</Text>
                  <Text style={styles.passwordDots}>••••••••••••</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => setShowPasswordSheet(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionBtnText}>Change</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailDivider} />

              {/* 3. Recovery Email */}
              <View style={styles.settingRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.settingTitle}>Recovery email</Text>
                  <Text style={styles.settingSubtitle} numberOfLines={1}>
                    {recoveryEmail}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    setEditRecoveryEmail(recoveryEmail);
                    setShowRecoveryEmailSheet(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionBtnText}>Setup</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailDivider} />

              {/* 4. Recovery Phone Number */}
              <View style={styles.settingRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.settingTitle}>Recovery phone number</Text>
                  <Text style={styles.settingSubtitle}>
                    {recoveryPhone}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    setEditRecoveryPhone(recoveryPhone);
                    setShowRecoveryPhoneSheet(true);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Devices Card matching SecurityDevicesList.tsx */}
            <View style={styles.card}>
              <Text style={styles.cardSectionTitle}>Devices</Text>
              <Text style={styles.devicesDescription}>
                View and manage all devices currently logged into your account. Sign out of any sessions you do not recognize.
              </Text>

              <TouchableOpacity
                style={styles.signOutAllBtn}
                onPress={() => setShowSignOutAllSheet(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.signOutAllBtnText}>Sign out from all devices</Text>
              </TouchableOpacity>

              <View style={styles.devicesList}>
                {devices.length === 0 ? (
                  <Text style={styles.emptyDevicesText}>No active device sessions found.</Text>
                ) : (
                  devices.map((device, index) => (
                    <View key={device.id}>
                      <View style={styles.deviceRow}>
                        <View style={styles.deviceIcon}>
                          <Ionicons
                            name={device.type === "smartphone" ? "phone-portrait-outline" : "laptop-outline"}
                            size={20}
                            color="#64748B"
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.deviceName}>{device.name}</Text>
                          <Text style={styles.deviceLocationDate}>
                            {device.location}, {device.date}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.moreDeviceBtn}
                          onPress={() => setDeviceToSignOut(device)}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="ellipsis-vertical" size={18} color="#94A3B8" />
                        </TouchableOpacity>
                      </View>
                      {index < devices.length - 1 && <View style={styles.detailDivider} />}
                    </View>
                  ))
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ================= BOTTOM SHEETS ================= */}

      {/* 1. Edit Profile Bottom Sheet matching EditProfile.tsx */}
      <CustomBottomSheet
        visible={showEditProfileSheet}
        onClose={() => setShowEditProfileSheet(false)}
        title="Change Profile"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Avatar Preview */}
          <View style={styles.avatarEditWrap}>
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.avatarEditImage}
            />
          </View>

          <CustomInput
            label="Your Name *"
            value={editName}
            onChangeText={setEditName}
            placeholder="Mathew Anderson"
          />

          <CustomInput
            label="Store Name *"
            value={editStore}
            onChangeText={setEditStore}
            placeholder="Maxima Studio"
          />

          <CustomInput
            label="Email *"
            value={editEmail}
            onChangeText={setEditEmail}
            placeholder="info@modernize.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Phone"
            value={editPhone}
            onChangeText={setEditPhone}
            placeholder="(219) 555-0114"
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Address"
            value={editAddress}
            onChangeText={setEditAddress}
            placeholder="3891 Ranchview Dr. Richardson, California 62639"
          />

          <View style={styles.sheetButtonsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setShowEditProfileSheet(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Save Changes"
              onPress={handleSaveProfile}
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </CustomBottomSheet>

      {/* 2. Change Password Bottom Sheet matching ChangePassword.tsx */}
      <CustomBottomSheet
        visible={showPasswordSheet}
        onClose={() => setShowPasswordSheet(false)}
        title="Change Password"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sheetSubNotice}>
            To change your password please confirm here.
          </Text>

          <CustomInput
            label="Current Password *"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="••••••••••••"
            secureTextEntry
          />

          <CustomInput
            label="New Password *"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="••••••••••••"
            secureTextEntry
          />

          <CustomInput
            label="Confirm Password *"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••••••"
            secureTextEntry
          />

          <View style={styles.sheetButtonsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setShowPasswordSheet(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Save Changes"
              onPress={handleSavePassword}
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </CustomBottomSheet>

      {/* 3. Setup Recovery Email Bottom Sheet matching SetupRecoveryEmail.tsx */}
      <CustomBottomSheet
        visible={showRecoveryEmailSheet}
        onClose={() => setShowRecoveryEmailSheet(false)}
        title="Setup Recovery Email"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sheetSubNotice}>
            Enter a secure email address we can use to help you recover your account if you lose access.
          </Text>

          <CustomInput
            label="Recovery Email *"
            value={editRecoveryEmail}
            onChangeText={setEditRecoveryEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.sheetButtonsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setShowRecoveryEmailSheet(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Save Changes"
              onPress={handleSaveRecoveryEmail}
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </CustomBottomSheet>

      {/* 4. Edit Recovery Phone Bottom Sheet matching EditRecoveryPhone.tsx */}
      <CustomBottomSheet
        visible={showRecoveryPhoneSheet}
        onClose={() => setShowRecoveryPhoneSheet(false)}
        title="Edit Recovery Phone"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sheetSubNotice}>
            Enter a phone number to receive recovery SMS codes.
          </Text>

          <CustomInput
            label="Phone Number *"
            value={editRecoveryPhone}
            onChangeText={setEditRecoveryPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />

          <View style={styles.sheetButtonsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setShowRecoveryPhoneSheet(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Save Changes"
              onPress={handleSaveRecoveryPhone}
              variant="primary"
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </CustomBottomSheet>

      {/* 5. Sign Out All Devices Bottom Sheet matching SignOutAllDevicesModal.tsx */}
      <CustomBottomSheet
        visible={showSignOutAllSheet}
        onClose={() => setShowSignOutAllSheet(false)}
        title="Sign Out All Devices"
      >
        <View style={{ paddingVertical: 8 }}>
          <Text style={styles.sheetSubNotice}>
            Are you sure you want to sign out from all other active sessions? You will remain signed in on your current device.
          </Text>

          <View style={styles.sheetButtonsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setShowSignOutAllSheet(false)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Sign Out All"
              onPress={handleConfirmSignOutAll}
              variant="danger"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </CustomBottomSheet>

      {/* 6. Sign Out Specific Device Bottom Sheet matching SignOutDeviceModal.tsx */}
      <CustomBottomSheet
        visible={!!deviceToSignOut}
        onClose={() => setDeviceToSignOut(null)}
        title="Sign Out Device"
      >
        <View style={{ paddingVertical: 8 }}>
          <Text style={styles.sheetSubNotice}>
            Are you sure you want to sign out from {deviceToSignOut?.name}? Any unsaved work on that device may be lost.
          </Text>

          <View style={styles.sheetButtonsRow}>
            <CustomButton
              title="Cancel"
              onPress={() => setDeviceToSignOut(null)}
              variant="outline"
              style={{ flex: 1 }}
            />
            <CustomButton
              title="Sign Out"
              onPress={handleConfirmSignOutDevice}
              variant="danger"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </CustomBottomSheet>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  drawerToggle: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  logoutHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabButton: {
    paddingVertical: 14,
    marginRight: 24,
    position: "relative",
  },
  tabButtonActive: {},
  tabButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },
  tabButtonTextActive: {
    color: "#635BFF",
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#635BFF",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tabContentWrap: {
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  profileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfoText: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  profileStore: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 3,
  },
  cardSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  detailBlock: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 14,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 2,
  },
  passwordDots: {
    fontSize: 16,
    letterSpacing: 2,
    color: "#1E293B",
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  devicesDescription: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 16,
    lineHeight: 18,
  },
  signOutAllBtn: {
    backgroundColor: "#635BFF",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  signOutAllBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  devicesList: {
    gap: 4,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deviceIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  deviceName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  deviceLocationDate: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  moreDeviceBtn: {
    padding: 6,
  },
  emptyDevicesText: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    paddingVertical: 12,
  },
  avatarEditWrap: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarEditImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  sheetSubNotice: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 18,
  },
  sheetButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
});
