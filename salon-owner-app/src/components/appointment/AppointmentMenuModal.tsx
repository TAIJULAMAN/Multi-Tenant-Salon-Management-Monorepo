import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

interface Props {
  visible: boolean;
  onClose: () => void;
  onOpenSettings: (tab: "general" | "notifications") => void;
  onOpenImport: () => void;
  onExportData: () => void;
}

export default function AppointmentMenuModal({
  visible,
  onClose,
  onOpenSettings,
  onOpenImport,
  onExportData,
}: Props) {
  return (
    <CustomBottomSheet
      visible={visible}
      onClose={onClose}
      title="Appointment Options"
    >
      <View style={styles.menuContainer}>
        {/* General Settings */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => {
            onClose();
            onOpenSettings("general");
          }}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#F3F0FF" }]}>
            <Ionicons name="settings-outline" size={17} color="#635BFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>General Settings</Text>
            <Text style={styles.itemSub}>
              Format, duration & event visibility
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Notifications & Communication */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => {
            onClose();
            onOpenSettings("notifications");
          }}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#E6FFFE" }]}>
            <Ionicons name="notifications-outline" size={17} color="#0D9488" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>Notifications & Communication</Text>
            <Text style={styles.itemSub}>Reminders, SMS, email & reviews</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Import Appointments */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => {
            onClose();
            onOpenImport();
          }}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#EDFBF3" }]}>
            <Ionicons name="cloud-upload-outline" size={17} color="#15803D" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>Import Appointments</Text>
            <Text style={styles.itemSub}>Upload schedules via CSV / Excel</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Export Data */}
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={() => {
            onClose();
            onExportData();
          }}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#F3F4F6" }]}>
            <Ionicons name="download-outline" size={17} color="#4B5563" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>Export Data</Text>
            <Text style={styles.itemSub}>Export current appointments file</Text>
          </View>
          <Ionicons name="share-outline" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </CustomBottomSheet>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    gap: 4,
    paddingTop: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    gap: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 13.5,
    color: "#1F2937",
  },
  itemSub: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 6,
  },
});
