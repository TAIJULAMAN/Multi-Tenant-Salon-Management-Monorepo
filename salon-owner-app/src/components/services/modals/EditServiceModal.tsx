import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ServiceRecord, categoryColorMap, serviceIconList } from "../servicesData";
import CustomSwitch from "@/components/ui/CustomSwitch";

interface EditServiceModalProps {
  visible: boolean;
  onClose: () => void;
  service: ServiceRecord | null;
  onSave: (updatedService: ServiceRecord) => void;
}

export default function EditServiceModal({
  visible,
  onClose,
  service,
  onSave,
}: EditServiceModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Category 1");
  const [duration, setDuration] = useState("45 min");
  const [postBreak, setPostBreak] = useState("15 min");
  const [price, setPrice] = useState("€ 35");
  const [vat, setVat] = useState("€ 7");
  const [description, setDescription] = useState("");
  const [onlineBooking, setOnlineBooking] = useState(true);
  const [selectedIconName, setSelectedIconName] = useState("cut-outline");

  useEffect(() => {
    if (service) {
      setName(service.name);
      setCategory(service.category);
      setDuration(service.duration);
      setPostBreak(service.postBreak);
      setPrice(service.price);
      setVat(service.vat);
      setDescription(service.description || "");
      setOnlineBooking(service.onlineBooking !== false);
      setSelectedIconName(service.iconName || "cut-outline");
    }
  }, [service, visible]);

  const handleSave = () => {
    if (!name.trim() || !service) {
      Alert.alert("Required", "Please provide a service name.");
      return;
    }

    onSave({
      ...service,
      name: name.trim(),
      category,
      categoryStyle: categoryColorMap[category] || categoryColorMap["Category 1"],
      duration,
      postBreak,
      price,
      vat,
      description: description.trim(),
      onlineBooking,
      iconName: selectedIconName,
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
                <Ionicons name="cut-outline" size={18} color="#635BFF" />
              </View>
              <Text style={styles.title}>Edit Service</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
            {/* Online booking switch */}
            <View style={styles.switchCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.switchTitle}>Online Bookings</Text>
                <Text style={styles.switchSub}>Allow clients to book this service online</Text>
              </View>
              <CustomSwitch value={onlineBooking} onValueChange={setOnlineBooking} />
            </View>

            {/* Icon selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Icon</Text>
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
                        size={18}
                        color={isSelected ? "#FFFFFF" : "#635BFF"}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Service Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Service name"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryChipsRow}>
                {Object.keys(categoryColorMap).map((cat) => {
                  const isSelected = category === cat;
                  const colorStyle = categoryColorMap[cat];
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChip,
                        { backgroundColor: colorStyle.bg, borderColor: isSelected ? colorStyle.text : colorStyle.border },
                        isSelected && styles.catChipSelected,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.catChipText, { color: colorStyle.text }]}>{cat}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Duration</Text>
                <TextInput
                  style={styles.input}
                  placeholder="45 min"
                  placeholderTextColor="#94A3B8"
                  value={duration}
                  onChangeText={setDuration}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Post-Break</Text>
                <TextInput
                  style={styles.input}
                  placeholder="15 min"
                  placeholderTextColor="#94A3B8"
                  value={postBreak}
                  onChangeText={setPostBreak}
                />
              </View>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="€ 35"
                  placeholderTextColor="#94A3B8"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>VAT</Text>
                <TextInput
                  style={styles.input}
                  placeholder="€ 7"
                  placeholderTextColor="#94A3B8"
                  value={vat}
                  onChangeText={setVat}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Service details..."
                placeholderTextColor="#94A3B8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save Changes</Text>
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
    maxWidth: 440,
    maxHeight: "85%",
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
  scrollBody: {
    flexGrow: 0,
  },
  bodyContent: {
    padding: 18,
    gap: 14,
  },
  switchCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  switchTitle: {
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
    height: 65,
    textAlignVertical: "top",
  },
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxSelected: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  categoryChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  catChipSelected: {
    borderWidth: 2,
  },
  catChipText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
  },
  rowTwoCols: {
    flexDirection: "row",
    gap: 10,
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
