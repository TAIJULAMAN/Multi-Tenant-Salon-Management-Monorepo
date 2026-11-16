import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/constants/figmaTheme";
import { staffList } from "./data";
import { StaffMember } from "./types";
import { FigmaModal, SquareAvatar, ui } from "./ui";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (member: StaffMember) => void;
}

/** Figma 1:22453 "Search a Member": search field + "Recent research" list. */
export default function SearchMemberModal({ visible, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staffList.slice(0, 4);
    return staffList.filter(
      (s) => s.name.toLowerCase().includes(q) || s.phone.replace(/\s/g, "").includes(q.replace(/\s/g, ""))
    );
  }, [query]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  return (
    <FigmaModal visible={visible} onClose={handleClose} title="Search a Member">
      <View style={ui.searchBox}>
        <Ionicons name="search-outline" size={18} color={colors.text} />
        <TextInput
          style={ui.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
      </View>

      <Text style={styles.section}>{query.trim() ? "Results" : "Recent research"}</Text>
      {results.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => {
            onSelect(m);
            handleClose();
          }}
        >
          <SquareAvatar uri={m.avatar} name={m.name} size={48} bg={m.bgColor} rounded={10} />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{m.name}</Text>
            <Text style={styles.phone}>{m.phone}</Text>
          </View>
        </TouchableOpacity>
      ))}
      {results.length === 0 && <Text style={styles.phone}>No members found.</Text>}
    </FigmaModal>
  );
}

const styles = StyleSheet.create({
  section: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  name: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  phone: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
