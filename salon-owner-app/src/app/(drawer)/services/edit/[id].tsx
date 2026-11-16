import React, { useState, useEffect } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "@/components/Avatar";
import Checkbox from "@/components/ui/Checkbox";
import CustomSwitch from "@/components/ui/CustomSwitch";
import {
  categoryColorMap,
  mockMembers,
  serviceIconList,
  initialServices,
  ServiceRecord,
} from "@/components/services/servicesData";

export default function EditServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const foundService =
    initialServices.find((s) => s.id === id) || initialServices[0];

  // Form states
  const [name, setName] = useState(foundService.name);
  const [category, setCategory] = useState(foundService.category);
  const [duration, setDuration] = useState(foundService.duration);
  const [postBreak, setPostBreak] = useState(foundService.postBreak);
  const [priceType, setPriceType] = useState<"Fixed" | "Starting at">("Fixed");
  const [price, setPrice] = useState(foundService.price.replace("€", "").trim());
  const [vat, setVat] = useState(foundService.vat.replace("€", "").trim());
  const [description, setDescription] = useState(foundService.description || "");
  const [onlineBooking, setOnlineBooking] = useState(
    foundService.onlineBooking !== false
  );

  // Staff members required
  const initialAssigned = foundService.assignedMembers || [1, 2, 3, 4];
  const [isAllMembers, setIsAllMembers] = useState(
    initialAssigned.length === mockMembers.length
  );
  const [selectedMemberIds, setSelectedMemberIds] =
    useState<number[]>(initialAssigned);

  // Selected icon
  const [selectedIconName, setSelectedIconName] = useState(
    foundService.iconName || "cut-outline"
  );

  useEffect(() => {
    if (foundService) {
      setName(foundService.name);
      setCategory(foundService.category);
      setDuration(foundService.duration);
      setPostBreak(foundService.postBreak);
      setPrice(foundService.price.replace("€", "").trim());
      setVat(foundService.vat.replace("€", "").trim());
      setDescription(foundService.description || "");
      setOnlineBooking(foundService.onlineBooking !== false);
      if (foundService.assignedMembers) {
        setSelectedMemberIds(foundService.assignedMembers);
        setIsAllMembers(
          foundService.assignedMembers.length === mockMembers.length
        );
      }
      if (foundService.iconName) {
        setSelectedIconName(foundService.iconName);
      }
    }
  }, [id]);

  const toggleMember = (memberId: number) => {
    if (selectedMemberIds.includes(memberId)) {
      const next = selectedMemberIds.filter((mId) => mId !== memberId);
      setSelectedMemberIds(next);
      setIsAllMembers(false);
    } else {
      const next = [...selectedMemberIds, memberId];
      setSelectedMemberIds(next);
      if (next.length === mockMembers.length) {
        setIsAllMembers(true);
      }
    }
  };

  const toggleAllMembers = (val: boolean) => {
    setIsAllMembers(val);
    if (val) {
      setSelectedMemberIds(mockMembers.map((m) => m.id));
    } else {
      setSelectedMemberIds([]);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter a service name.");
      return;
    }
    if (!price.trim()) {
      Alert.alert("Required Field", "Please enter the service price.");
      return;
    }

    Alert.alert(
      "Changes Saved",
      `Service "${name}" has been updated successfully.`,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Edit Service</Text>
          <Text style={styles.headerSub}>
            Update pricing, duration, assignments & icon
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Details Section */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Basic Details</Text>
          </View>

          {/* Online Booking Checkbox Row */}
          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => setOnlineBooking(!onlineBooking)}
            activeOpacity={0.7}
          >
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchLabel}>Add it to online bookings</Text>
              <Text style={styles.switchSub}>
                Allow clients to discover and book this service online
              </Text>
            </View>
            <Checkbox
              checked={onlineBooking}
              onPress={() => setOnlineBooking(!onlineBooking)}
              color="#635BFF"
            />
          </TouchableOpacity>

          {/* Service Name */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Service Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Haircut"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Category Chips */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Category *</Text>
            <View style={styles.categoryChipsRow}>
              {Object.keys(categoryColorMap).map((cat) => {
                const isSelected = category === cat;
                const colorStyle = categoryColorMap[cat];
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: colorStyle.bg,
                        borderColor: isSelected
                          ? colorStyle.text
                          : colorStyle.border,
                      },
                      isSelected && styles.categoryChipSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        { color: colorStyle.text },
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Duration & Post Break */}
          <View style={styles.rowTwoCols}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Default Duration</Text>
              <TextInput
                style={styles.textInput}
                placeholder="45 min"
                placeholderTextColor="#94A3B8"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Post-break Min</Text>
              <TextInput
                style={styles.textInput}
                placeholder="15 min"
                placeholderTextColor="#94A3B8"
                value={postBreak}
                onChangeText={setPostBreak}
              />
            </View>
          </View>

          {/* Price Type, Price, VAT */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Price Type</Text>
            <View style={styles.priceTypeRow}>
              {(["Fixed", "Starting at"] as const).map((type) => {
                const isSelected = priceType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.priceTypeChip,
                      isSelected && styles.priceTypeChipSelected,
                    ]}
                    onPress={() => setPriceType(type)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.priceTypeText,
                        isSelected && styles.priceTypeTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.rowTwoCols}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Price (€) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 35"
                placeholderTextColor="#94A3B8"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>VAT (€)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 7"
                placeholderTextColor="#94A3B8"
                value={vat}
                onChangeText={setVat}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe this service..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Members Required Section */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Members Required</Text>
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchLabel}>All Staff Members</Text>
              <Text style={styles.switchSub}>
                Assign every stylist to perform this service
              </Text>
            </View>
            <CustomSwitch
              value={isAllMembers}
              onValueChange={toggleAllMembers}
            />
          </View>

          <View style={styles.membersGrid}>
            {mockMembers.map((member) => {
              const isSelected = selectedMemberIds.includes(member.id);
              return (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    styles.memberCardItem,
                    isSelected && styles.memberCardItemSelected,
                  ]}
                  onPress={() => toggleMember(member.id)}
                  activeOpacity={0.7}
                >
                  <Avatar name={member.name} uri={member.avatar} size={38} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <View
                    style={[
                      styles.memberCheckbox,
                      isSelected && styles.memberCheckboxActive,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Icon Selection Section */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Icon</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Select an icon to represent this service across the app
          </Text>

          <View style={styles.iconsGrid}>
            {serviceIconList.map((item) => {
              const isSelected = selectedIconName === item.name;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.iconBox,
                    isSelected && styles.iconBoxSelected,
                  ]}
                  onPress={() => setSelectedIconName(item.name)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.name as any}
                    size={22}
                    color={isSelected ? "#FFFFFF" : "#635BFF"}
                  />
                  <Text
                    style={[
                      styles.iconLabel,
                      isSelected && styles.iconLabelSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer Actions */}
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
          style={styles.saveSubmitBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          <Text style={styles.saveSubmitBtnText}>Save Changes</Text>
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
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  cardSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: -8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  switchLabel: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  switchSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  formGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 75,
    textAlignVertical: "top",
  },
  categoryChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  categoryChipSelected: {
    borderWidth: 2,
  },
  categoryChipText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  rowTwoCols: {
    flexDirection: "row",
    gap: 12,
  },
  priceTypeRow: {
    flexDirection: "row",
    gap: 10,
  },
  priceTypeChip: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  priceTypeChipSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  priceTypeText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  priceTypeTextSelected: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  membersGrid: {
    gap: 8,
  },
  memberCardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  memberCardItemSelected: {
    borderColor: "#C7D2FE",
    backgroundColor: "#F5F7FF",
  },
  memberName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  memberRole: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  memberCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  memberCheckboxActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  iconBox: {
    width: "22.5%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    padding: 4,
  },
  iconBoxSelected: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  iconLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  iconLabelSelected: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
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
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  saveSubmitBtn: {
    flex: 2,
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveSubmitBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
