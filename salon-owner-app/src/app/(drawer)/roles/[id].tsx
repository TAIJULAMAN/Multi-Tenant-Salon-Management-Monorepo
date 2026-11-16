import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  PERMISSION_CATEGORIES,
  INITIAL_ROLES_DATA,
  RoleUser,
  getRoleBadgeStyle,
} from "@/components/roles/rolesData";
import { mockMembers } from "@/components/services/servicesData";
import CustomSwitch from "@/components/ui/CustomSwitch";
import Avatar from "@/components/Avatar";

export default function RoleDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const initialRoleName = (params.roleName as string) || "Admin";

  // Editable details state
  const [roleName, setRoleName] = useState(initialRoleName);
  const [description, setDescription] = useState(() => {
    if (initialRoleName === "Owner") {
      return "Full unrestricted administrative access across the entire salon workspace.";
    } else if (initialRoleName === "Admin") {
      return "Manage staff, appointments, billing and client communications with high privilege.";
    } else {
      return "Standard operating permissions tailored to daily salon duties.";
    }
  });

  // Assigned staff state
  const [assignedStaff, setAssignedStaff] = useState<RoleUser[]>(() => {
    const matched = INITIAL_ROLES_DATA.filter(
      (r) => r.role === initialRoleName || (initialRoleName === "Owner" && r.role === "Owner")
    );
    return matched.length > 0 ? matched : [INITIAL_ROLES_DATA[0]];
  });

  // Modal to add staff
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);

  // Permissions state
  const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    PERMISSION_CATEGORIES.forEach((cat) => {
      cat.items.forEach((it) => {
        initial[it.id] = it.defaultChecked;
      });
    });
    return initial;
  });

  const togglePermission = (id: string) => {
    setPermissions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRemoveStaff = (userId: string) => {
    Alert.alert(
      "Remove Staff Member",
      "Are you sure you want to remove this staff member from this role?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setAssignedStaff((prev) => prev.filter((u) => u.id !== userId));
          },
        },
      ]
    );
  };

  const handleAddStaffMember = (member: { id: number; name: string; avatar: string; role: string }) => {
    const exists = assignedStaff.some((s) => s.name === member.name);
    if (exists) {
      Alert.alert("Already Assigned", `${member.name} is already assigned to this role.`);
      return;
    }

    const newStaff: RoleUser = {
      id: String(Date.now()),
      name: member.name,
      role: roleName,
      email: `${member.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      date: "Today",
      createdBy: "Owner",
      creatorRole: "Owner",
      avatarBg: "#EEF2FF",
      avatarUrl: member.avatar,
      lastUpdate: "Just now",
    };

    setAssignedStaff((prev) => [...prev, newStaff]);
    setAddStaffModalOpen(false);
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      Alert.alert("Required", "Please enter a role name.");
      return;
    }

    Alert.alert(
      "Changes Saved",
      `Role "${roleName}" details, permissions, and ${assignedStaff.length} assigned staff have been saved successfully.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  const badge = getRoleBadgeStyle(roleName);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>{roleName}</Text>
            <View style={styles.countPill}>
              <Text style={styles.countPillText}>{assignedStaff.length}</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Role configuration & permissions</Text>
        </View>

        <View style={[styles.roleBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
          <Text style={[styles.roleBadgeText, { color: badge.text }]}>{roleName}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Details Card (Editable) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="options-outline" size={16} color="#635BFF" />
            </View>
            <Text style={styles.cardSectionTitle}>Role Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Role Name</Text>
            <TextInput
              style={styles.textInput}
              value={roleName}
              onChangeText={setRoleName}
              placeholder="Enter role name"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Authority & Scope Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe access privileges and responsibilities..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Assigned Staff Members Card */}
        <View style={styles.card}>
          <View style={styles.assignedHeader}>
            <View style={styles.assignedHeaderLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="people-outline" size={16} color="#635BFF" />
              </View>
              <Text style={styles.cardSectionTitle}>Assigned Staff</Text>
              <View style={styles.assignedCountBadge}>
                <Text style={styles.assignedCountText}>{assignedStaff.length}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addStaffBtn}
              onPress={() => setAddStaffModalOpen(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={16} color="#635BFF" />
              <Text style={styles.addStaffBtnText}>Add Staff</Text>
            </TouchableOpacity>
          </View>

          {assignedStaff.length === 0 ? (
            <View style={styles.emptyStaffBox}>
              <Ionicons name="person-add-outline" size={32} color="#94A3B8" />
              <Text style={styles.emptyStaffText}>No staff members assigned to this role yet.</Text>
              <TouchableOpacity
                style={styles.assignNowBtn}
                onPress={() => setAddStaffModalOpen(true)}
              >
                <Text style={styles.assignNowBtnText}>Assign Member</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.assignedList}>
              {assignedStaff.map((user) => (
                <View key={user.id} style={styles.userItem}>
                  <View style={[styles.avatarBox, { backgroundColor: user.avatarBg }]}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
                  </View>

                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.removeStaffBtn}
                    onPress={() => handleRemoveStaff(user.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="trash-outline" size={17} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Permissions Groups */}
        <View style={styles.permissionsSection}>
          <Text style={styles.permissionsHeading}>Configured Permissions</Text>

          {PERMISSION_CATEGORIES.map((category) => (
            <View key={category.id} style={styles.card}>
              <View style={styles.categoryHeader}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#635BFF" />
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>

              <View style={styles.permissionItemsList}>
                {category.items.map((item, idx) => {
                  const isChecked = !!permissions[item.id];
                  const isLast = idx === category.items.length - 1;

                  return (
                    <View
                      key={item.id}
                      style={[styles.permissionRow, !isLast && styles.permissionRowBorder]}
                    >
                      <View style={styles.permissionInfo}>
                        <Text style={styles.permissionTitle}>{item.title}</Text>
                        <Text style={styles.permissionSubtitle}>{item.subtitle}</Text>
                      </View>

                      <CustomSwitch
                        value={isChecked}
                        onValueChange={() => togglePermission(item.id)}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Save and Cancel Buttons */}
      <View
        style={[
          styles.fixedFooter,
          { paddingBottom: Math.max(insets.bottom, 14) },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* Add Staff Modal */}
      <Modal
        visible={addStaffModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAddStaffModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Assign Staff to {roleName}</Text>
              <TouchableOpacity onPress={() => setAddStaffModalOpen(false)}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.staffPickerScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.staffPickerSub}>Select a team member to assign this role:</Text>
              {mockMembers.map((member) => {
                const isAlreadyAssigned = assignedStaff.some((s) => s.name === member.name);
                return (
                  <TouchableOpacity
                    key={member.id}
                    style={[
                      styles.staffPickerItem,
                      isAlreadyAssigned && styles.staffPickerItemDisabled,
                    ]}
                    onPress={() => !isAlreadyAssigned && handleAddStaffMember(member)}
                    disabled={isAlreadyAssigned}
                    activeOpacity={0.7}
                  >
                    <Avatar name={member.name} uri={member.avatar} size={40} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.staffPickerName}>{member.name}</Text>
                      <Text style={styles.staffPickerRole}>{member.role}</Text>
                    </View>
                    {isAlreadyAssigned ? (
                      <View style={styles.alreadyAssignedBadge}>
                        <Text style={styles.alreadyAssignedText}>Assigned</Text>
                      </View>
                    ) : (
                      <Ionicons name="add-circle" size={22} color="#635BFF" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setAddStaffModalOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeModalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  countPill: {
    backgroundColor: "#635BFF",
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 1,
  },
  countPillText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardSectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  assignedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  assignedHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  assignedCountBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  assignedCountText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  addStaffBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addStaffBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  emptyStaffBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  emptyStaffText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    textAlign: "center",
  },
  assignNowBtn: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  assignNowBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  assignedList: {
    gap: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: 36,
    height: 36,
    resizeMode: "cover",
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 13.5,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  userEmail: {
    fontSize: 11.5,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  removeStaffBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  permissionsSection: {
    gap: 12,
  },
  permissionsHeading: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
    marginTop: 4,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  permissionItemsList: {
    gap: 2,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    gap: 12,
  },
  permissionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  permissionInfo: {
    flex: 1,
    gap: 2,
  },
  permissionTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  permissionSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    lineHeight: 15,
  },
  fixedFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  saveBtn: {
    flex: 1.5,
    height: 46,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  staffPickerScroll: {
    marginVertical: 12,
  },
  staffPickerSub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginBottom: 10,
  },
  staffPickerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },
  staffPickerItemDisabled: {
    opacity: 0.6,
    backgroundColor: "#F1F5F9",
  },
  staffPickerName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  staffPickerRole: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  alreadyAssignedBadge: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  alreadyAssignedText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  closeModalBtn: {
    backgroundColor: "#635BFF",
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  closeModalBtnText: {
    fontSize: 13.5,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
