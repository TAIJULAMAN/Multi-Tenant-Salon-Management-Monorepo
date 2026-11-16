import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import { teamStore, TeamMember } from "@/components/team/CreateTeam/teamStore";

export default function TeamMembersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Mock team data from store
  const [members, setMembers] = useState<TeamMember[]>(teamStore.getMembers());

  useEffect(() => {
    const unsubscribe = teamStore.subscribe(() => {
      setMembers(teamStore.getMembers());
    });
    return unsubscribe;
  }, []);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOptionPress = (action: string, member: TeamMember) => {
    setActiveMenuId(null);
    if (action === "details") {
      router.push({
        pathname: "/team/details/[id]",
        params: {
          id: member.id,
          name: member.name,
          role: member.role,
          avatar: member.avatarUrl,
        },
      });
    } else if (action === "calendar") {
      Alert.alert("Calendar", `Opening schedule calendar for ${member.name}`);
    } else if (action === "password") {
      Alert.alert("Reset Password", `Are you sure you want to send a password reset link to ${member.name}?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: () => Alert.alert("Success", "Password reset link sent successfully!") },
      ]);
    } else if (action === "suspend") {
      const isSuspending = !member.isSuspended;
      Alert.alert(
        isSuspending ? "Suspend Member" : "Activate Member",
        `Are you sure you want to ${isSuspending ? "suspend" : "activate"} ${member.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: isSuspending ? "Suspend" : "Activate",
            style: isSuspending ? "destructive" : "default",
            onPress: () => {
              teamStore.toggleSuspend(member.id);
              Alert.alert(
                "Success",
                `${member.name} has been ${isSuspending ? "suspended" : "activated"}.`
              );
            },
          },
        ]
      );
    }
  };

  const handleAddMember = () => {
    router.push("/(drawer)/(tabs)/team/add" as any);
  };

  const handleImportMembers = () => {
    router.push("/(drawer)/(tabs)/team/import" as any);
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 15) }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Team Members</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleImportMembers} activeOpacity={0.7}>
            <Ionicons name="cloud-upload-outline" size={20} color="#635BFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleAddMember} activeOpacity={0.7}>
            <Ionicons name="person-add-outline" size={20} color="#5C55FF" />
          </TouchableOpacity>
          <Avatar
            name="Maria Fernandez"
            uri="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
            size={34}
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search staff members..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Members List */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeMenuId && (
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setActiveMenuId(null)}
          />
        )}
        {filteredMembers.map((member) => (
          <View
            key={member.id}
            style={[
              styles.memberCard,
              member.isSuspended && styles.memberCardSuspended,
              { 
                zIndex: activeMenuId === member.id ? 100 : 1,
                elevation: activeMenuId === member.id ? 5 : 1,
              },
            ]}
          >
            <View style={styles.memberInfo}>
              <Image source={{ uri: member.avatarUrl || (member as any).avatar }} style={styles.avatarImage} />
              <View style={styles.textContainer}>
                <Text style={[styles.memberName, member.isSuspended && styles.textSuspended]}>
                  {member.name}
                </Text>
                <Text style={styles.memberRole}>
                  {member.isSuspended ? "Suspended" : member.role}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.optionsBtn}
              onPress={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Dropdown overlay */}
            {activeMenuId === member.id && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleOptionPress("details", member)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="eye-outline" size={16} color="#4B5563" style={styles.dropdownIcon} />
                  <Text style={styles.dropdownText}>View Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleOptionPress("calendar", member)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calendar-outline" size={16} color="#4B5563" style={styles.dropdownIcon} />
                  <Text style={styles.dropdownText}>View Calendar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleOptionPress("password", member)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="key-outline" size={16} color="#4B5563" style={styles.dropdownIcon} />
                  <Text style={styles.dropdownText}>Reset Password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.dropdownItem, styles.dropdownItemDelete]}
                  onPress={() => handleOptionPress("suspend", member)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={member.isSuspended ? "checkmark-circle-outline" : "person-remove-outline"}
                    size={16}
                    color={member.isSuspended ? "#10B981" : "#F43F5E"}
                    style={styles.dropdownIcon}
                  />
                  <Text
                    style={[
                      styles.dropdownTextDelete,
                      member.isSuspended && { color: "#10B981" },
                    ]}
                  >
                    {member.isSuspended ? "Activate" : "Suspend"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button (FAB) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddMember}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 90,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#111827",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    padding: 4,
    position: "relative",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: "#1F2937",
    paddingVertical: 0,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
  },
  memberCardSuspended: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
  },
  textContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#1F2937",
    marginBottom: 2,
  },
  textSuspended: {
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  memberRole: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#6B7280",
  },
  optionsBtn: {
    padding: 8,
  },
  dropdownMenu: {
    position: "absolute",
    right: 12,
    top: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    paddingVertical: 4,
    minWidth: 150,
    zIndex: 101,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
  },
  dropdownIcon: {
    width: 16,
  },
  dropdownText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#374151",
  },
  dropdownItemDelete: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  dropdownTextDelete: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#F43F5E",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#5C55FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#5C55FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
