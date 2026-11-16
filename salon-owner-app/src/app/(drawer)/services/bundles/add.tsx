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
import { categoryColorMap } from "@/components/services/servicesData";

import AddServiceToBundleModal from "@/components/services/modals/AddServiceToBundleModal";
import AddMemberToBundleModal from "@/components/services/modals/AddMemberToBundleModal";

export default function AddBundleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Category 1");
  const [duration, setDuration] = useState("60 min");
  const [priceType, setPriceType] = useState("Fixed");
  const [price, setPrice] = useState("");
  const [scheduleType, setScheduleType] = useState("Booked in sequence");
  const [description, setDescription] = useState("");
  const [onlineBooking, setOnlineBooking] = useState(true);

  // Selected services inside bundle
  const [selectedServices, setSelectedServices] = useState<
    { id: string; name: string; duration: string; price: string }[]
  >([
    { id: "1", name: "Classic Haircut", duration: "45 min", price: "€ 35" },
    { id: "4", name: "Wash & Blow Dry", duration: "30 min", price: "€ 25" },
  ]);

  // Selected staff members inside bundle
  const [selectedMembers, setSelectedMembers] = useState<
    { id: string; name: string; avatar: string }[]
  >([
    { id: "1", name: "Maria Rodriguez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" },
    { id: "2", name: "Leslie Alexander", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80" },
  ]);

  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const handleAddService = (service: { id: string; name: string; duration: string; price: string }) => {
    if (!selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
  };

  const handleAddMembers = (newMembers: { id: string; name: string; avatar: string }[]) => {
    const unique = newMembers.filter((nm) => !selectedMembers.find((m) => m.id === nm.id));
    setSelectedMembers([...selectedMembers, ...unique]);
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== memberId));
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter a bundle package name.");
      return;
    }
    if (!price.trim()) {
      Alert.alert("Required Field", "Please specify the combo price.");
      return;
    }

    Alert.alert(
      "Bundle Created",
      `"${name}" with ${selectedServices.length} services has been saved.`,
      [{ text: "OK", onPress: () => router.back() }]
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
          <Text style={styles.headerTitle}>Add Bundle Package</Text>
          <Text style={styles.headerSub}>Create bundled services with special combo pricing</Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Details Section */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>Basic Details</Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchLabel}>Add it to online bookings</Text>
              <Text style={styles.switchSub}>Allow clients to book this package online</Text>
            </View>
            <CustomSwitch value={onlineBooking} onValueChange={setOnlineBooking} />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Bundle Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Complete Refresh Combo"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

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

          <View style={styles.rowTwoCols}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Duration</Text>
              <TextInput
                style={styles.textInput}
                placeholder="60 min"
                placeholderTextColor="#94A3B8"
                value={duration}
                onChangeText={setDuration}
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Package Price (€) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 50"
                placeholderTextColor="#94A3B8"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Schedule Type</Text>
            <View style={styles.priceTypeRow}>
              {["Booked in sequence", "Parallel booking"].map((type) => {
                const isSelected = scheduleType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={[styles.priceTypeChip, isSelected && styles.priceTypeChipSelected]}
                    onPress={() => setScheduleType(type)}
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

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Description (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe the bundle benefits..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Included Services Section */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Included Services ({selectedServices.length})</Text>
            <TouchableOpacity
              style={styles.addInlineBtn}
              onPress={() => setIsAddServiceOpen(true)}
              activeOpacity={0.75}
            >
              <Ionicons name="add" size={14} color="#635BFF" />
              <Text style={styles.addInlineBtnText}>Add Service</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemsList}>
            {selectedServices.map((service) => (
              <View key={service.id} style={styles.includedServiceCard}>
                <View style={styles.serviceIconContainer}>
                  <Ionicons name="cut-outline" size={18} color="#635BFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{service.name}</Text>
                  <Text style={styles.itemSub}>{service.duration} • {service.price}</Text>
                </View>
                <TouchableOpacity
                  style={styles.trashBtn}
                  onPress={() => handleRemoveService(service.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Assigned Staff Members Section */}
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Assigned Stylists ({selectedMembers.length})</Text>
            <TouchableOpacity
              style={styles.addInlineBtn}
              onPress={() => setIsAddMemberOpen(true)}
              activeOpacity={0.75}
            >
              <Ionicons name="add" size={14} color="#635BFF" />
              <Text style={styles.addInlineBtnText}>Assign Staff</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemsList}>
            {selectedMembers.map((member) => (
              <View key={member.id} style={styles.includedMemberCard}>
                <Avatar name={member.name} uri={member.avatar} size={36} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{member.name}</Text>
                  <Text style={styles.itemSub}>Qualified Specialist</Text>
                </View>
                <TouchableOpacity
                  style={styles.trashBtn}
                  onPress={() => handleRemoveMember(member.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveSubmitBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.saveSubmitBtnText}>Save Bundle Package</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Service Modal */}
      <AddServiceToBundleModal
        visible={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        onSelectService={handleAddService}
      />

      {/* Add Member Modal */}
      <AddMemberToBundleModal
        visible={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        alreadySelectedIds={selectedMembers.map((m) => m.id)}
        onAddMembers={handleAddMembers}
      />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  addInlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  addInlineBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
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

  // Included items
  itemsList: {
    gap: 8,
  },
  includedServiceCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  serviceIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  includedMemberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  itemTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  itemSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  trashBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
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
