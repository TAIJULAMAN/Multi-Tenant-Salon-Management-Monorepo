import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AddServicesDropdownModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (option: "add_service" | "add_bundle" | "add_category" | "import_services") => void;
}

export default function AddServicesDropdownModal({
  visible,
  onClose,
  onSelectOption,
}: AddServicesDropdownModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.dropdownCard}>
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onClose();
              onSelectOption("add_service");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="cut-outline" size={18} color="#635BFF" style={styles.optionIcon} />
            <Text style={styles.optionText}>Add Service</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onClose();
              onSelectOption("add_bundle");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="cube-outline" size={18} color="#0D9488" style={styles.optionIcon} />
            <Text style={styles.optionText}>Add Bundle</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onClose();
              onSelectOption("add_category");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="pricetags-outline" size={18} color="#F59E0B" style={styles.optionIcon} />
            <Text style={styles.optionText}>Add Category</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              onClose();
              onSelectOption("import_services");
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="cloud-upload-outline" size={18} color="#3B82F6" style={styles.optionIcon} />
            <Text style={styles.optionText}>Import Services</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 155,
    paddingRight: 16,
  },
  dropdownCard: {
    width: 210,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 10,
  },
});
