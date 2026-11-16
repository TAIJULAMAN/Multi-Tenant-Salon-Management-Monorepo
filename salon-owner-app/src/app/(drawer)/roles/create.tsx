import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PERMISSION_CATEGORIES } from "@/components/roles/rolesData";
import CustomSwitch from "@/components/ui/CustomSwitch";

export default function CreateRoleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    PERMISSION_CATEGORIES.forEach((cat) => {
      cat.items.forEach((it) => {
        initial[it.id] = it.defaultChecked;
      });
    });
    return initial;
  });

  const togglePermission = (id: string) => {
    setPermissions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      Alert.alert("Validation Error", "Please enter a role name.");
      return;
    }

    Alert.alert(
      "Role Created",
      `The role "${roleName.trim()}" with custom permissions has been created successfully.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Create Role</Text>
          <Text style={styles.headerSubtitle}>Define role name and access privileges</Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Basic Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Role Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Senior Stylist, Front Desk Manager"
              placeholderTextColor="#94A3B8"
              value={roleName}
              onChangeText={setRoleName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter a brief summary of duties and authority..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Permissions Categories */}
        <View style={styles.permissionsContainer}>
          <Text style={styles.permissionsHeading}>Role Permissions</Text>

          {PERMISSION_CATEGORIES.map((category) => (
            <View key={category.id} style={styles.card}>
              <View style={styles.categoryHeader}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#635BFF" />
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>

              <View style={styles.permissionItemsList}>
                {category.items.map((item, idx) => {
                  const isChecked = !!permissions[item.id];
                  const isLast = idx === category.items.length - 1;

                  return (
                    <View
                      key={item.id}
                      style={[styles.permissionRow, !isLast && styles.permissionRowBorder]}
                    >
                      <View style={styles.permissionInfo}>
                        <Text style={styles.permissionTitle}>{item.title}</Text>
                        <Text style={styles.permissionSubtitle}>{item.subtitle}</Text>
                      </View>

                      <CustomSwitch
                        value={isChecked}
                        onValueChange={() => togglePermission(item.id)}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Buttons */}
      <View
        style={[
          styles.fixedFooter,
          { paddingBottom: Math.max(insets.bottom, 14) },
        ]}
      >
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.createBtnText}>Create Role</Text>
        </TouchableOpacity>
      </View>
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
  backBtn: {
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
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
    marginBottom: 6,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
  },
  textArea: {
    height: 80,
    paddingTop: 10,
  },
  permissionsContainer: {
    gap: 12,
  },
  permissionsHeading: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
    marginTop: 4,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  permissionItemsList: {
    gap: 2,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    gap: 12,
  },
  permissionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  permissionInfo: {
    flex: 1,
    gap: 2,
  },
  permissionTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  permissionSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    lineHeight: 15,
  },
  fixedFooter: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#475569",
  },
  createBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  createBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
