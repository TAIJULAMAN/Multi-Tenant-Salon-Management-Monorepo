import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CategoryRecord, categoryColorMap } from "../servicesData";

interface EditCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  category: CategoryRecord | null;
  onSave: (updatedCategory: CategoryRecord) => void;
}

export default function EditCategoryModal({ visible, onClose, category, onSave }: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColorKey, setSelectedColorKey] = useState("Category 1");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      const matchedKey = Object.keys(categoryColorMap).find(
        (k) => categoryColorMap[k].bg === category.categoryStyle.bg
      );
      setSelectedColorKey(matchedKey || "Category 1");
    }
  }, [category, visible]);

  const handleSave = () => {
    if (!name.trim() || !category) {
      Alert.alert("Required", "Please enter a category name.");
      return;
    }
    onSave({
      ...category,
      name: name.trim(),
      description: description.trim(),
      categoryStyle: categoryColorMap[selectedColorKey] || category.categoryStyle,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modalCard} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="create-outline" size={18} color="#635BFF" />
              </View>
              <Text style={styles.title}>Edit Category</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Category name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Color Theme</Text>
              <View style={styles.colorPaletteRow}>
                {Object.keys(categoryColorMap).map((catKey) => {
                  const style = categoryColorMap[catKey];
                  const isSelected = selectedColorKey === catKey;
                  return (
                    <TouchableOpacity
                      key={catKey}
                      style={[
                        styles.colorChip,
                        { backgroundColor: style.bg, borderColor: isSelected ? style.text : style.border },
                        isSelected && styles.colorChipSelected,
                      ]}
                      onPress={() => setSelectedColorKey(catKey)}
                    >
                      <Text style={[styles.colorChipText, { color: style.text }]}>{catKey}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Update Category</Text>
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
    maxWidth: 420,
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
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
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
    backgroundColor: "#EEF2FF",
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
  body: {
    padding: 18,
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  input: {
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
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  colorPaletteRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  colorChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  colorChipSelected: {
    borderWidth: 2,
  },
  colorChipText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#635BFF",
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
