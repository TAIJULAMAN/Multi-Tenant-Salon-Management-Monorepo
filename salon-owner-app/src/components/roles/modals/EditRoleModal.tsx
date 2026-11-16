import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RoleUser, ROLE_OPTIONS, getRoleBadgeStyle } from "../rolesData";

interface EditRoleModalProps {
  visible: boolean;
  onClose: () => void;
  roleUser: RoleUser | null;
  onSave: (updated: RoleUser) => void;
}

const AVATAR_OPTIONS = [
  "/avatar/icon1.png",
  "/avatar/icon2.png",
  "/avatar/icon3.png",
  "/avatar/icon4.png",
];

export default function EditRoleModal({
  visible,
  onClose,
  roleUser,
  onSave,
}: EditRoleModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Owner");
  const [assignedDate, setAssignedDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [creatorRole, setCreatorRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/avatar/icon1.png");
  const [avatarBg, setAvatarBg] = useState("bg-[#FCE7F3]");

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

  useEffect(() => {
    if (roleUser) {
      setName(roleUser.name || "");
      setEmail(roleUser.email || "");
      setSelectedRole(roleUser.role || "Owner");
      setAssignedDate(roleUser.date || "05/05/2026");
      setCreatedBy(roleUser.createdBy || "Maria Rodriguez");
      setCreatorRole(roleUser.creatorRole || "Owner");
      setAvatarUrl(roleUser.avatarUrl || "/avatar/icon1.png");
      setAvatarBg(
        roleUser.avatarBg.startsWith("#")
          ? `bg-[${roleUser.avatarBg}]`
          : roleUser.avatarBg || "bg-[#FCE7F3]"
      );
    }
  }, [roleUser, visible]);

  const handleSave = () => {
    if (!roleUser) return;
    onSave({
      ...roleUser,
      name: name.trim() || roleUser.name,
      email: email.trim() || roleUser.email,
      role: selectedRole,
      date: assignedDate.trim() || roleUser.date,
      createdBy: createdBy.trim() || roleUser.createdBy,
      creatorRole: creatorRole.trim() || roleUser.creatorRole,
      avatarUrl: avatarUrl.trim() || roleUser.avatarUrl,
      avatarBg: avatarBg.trim() || roleUser.avatarBg,
      lastUpdate: "Just now",
    });
    onClose();
  };

  const currentBadge = getRoleBadgeStyle(selectedRole);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Edit Role Assignment</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            {/* Row 1: Full Name & Email Address */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Shah Aman"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="aman@gmail.com"
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Row 2: Role & Assigned Date */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Role</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownTrigger,
                    roleDropdownOpen && styles.dropdownTriggerActive,
                  ]}
                  onPress={() => {
                    setRoleDropdownOpen(!roleDropdownOpen);
                    setAvatarDropdownOpen(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownTriggerText} numberOfLines={1}>
                    {selectedRole}
                  </Text>
                  <Ionicons
                    name={roleDropdownOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={roleDropdownOpen ? "#635BFF" : "#64748B"}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Assigned Date</Text>
                <TextInput
                  style={styles.input}
                  value={assignedDate}
                  onChangeText={setAssignedDate}
                  placeholder="05/05/2026"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Row 3: Created By & Creator Role */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Created By</Text>
                <TextInput
                  style={styles.input}
                  value={createdBy}
                  onChangeText={setCreatedBy}
                  placeholder="Maria Rodriguez"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Creator Role</Text>
                <TextInput
                  style={styles.input}
                  value={creatorRole}
                  onChangeText={setCreatorRole}
                  placeholder="Owner"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Row 4: Avatar Icon URL & Avatar Background Class */}
            <View style={styles.rowTwoCols}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Avatar Icon URL</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownTrigger,
                    avatarDropdownOpen && styles.dropdownTriggerActive,
                  ]}
                  onPress={() => {
                    setAvatarDropdownOpen(!avatarDropdownOpen);
                    setRoleDropdownOpen(false);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.dropdownTriggerText} numberOfLines={1}>
                    {avatarUrl}
                  </Text>
                  <Ionicons
                    name={avatarDropdownOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={avatarDropdownOpen ? "#635BFF" : "#64748B"}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Avatar Background Class</Text>
                <TextInput
                  style={styles.input}
                  value={avatarBg}
                  onChangeText={setAvatarBg}
                  placeholder="bg-[#FCE7F3]"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          {/* Backdrop to dismiss dropdown on outside tap */}
          {(roleDropdownOpen || avatarDropdownOpen) && (
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={() => {
                setRoleDropdownOpen(false);
                setAvatarDropdownOpen(false);
              }}
            />
          )}

          {/* Floating Role Dropdown - Rendered after footerRow so it floats on TOP of all buttons & fields */}
          {roleDropdownOpen && (
            <View style={styles.roleDropdownFloating}>
              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {ROLE_OPTIONS.map((opt) => {
                  const isSelected = selectedRole === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                      onPress={() => {
                        setSelectedRole(opt);
                        setRoleDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#635BFF" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Floating Avatar Dropdown - Rendered after footerRow */}
          {avatarDropdownOpen && (
            <View style={styles.avatarDropdownFloating}>
              <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {AVATAR_OPTIONS.map((opt) => {
                  const isSelected = avatarUrl === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.dropdownItem, isSelected && styles.dropdownItemActive]}
                      onPress={() => {
                        setAvatarUrl(opt);
                        setAvatarDropdownOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          isSelected && styles.dropdownItemTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {opt}
                      </Text>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#635BFF" />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#0F172A",
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    marginVertical: 4,
  },
  rowTwoCols: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  dropdownTrigger: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  dropdownTriggerActive: {
    borderColor: "#635BFF",
    borderWidth: 1.5,
  },
  dropdownTriggerText: {
    flex: 1,
    marginRight: 8,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  roleDropdownFloating: {
    position: "absolute",
    top: 224,
    left: 20,
    right: "52%",
    maxHeight: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 25,
    zIndex: 9999,
  },
  avatarDropdownFloating: {
    position: "absolute",
    top: 366,
    left: 20,
    right: "52%",
    maxHeight: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 25,
    zIndex: 9999,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  dropdownItemActive: {
    backgroundColor: "#EEF2FF",
  },
  dropdownItemText: {
    fontSize: 12.5,
    fontFamily: "Manrope_500Medium",
    color: "#334155",
  },
  dropdownItemTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  footerRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13.5,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  saveBtn: {
    flex: 1.4,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    fontSize: 13.5,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
