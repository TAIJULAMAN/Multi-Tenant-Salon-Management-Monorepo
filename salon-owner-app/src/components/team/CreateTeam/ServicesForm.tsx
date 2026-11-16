import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "../../ui/TextInput";
import CustomSwitch from "../../ui/CustomSwitch";

export interface ServiceItem {
  id: number;
  name: string;
  duration: string;
  price: string;
  active: boolean;
}

export const INITIAL_SERVICES: ServiceItem[] = [
  { id: 1, name: "Hair Color", duration: "15 min", price: "€ 170", active: true },
  { id: 2, name: "Hair Color", duration: "30 min", price: "€ 170", active: false },
  { id: 3, name: "Hair Color", duration: "15 min", price: "€ 170", active: false },
  { id: 4, name: "Hair Color", duration: "15 min", price: "€ 170", active: true },
  { id: 5, name: "Hair Color", duration: "30 min", price: "€ 170", active: false },
  { id: 6, name: "Hair Color", duration: "15 min", price: "€ 170", active: false },
];

interface ServicesFormProps {
  services: ServiceItem[];
  onChange: (services: ServiceItem[]) => void;
}

export default function ServicesForm({ services, onChange }: ServicesFormProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const toggleService = (id: number) => {
    onChange(
      services.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = services.filter((s) => s.active).length;

  const handleToggleSelectAll = () => {
    const allActive = services.every((s) => s.active);
    onChange(services.map((s) => ({ ...s, active: !allActive })));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign Services</Text>
      <Text style={styles.description}>
        Enable or disable the services this team member can perform.
      </Text>

      <TextInput
        placeholder="Search services..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Ionicons name="search" size={18} color="#94A3B8" style={styles.searchIcon} />}
      />

      <View style={styles.headerRow}>
        <Text style={styles.countText}>
          {activeCount} of {services.length} services enabled
        </Text>
        <TouchableOpacity onPress={handleToggleSelectAll} activeOpacity={0.7}>
          <Text style={styles.selectAllText}>
            {services.every((s) => s.active) ? "Deselect All" : "Select All"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {filteredServices.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDuration}>{service.duration}</Text>
            </View>

            <View style={styles.serviceRight}>
              <Text style={styles.servicePrice}>{service.price}</Text>
              <CustomSwitch
                value={service.active}
                onValueChange={() => toggleService(service.id)}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 18,
    marginBottom: 16,
  },
  searchIcon: {
    marginLeft: 8,
    marginRight: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  countText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  selectAllText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  listContainer: {
    gap: 10,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  serviceDuration: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  serviceRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  servicePrice: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
});
