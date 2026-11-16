import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setSelectedSalon } from "@/redux/slices/salonSlice";
import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

interface SalonGlobalHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function SalonGlobalHeader({
  title,
  showBack = false,
  onBack,
  rightAction,
}: SalonGlobalHeaderProps) {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const dispatch = useDispatch();

  const selectedSalon = useSelector(
    (state: RootState) => state.salon.selectedSalon
  );
  const availableSalons = useSelector(
    (state: RootState) => state.salon.availableSalons
  );

  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onBack ? onBack : () => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={26} color="#1F2937" />
          </TouchableOpacity>
        )}

        {/* Global Salon Switcher Pill */}
        <TouchableOpacity
          style={styles.salonPickerBtn}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="business" size={15} color="#635BFF" style={{ marginRight: 6 }} />
          <View style={styles.salonTextWrap}>
            <Text style={styles.salonLabel}>{title || "Active Salon"}</Text>
            <Text style={styles.salonName} numberOfLines={1}>
              {selectedSalon}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={13} color="#635BFF" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.headerRight}>
        {rightAction ? (
          rightAction
        ) : (
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={() => router.push("/notifications" as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#1F2937" />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
        )}
      </View>

      {/* Global Salon Selector Bottom Sheet */}
      {showPicker && (
        <CustomBottomSheet
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          title="Select Active Salon"
        >
          <View style={{ paddingTop: 4, gap: 10 }}>
            {availableSalons.map((salon) => {
              const isSelected = selectedSalon === salon;

              return (
                <TouchableOpacity
                  key={salon}
                  style={[
                    styles.salonModalItem,
                    isSelected && styles.salonModalItemSelected,
                  ]}
                  onPress={() => {
                    dispatch(setSelectedSalon(salon));
                    setShowPicker(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <View
                      style={[
                        styles.salonIconBox,
                        isSelected && styles.salonIconBoxSelected,
                      ]}
                    >
                      <Ionicons
                        name={salon === "All Salons" ? "grid-outline" : "business-outline"}
                        size={18}
                        color={isSelected ? "#FFFFFF" : "#635BFF"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.salonModalText,
                        isSelected && styles.salonModalTextSelected,
                      ]}
                    >
                      {salon}
                    </Text>
                  </View>

                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#635BFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </CustomBottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
  },
  salonPickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    maxWidth: "80%",
  },
  salonTextWrap: {
    justifyContent: "center",
  },
  salonLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  salonName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
    maxWidth: 130,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4F5F7",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badgeDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#EF4444",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  salonModalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  salonModalItemSelected: {
    backgroundColor: "#EEECFF",
    borderColor: "#635BFF",
  },
  salonIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
  },
  salonIconBoxSelected: {
    backgroundColor: "#635BFF",
  },
  salonModalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  salonModalTextSelected: {
    color: "#635BFF",
    fontWeight: "700",
  },
});
