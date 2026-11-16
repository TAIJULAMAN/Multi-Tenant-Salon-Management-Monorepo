import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { INITIAL_MEMBERS, FileMember } from "../filesData";

interface ManagePermissionModalProps {
  visible: boolean;
  onClose: () => void;
  itemName: string;
}

export default function ManagePermissionModal({
  visible,
  onClose,
  itemName,
}: ManagePermissionModalProps) {
  const [members, setMembers] = useState<FileMember[]>(INITIAL_MEMBERS);
  const [newEmail, setNewEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<FileMember["role"]>("View Only");

  const ROLES: FileMember["role"][] = ["View Only", "Edit Content", "Add Folder"];

  const handleAddMember = () => {
    if (!newEmail.trim() || !newEmail.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid member email address.");
      return;
    }

    const newM: FileMember = {
      id: Date.now(),
      name: newEmail.split("@")[0],
      email: newEmail.trim(),
      role: selectedRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    };

    setMembers([...members, newM]);
    setNewEmail("");
    Alert.alert("Member Added", `Invitation sent to ${newEmail}.`);
  };

  const handleRemoveMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleCycleRole = (id: number) => {
    setMembers(
      members.map((m) => {
        if (m.id === id) {
          const nextIndex = (ROLES.indexOf(m.role) + 1) % ROLES.length;
          return { ...m, role: ROLES[nextIndex] };
        }
        return m;
      })
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={styles.modalCard}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="people" size={18} color="#F59E0B" />
              </View>
              <Text style={styles.title}>Manage Permissions</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            <View style={styles.bannerBox}>
              <Ionicons name="document-text-outline" size={16} color="#635BFF" />
              <Text style={styles.bannerText} numberOfLines={1}>
                {itemName || "Selected File/Folder"}
              </Text>
            </View>

            {/* Invite Form */}
            <View style={styles.inviteSection}>
              <Text style={styles.label}>INVITE TEAM MEMBER</Text>
              <View style={styles.inviteInputRow}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Enter staff or accountant email..."
                  placeholderTextColor="#94A3B8"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity style={styles.addMemberBtn} onPress={handleAddMember} activeOpacity={0.85}>
                  <Text style={styles.addMemberBtnText}>Invite</Text>
                </TouchableOpacity>
              </View>

              {/* Role selector for new invitee */}
              <View style={styles.rolesRow}>
                {ROLES.map((r) => {
                  const isSelected = selectedRole === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      style={[styles.roleChip, isSelected && styles.roleChipActive]}
                      onPress={() => setSelectedRole(r)}
                    >
                      <Text style={[styles.roleChipText, isSelected && styles.roleChipTextActive]}>
                        {r}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Members List */}
            <View style={styles.membersSection}>
              <Text style={styles.label}>PEOPLE WITH ACCESS ({members.length})</Text>
              <View style={styles.membersList}>
                {members.map((m) => (
                  <View key={m.id} style={styles.memberCard}>
                    <Image source={{ uri: m.avatar }} style={styles.avatar} />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{m.name}</Text>
                      <Text style={styles.memberEmail}>{m.email}</Text>
                    </View>

                    {/* Role Chip Toggle */}
                    <TouchableOpacity
                      style={styles.memberRoleBtn}
                      onPress={() => handleCycleRole(m.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.memberRoleText}>{m.role}</Text>
                      <Ionicons name="chevron-down" size={12} color="#635BFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeMemberBtn}
                      onPress={() => handleRemoveMember(m.id)}
                    >
                      <Ionicons name="close-circle-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Link Sharing */}
            <TouchableOpacity
              style={styles.copyLinkCard}
              onPress={() => Alert.alert("Link Copied", "Private shareable link copied to clipboard.")}
              activeOpacity={0.7}
            >
              <Ionicons name="link-outline" size={18} color="#635BFF" />
              <View style={{ flex: 1 }}>
                <Text style={styles.copyLinkTitle}>Copy Private Access Link</Text>
                <Text style={styles.copyLinkSub}>Only invited collaborators can access</Text>
              </View>
              <Ionicons name="copy-outline" size={16} color="#635BFF" />
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  scrollBody: {
    maxHeight: 480,
  },
  bodyContent: {
    padding: 20,
    gap: 16,
  },
  bannerBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  bannerText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  inviteSection: {
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  inviteInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  emailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  addMemberBtn: {
    backgroundColor: "#635BFF",
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addMemberBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  rolesRow: {
    flexDirection: "row",
    gap: 6,
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  roleChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  roleChipText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  roleChipTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  membersSection: {
    gap: 8,
  },
  membersList: {
    gap: 8,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  memberEmail: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  memberRoleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  memberRoleText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  removeMemberBtn: {
    padding: 4,
  },
  copyLinkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  copyLinkTitle: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  copyLinkSub: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  doneBtn: {
    width: "100%",
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
