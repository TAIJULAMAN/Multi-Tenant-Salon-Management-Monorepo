import React, { useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, shadows, typography } from "@/constants/figmaTheme";
import { FileMember, INITIAL_MEMBERS, PERMISSION_OPTIONS, PermissionRole, TEAM_DIRECTORY } from "../filesData";
import FilesModal, { ModalInput, modalStyles } from "./FilesModal";

/** Last saved access list (the dialog is remounted on every open). */
let savedMembers: FileMember[] = INITIAL_MEMBERS;

/**
 * Figma 1:7616 — "Manage Permissions" dialog.
 * Figma 1:8299 — same dialog with the role dropdown (View Only / Add Files / Edit Content) open.
 */
export default function ManagePermissionModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<FileMember[]>(savedMembers);
  const [search, setSearch] = useState("");
  const [openRoleFor, setOpenRoleFor] = useState<number | null>(null);

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return TEAM_DIRECTORY.filter(
      (p) =>
        !draft.some((m) => m.id === p.id) &&
        (p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
    );
  }, [search, draft]);

  const addMember = (p: Omit<FileMember, "role">) => {
    setDraft((prev) => [...prev, { ...p, role: "View Only" }]);
    setSearch("");
  };

  const setRole = (id: number, role: PermissionRole) => {
    setDraft((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
    setOpenRoleFor(null);
  };

  const handleSave = () => {
    savedMembers = draft;
    onClose();
  };

  return (
    <FilesModal visible={visible} onClose={onClose} title="Manage Permissions" onSave={handleSave}>
      <View style={styles.searchGroup}>
        <ModalInput
          label="Add Member *"
          placeholder="Search a member"
          icon="search-outline"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {results.length > 0 ? (
          <View style={styles.dropdown}>
            {results.map((p) => (
              <TouchableOpacity key={p.id} style={styles.option} onPress={() => addMember(p)} activeOpacity={0.7}>
                <Text style={typography.body}>{p.name}</Text>
                <Text style={modalStyles.personSub}>{p.email}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : search.trim() ? (
          <Text style={[typography.caption, { marginTop: 8 }]}>No members found</Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={modalStyles.sectionLabel}>People with Access</Text>
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent} keyboardShouldPersistTaps="handled">
          {draft.map((m) => (
            <View key={m.id} style={{ zIndex: openRoleFor === m.id ? 10 : 0 }}>
              <View style={styles.personRow}>
                <Image source={{ uri: m.avatar }} style={styles.avatar} />
                <View style={styles.personInfo}>
                  <Text style={modalStyles.personName} numberOfLines={1}>
                    {m.name}
                  </Text>
                  <Text style={modalStyles.personSub} numberOfLines={1}>
                    {m.email}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.roleSelect}
                  onPress={() => setOpenRoleFor(openRoleFor === m.id ? null : m.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[typography.body, styles.roleText]} numberOfLines={1}>
                    {m.role}
                  </Text>
                  <Ionicons name={openRoleFor === m.id ? "chevron-up" : "chevron-down"} size={18} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
              {openRoleFor === m.id ? (
                <View style={[styles.dropdown, { marginTop: 8 }]}>
                  {PERMISSION_OPTIONS.map((opt) => (
                    <TouchableOpacity key={opt} style={styles.option} onPress={() => setRole(m.id, opt)} activeOpacity={0.7}>
                      <Text style={[typography.body, opt === m.role && { color: colors.primary }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>
      </View>
    </FilesModal>
  );
}

const styles = StyleSheet.create({
  searchGroup: { zIndex: 20 },
  section: { gap: 16, flexShrink: 1 },
  list: { maxHeight: 320 },
  listContent: { gap: 16, paddingBottom: 4 },
  personRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: radius.card, backgroundColor: colors.canvas },
  personInfo: { flex: 1 },
  roleSelect: {
    width: 136,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  roleText: { flex: 1, color: colors.textMuted },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    paddingVertical: 8,
    marginTop: 8,
    ...shadows.overlay,
  },
  option: { paddingVertical: 6, paddingHorizontal: 14 },
});
