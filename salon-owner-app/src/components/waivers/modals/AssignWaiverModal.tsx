import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WaiverItem, ALL_CLIENTS_LIST, ALL_EMPLOYEES_LIST } from "../waiversData";

interface AssignWaiverModalProps {
  visible: boolean;
  onClose: () => void;
  waiver: WaiverItem | null;
  mode: "client" | "employee";
}

export default function AssignWaiverModal({
  visible,
  onClose,
  waiver,
  mode,
}: AssignWaiverModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isClient = mode === "client";
  const title = isClient ? "Assign to Client's Profiles" : "Assign to Employee";

  const listData = useMemo(() => {
    const raw = isClient ? ALL_CLIENTS_LIST : ALL_EMPLOYEES_LIST;
    return raw.filter((item: any) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [isClient, search]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === listData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(listData.map((d: any) => d.id));
    }
  };

  const handleAssign = () => {
    if (selectedIds.length === 0) {
      Alert.alert("Selection Required", `Please select at least one ${isClient ? "client" : "employee"}.`);
      return;
    }

    Alert.alert(
      "Waiver Assigned!",
      `"${waiver?.name}" has been assigned to ${selectedIds.length} ${isClient ? "client profile(s)" : "employee(s)"}.`,
      [{ text: "OK", onPress: () => {
        setSelectedIds([]);
        onClose();
      }}]
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
              <View style={[styles.iconCircle, { backgroundColor: isClient ? "#D1FAE5" : "#EEF2FF" }]}>
                <Ionicons
                  name={isClient ? "people" : "person-add"}
                  size={18}
                  color={isClient ? "#10B981" : "#635BFF"}
                />
              </View>
              <Text style={styles.title}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.bodyContent}>
            {/* Waiver Name Preview */}
            <View style={styles.waiverBanner}>
              <Ionicons name="document-text-outline" size={16} color="#635BFF" />
              <Text style={styles.waiverBannerText} numberOfLines={1}>
                {waiver?.name}
              </Text>
            </View>

            {/* Search and Select All Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder={`Search ${isClient ? "clients" : "employees"} by name or email...`}
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

            <View style={styles.selectHeaderRow}>
              <Text style={styles.selectCountText}>
                {selectedIds.length} of {listData.length} selected
              </Text>
              <TouchableOpacity onPress={handleSelectAll}>
                <Text style={styles.selectAllBtnText}>
                  {selectedIds.length === listData.length ? "Deselect All" : "Select All"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
              <View style={styles.itemsList}>
                {listData.map((item: any) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                      onPress={() => toggleSelect(item.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.checkboxBox}>
                        <Ionicons
                          name={isSelected ? "checkbox" : "square-outline"}
                          size={20}
                          color={isSelected ? "#635BFF" : "#CBD5E1"}
                        />
                      </View>

                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemSub}>
                          {item.role ? `${item.role} • ` : ""}{item.email}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, selectedIds.length === 0 && styles.saveBtnDisabled]}
              onPress={handleAssign}
              activeOpacity={0.85}
              disabled={selectedIds.length === 0}
            >
              <Text style={styles.saveBtnText}>
                Assign to {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
              </Text>
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
    maxWidth: 500,
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
  bodyContent: {
    padding: 16,
    gap: 12,
  },
  waiverBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  waiverBannerText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  selectHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  selectCountText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  selectAllBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  scrollList: {
    maxHeight: 280,
  },
  itemsList: {
    gap: 8,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  itemCardSelected: {
    borderColor: "#C7D2FE",
    backgroundColor: "#F5F3FF",
  },
  checkboxBox: {
    padding: 2,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  itemSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
