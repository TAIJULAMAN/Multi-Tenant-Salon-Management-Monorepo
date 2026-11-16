import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointmentTitle?: string;
}

export default function DeleteAppointmentModal({
  visible,
  onClose,
  onConfirm,
  appointmentTitle,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.dialogCard} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Delete Appointment</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={20} color="#98A4AE" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.body}>
            <View style={styles.iconCircle}>
              <Ionicons name="trash-outline" size={26} color="#FF6692" />
            </View>
            <Text style={styles.confirmHeading}>Are you sure?</Text>
            <Text style={styles.confirmSub}>
              {appointmentTitle
                ? `Delete appointment for ${appointmentTitle}? This action cannot be undone.`
                : "This action cannot be undone. This appointment will be permanently deleted."}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.7}
              onPress={onClose}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              activeOpacity={0.8}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(41, 52, 61, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialogCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  title: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#29343D",
  },
  closeBtn: {
    padding: 4,
    borderRadius: 8,
  },
  body: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF5F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  confirmHeading: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#29343D",
    marginBottom: 6,
  },
  confirmSub: {
    fontFamily: "Manrope_500Medium",
    fontSize: 13,
    color: "#526B7A",
    textAlign: "center",
    lineHeight: 19,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E6EB",
  },
  cancelBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#29343D",
  },
  deleteBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#FF6692",
  },
  deleteBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
  },
});
