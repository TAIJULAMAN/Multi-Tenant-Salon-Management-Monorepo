import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomSwitch from "@/components/ui/CustomSwitch";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

export default function PermissionsTab() {
  const [currentRole, setCurrentRole] = useState("Staff");
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [tempRole, setTempRole] = useState("Staff");

  // Tenant & Users Permissions
  const [tenantPermissions, setTenantPermissions] = useState({
    viewUsers: true,
    manageUsers: false,
    viewRoles: true,
    manageRoles: false,
  });

  // Calendar & Bookings Permissions (matching web dashboard exactly)
  const [bookingPermissions, setBookingPermissions] = useState({
    viewTeamCalendar: true,
    viewOwnCalendar: true,
    createBookings: true,
    editOwnBookings: true,
    editAllBookings: false,
    deleteBookings: false,
    viewClientContactDetails: false,
    modifyWorkSchedules: false,
    applyManualDiscounts: false,
    accessCashRegister: false,
    generateEndDayReports: false,
    exportCustomerList: false,
  });

  const toggleTenant = (key: keyof typeof tenantPermissions) => {
    setTenantPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBooking = (key: keyof typeof bookingPermissions) => {
    setBookingPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    Alert.alert("Reset Permissions", "Are you sure you want to reset all permissions to role defaults?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setTenantPermissions({
            viewUsers: true,
            manageUsers: false,
            viewRoles: true,
            manageRoles: false,
          });
          setBookingPermissions({
            viewTeamCalendar: true,
            viewOwnCalendar: true,
            createBookings: true,
            editOwnBookings: true,
            editAllBookings: false,
            deleteBookings: false,
            viewClientContactDetails: false,
            modifyWorkSchedules: false,
            applyManualDiscounts: false,
            accessCashRegister: false,
            generateEndDayReports: false,
            exportCustomerList: false,
          });
          Alert.alert("Success", "Permissions reset successfully.");
        },
      },
    ]);
  };

  const handleSaveChanges = () => {
    Alert.alert("Saved", "Permissions updated successfully.");
  };

  const confirmRoleChange = () => {
    setCurrentRole(tempRole);
    setIsChangeRoleOpen(false);
    if (tempRole === "Admin") {
      setTenantPermissions({ viewUsers: true, manageUsers: true, viewRoles: true, manageRoles: true });
      setBookingPermissions({
        viewTeamCalendar: true,
        viewOwnCalendar: true,
        createBookings: true,
        editOwnBookings: true,
        editAllBookings: true,
        deleteBookings: true,
        viewClientContactDetails: true,
        modifyWorkSchedules: true,
        applyManualDiscounts: true,
        accessCashRegister: true,
        generateEndDayReports: true,
        exportCustomerList: true,
      });
    } else if (tempRole === "Manager") {
      setTenantPermissions({ viewUsers: true, manageUsers: true, viewRoles: true, manageRoles: false });
      setBookingPermissions({
        viewTeamCalendar: true,
        viewOwnCalendar: true,
        createBookings: true,
        editOwnBookings: true,
        editAllBookings: true,
        deleteBookings: true,
        viewClientContactDetails: true,
        modifyWorkSchedules: true,
        applyManualDiscounts: true,
        accessCashRegister: true,
        generateEndDayReports: false,
        exportCustomerList: false,
      });
    } else {
      setTenantPermissions({ viewUsers: true, manageUsers: false, viewRoles: true, manageRoles: false });
      setBookingPermissions({
        viewTeamCalendar: true,
        viewOwnCalendar: true,
        createBookings: true,
        editOwnBookings: true,
        editAllBookings: false,
        deleteBookings: false,
        viewClientContactDetails: false,
        modifyWorkSchedules: false,
        applyManualDiscounts: false,
        accessCashRegister: false,
        generateEndDayReports: false,
        exportCustomerList: false,
      });
    }
  };

  const tenantItems = [
    { key: "viewUsers", name: "View tenant users and profiles" },
    { key: "manageUsers", name: "Invite and manage tenant users" },
    { key: "viewRoles", name: "View configured system roles" },
    { key: "manageRoles", name: "Assign and change member roles" },
  ];

  const bookingItems = [
    { key: "viewTeamCalendar", name: "View entire team appointment schedule" },
    { key: "viewOwnCalendar", name: "View personal assigned appointments" },
    { key: "createBookings", name: "Create new bookings in calendar" },
    { key: "editOwnBookings", name: "Edit personal bookings" },
    { key: "editAllBookings", name: "Edit appointments of any stylist" },
    { key: "deleteBookings", name: "Delete or cancel client bookings" },
    { key: "viewClientContactDetails", name: "View client private phone & email" },
    { key: "modifyWorkSchedules", name: "Modify weekly shifts and time off" },
    { key: "applyManualDiscounts", name: "Apply custom manual discounts at checkout" },
    { key: "accessCashRegister", name: "Access cash register and take payments" },
    { key: "generateEndDayReports", name: "Generate end-of-day financial closures" },
    { key: "exportCustomerList", name: "Export customer database records" },
  ];

  return (
    <View style={styles.container}>
      {/* Role Pill Banner */}
      <View style={styles.roleBannerCard}>
        <View style={styles.roleBannerLeft}>
          <View style={styles.roleBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#635BFF" />
            <Text style={styles.roleBadgeText}>Current Role: {currentRole}</Text>
          </View>
          <Text style={styles.roleBannerSub}>Customized permissions profile</Text>
        </View>

        <TouchableOpacity
          style={styles.changeRoleHeaderBtn}
          onPress={() => {
            setTempRole(currentRole);
            setIsChangeRoleOpen(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.changeRoleHeaderBtnText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Tenant & Users Permissions Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Tenant & Users</Text>
        {tenantItems.map((item, idx, arr) => (
          <View
            key={item.key}
            style={[
              styles.permissionRow,
              idx === arr.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
            ]}
          >
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionName}>{item.name}</Text>
            </View>
            <CustomSwitch
              value={tenantPermissions[item.key as keyof typeof tenantPermissions]}
              onValueChange={() => toggleTenant(item.key as keyof typeof tenantPermissions)}
            />
          </View>
        ))}
      </View>

      {/* Calendar & Bookings Permissions Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Calendar & Bookings</Text>
        {bookingItems.map((item, idx, arr) => (
          <View
            key={item.key}
            style={[
              styles.permissionRow,
              idx === arr.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 },
            ]}
          >
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionName}>{item.name}</Text>
            </View>
            <CustomSwitch
              value={bookingPermissions[item.key as keyof typeof bookingPermissions]}
              onValueChange={() => toggleBooking(item.key as keyof typeof bookingPermissions)}
            />
          </View>
        ))}
      </View>

      {/* Footer Controls */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          style={styles.changeRoleBtn}
          onPress={() => {
            setTempRole(currentRole);
            setIsChangeRoleOpen(true);
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.changeRoleBtnText}>Change Role</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSaveChanges}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Change Role Sheet using CustomBottomSheet */}
      <CustomBottomSheet
        visible={isChangeRoleOpen}
        onClose={() => setIsChangeRoleOpen(false)}
        title="Change Role"
      >
        <View style={styles.sheetFormContainer}>
          <Text style={styles.sheetDesc}>
            Select a permission preset for this team member:
          </Text>

          {["Staff", "Manager", "Admin"].map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleOptionItem,
                tempRole === r && styles.roleOptionSelected,
              ]}
              onPress={() => setTempRole(r)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  tempRole === r && styles.roleOptionTextSelected,
                ]}
              >
                {r}
              </Text>
              {tempRole === r && (
                <Ionicons name="checkmark-circle" size={20} color="#635BFF" />
              )}
            </TouchableOpacity>
          ))}

          <View style={styles.sheetModalActions}>
            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setIsChangeRoleOpen(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sheetSaveBtn}
              onPress={confirmRoleChange}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetSaveText}>Apply Role</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  roleBannerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleBannerLeft: {
    flex: 1,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  roleBadgeText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  roleBannerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 2,
  },
  changeRoleHeaderBtn: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeRoleHeaderBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 12,
  },
  permissionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  permissionInfo: {
    flex: 1,
    marginRight: 12,
  },
  permissionName: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#334155",
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  changeRoleBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C7D2FE",
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  changeRoleBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  resetBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  resetBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  saveBtn: {
    flex: 1.2,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  sheetFormContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  sheetDesc: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginBottom: 4,
  },
  roleOptionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  roleOptionSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#EEF2FF",
  },
  roleOptionText: {
    fontSize: 14,
    fontFamily: "Manrope_600SemiBold",
    color: "#334155",
  },
  roleOptionTextSelected: {
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  sheetModalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  sheetCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  sheetCancelText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  sheetSaveBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetSaveText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
