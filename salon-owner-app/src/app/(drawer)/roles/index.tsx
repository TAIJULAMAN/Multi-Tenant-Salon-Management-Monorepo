import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  RoleUser,
  INITIAL_ROLES_DATA,
  getRoleBadgeStyle,
} from "@/components/roles/rolesData";
import EditRoleModal from "@/components/roles/modals/EditRoleModal";
import DeleteRoleModal from "@/components/roles/modals/DeleteRoleModal";
import ActionDropdownModal, {
  ActionDropdownItem,
  AnchorPosition,
} from "@/components/files/modals/ActionDropdownModal";

export default function RolesHomeScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState<RoleUser[]>(INITIAL_ROLES_DATA);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<RoleUser | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchorPos, setAnchorPos] = useState<AnchorPosition | null>(null);

  const filteredRoles = useMemo(() => {
    return roles.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [roles, search]);

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  const openActionMenu = (user: RoleUser, e: any) => {
    setSelectedUser(user);
    if (e?.currentTarget?.measureInWindow) {
      e.currentTarget.measureInWindow((x: number, y: number, width: number, height: number) => {
        setAnchorPos({ x, y, width, height });
        setDropdownVisible(true);
      });
    } else if (e?.nativeEvent?.pageX) {
      setAnchorPos({
        x: e.nativeEvent.pageX - 10,
        y: e.nativeEvent.pageY,
        width: 20,
        height: 20,
      });
      setDropdownVisible(true);
    } else {
      setAnchorPos(null);
      setDropdownVisible(true);
    }
  };

  const handleSaveEdit = (updated: RoleUser) => {
    setRoles(roles.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    setRoles(roles.filter((r) => r.id !== selectedUser.id));
    setDeleteModalVisible(false);
    setSelectedUser(null);
  };

  const dropdownItems: ActionDropdownItem[] = [
    {
      id: "view",
      label: "View Role & Permissions",
      iconName: "eye-outline",
      iconColor: "#635BFF",
      onPress: () => {
        if (selectedUser) {
          router.push({
            pathname: "/(drawer)/roles/[id]" as any,
            params: { id: selectedUser.id, roleName: selectedUser.role },
          });
        }
      },
    },
    {
      id: "edit",
      label: "Edit Assignment",
      iconName: "pencil-outline",
      iconColor: "#38BDF8",
      onPress: () => setEditModalVisible(true),
    },
    {
      id: "delete",
      label: "Remove Role",
      iconName: "trash-outline",
      iconColor: "#F43F5E",
      textColor: "#F43F5E",
      onPress: () => setDeleteModalVisible(true),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.drawerBtn} onPress={handleOpenDrawer} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Roles & Permissions</Text>
          <Text style={styles.headerSubtitle}>Manage staff system access levels</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/(drawer)/roles/create" as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Role</Text>
        </TouchableOpacity>
      </View>

      {/* Search Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, email or role..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Roles List */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {filteredRoles.map((item) => {
            const badge = getRoleBadgeStyle(item.role);

            return (
              <View key={item.id} style={styles.roleCard}>
                {/* Top Row */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.userProfileRow}>
                    <View style={[styles.avatarBox, { backgroundColor: item.avatarBg }]}>
                      <Image source={{ uri: item.avatarUrl }} style={styles.avatarImg} />
                    </View>

                    <View style={styles.userInfo}>
                      <View style={styles.nameRoleRow}>
                        <Text style={styles.userName}>{item.name}</Text>
                        <View style={[styles.roleBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                          <Text style={[styles.roleBadgeText, { color: badge.text }]}>
                            {item.role}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.userEmail}>{item.email}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.kebabBtn}
                    onPress={(e) => openActionMenu(item, e)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="ellipsis-vertical" size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Metadata Footer */}
                <View style={styles.cardMetaRow}>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Assigned Date</Text>
                    <Text style={styles.metaVal}>{item.date}</Text>
                  </View>
                  <View style={styles.metaCol}>
                    <Text style={styles.metaLabel}>Created By</Text>
                    <Text style={styles.metaVal}>{item.createdBy}</Text>
                  </View>
                  <View style={styles.metaColRight}>
                    <Text style={styles.metaLabel}>Updated</Text>
                    <Text style={styles.metaVal}>{item.lastUpdate}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          {filteredRoles.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="shield-outline" size={44} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No roles found</Text>
              <Text style={styles.emptySub}>Try searching with a different keyword.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <EditRoleModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedUser(null);
        }}
        roleUser={selectedUser}
        onSave={handleSaveEdit}
      />

      <DeleteRoleModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setSelectedUser(null);
        }}
        memberName={selectedUser?.name}
        onConfirm={handleDeleteConfirm}
      />

      <ActionDropdownModal
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        items={dropdownItems}
        anchorPosition={anchorPos}
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
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    paddingVertical: 0,
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  listContainer: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userProfileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: 38,
    height: 38,
    resizeMode: "contain",
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  nameRoleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  userName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  roleBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 10.5,
    fontFamily: "Manrope_700Bold",
  },
  userEmail: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  kebabBtn: {
    padding: 6,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 12,
  },
  cardMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaCol: {
    gap: 2,
  },
  metaColRight: {
    gap: 2,
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  metaVal: {
    fontSize: 11.5,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  emptySub: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
});
