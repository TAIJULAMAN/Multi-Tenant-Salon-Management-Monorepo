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
import Avatar from "@/components/Avatar";
import CustomSwitch from "@/components/ui/CustomSwitch";
import {
  categoryColorMap,
  mockMembers,
  serviceIconList,
  initialServices,
} from "@/components/services/servicesData";

export default function AddServiceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Category 1");
  const [duration, setDuration] = useState("45 min");
  const [postBreak, setPostBreak] = useState("15 min");
  const [priceType, setPriceType] = useState<"Fixed" | "Starting at">("Fixed");
  const [price, setPrice] = useState("");
  const [vat, setVat] = useState("");
  const [description, setDescription] = useState("");
  const [onlineBooking, setOnlineBooking] = useState(true);

  // Staff members required
  const [isAllMembers, setIsAllMembers] = useState(true);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([1, 2, 3, 4]);

  // Selected icon
  const [selectedIconName, setSelectedIconName] = useState("cut-outline");

  const toggleMember = (id: number) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((mId) => mId !== id));
      setIsAllMembers(false);
    } else {
      const next = [...selectedMemberIds, id];
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
      "Service Created",
      `"${name}" has been successfully added to ${category} and made available for booking.`,
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
          <Text style={styles.headerTitle}>Add Service</Text>
          <Text style={styles.headerSub}>Create and configure a new salon service</Text>
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

          {/* Online Booking Switch Card */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchLabel}>Add it to online bookings</Text>
              <Text style={styles.switchSub}>Clients can discover and book this on your web app</Text>
            </View>
            <CustomSwitch value={onlineBooking} onValueChange={setOnlineBooking} />
          </View>

          {/* Service Name */}
          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Service Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Balayage & Gloss"
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
                      { backgroundColor: colorStyle.bg, borderColor: isSelected ? colorStyle.text : colorStyle.border },
                      isSelected && styles.categoryChipSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.categoryChipText, { color: colorStyle.text }]}>{cat}</Text>
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
                    style={[styles.priceTypeChip, isSelected && styles.priceTypeChipSelected]}
                    onPress={() => setPriceType(type)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.priceTypeText, isSelected && styles.priceTypeTextSelected]}>
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
                placeholder="e.g. 45"
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
                placeholder="e.g. 9"
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
              placeholder="Describe this service, techniques, or included steps..."
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
              <Text style={styles.switchSub}>Assign every stylist to perform this service</Text>
            </View>
            <CustomSwitch value={isAllMembers} onValueChange={toggleAllMembers} />
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
                    {isSelected && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Icon Selector Section */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Service Icon</Text>
          </View>

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
                    color={isSelected ? "#635BFF" : "#64748B"}
                  />
                  <Text style={[styles.iconLabel, isSelected && styles.iconLabelSelected]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Footer Save Action */}
        <TouchableOpacity
          style={styles.saveSubmitBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.saveSubmitBtnText}>Save Service</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  cardSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  sectionHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
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
    marginTop: 1,
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
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  categoryChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
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
    gap: 10,
  },
  priceTypeRow: {
    flexDirection: "row",
    gap: 8,
  },
  priceTypeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
  },
  priceTypeChipSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#EEF2FF",
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

  // Members
  membersGrid: {
    gap: 8,
  },
  memberCardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  memberCardItemSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#F5F3FF",
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
    marginTop: 1,
  },
  memberCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
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

  // Icons
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconBox: {
    width: "23%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 4,
  },
  iconBoxSelected: {
    borderColor: "#635BFF",
    backgroundColor: "#EEF2FF",
  },
  iconLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  iconLabelSelected: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },

  // Save
  saveSubmitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveSubmitBtnText: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
});
