import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Avatar from "@/components/Avatar";

import CustomBottomSheet from "@/components/ui/CustomBottomSheet";

export interface AppointmentReceiptItem {
  id: string | number;
  name: string;
  time: string;
  service: string;
  teamMember: string;
  estimatedPrice: string;
  avatar?: string;
  date?: string;
  duration?: string;
}

export const mockReceiptAppointments: AppointmentReceiptItem[] = [
  {
    id: "1",
    name: "Maria Rodriguez",
    time: "11:00 AM",
    service: "Haircut",
    teamMember: "Mada",
    estimatedPrice: "€ 350",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    date: "2025-09-23",
    duration: "45 min",
  },
  {
    id: "2",
    name: "Sophia Rossi",
    time: "12:30 PM",
    service: "Balayage & Styling",
    teamMember: "Angelica",
    estimatedPrice: "€ 220",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    date: "2025-09-23",
    duration: "60 min",
  },
  {
    id: "3",
    name: "Elena Romano",
    time: "02:00 PM",
    service: "Full Color & Gloss",
    teamMember: "Marco",
    estimatedPrice: "€ 180",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    date: "2025-09-23",
    duration: "45 min",
  },
  {
    id: "4",
    name: "Giulia Bianchi",
    time: "03:15 PM",
    service: "Keratin Treatment",
    teamMember: "Mada",
    estimatedPrice: "€ 260",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80",
    date: "2025-09-23",
    duration: "90 min",
  },
  {
    id: "5",
    name: "Valentina Costa",
    time: "04:30 PM",
    service: "Blowout & Manicure",
    teamMember: "Angelica",
    estimatedPrice: "€ 95",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
    date: "2025-09-23",
    duration: "40 min",
  },
];

interface NewReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIndependent?: () => void;
  onSelectAppointment?: (item: AppointmentReceiptItem) => void;
}

export default function NewReceiptModal({
  visible,
  onClose,
  onSelectIndependent,
  onSelectAppointment,
}: NewReceiptModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAppointments = mockReceiptAppointments.filter((apt) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      apt.name.toLowerCase().includes(q) ||
      apt.service.toLowerCase().includes(q) ||
      apt.teamMember.toLowerCase().includes(q)
    );
  });

  const handleChooseIndependent = () => {
    if (onSelectIndependent) {
      onSelectIndependent();
    } else {
      router.push({
        pathname: "/(drawer)/checkout" as any,
        params: {
          type: "independent",
        },
      });
    }
    setTimeout(() => {
      onClose();
    }, 120);
  };

  const handleChooseAppointment = (apt: AppointmentReceiptItem) => {
    if (onSelectAppointment) {
      onSelectAppointment(apt);
    } else {
      router.push({
        pathname: "/(drawer)/checkout" as any,
        params: {
          type: "appointment",
          apptId: String(apt.id),
          clientName: apt.name,
          clientAvatar: apt.avatar || "",
          serviceName: apt.service,
          servicePrice: apt.estimatedPrice.replace(/[^0-9.]/g, "") || "170",
          serviceTime: apt.time,
          serviceDuration: apt.duration || "15 min",
          employeeName: apt.teamMember,
          serviceDate: apt.date || "2025-09-23",
        },
      });
    }
    setTimeout(() => {
      onClose();
    }, 120);
  };

  return (
    <CustomBottomSheet
      visible={visible}
      onClose={onClose}
      title="New Receipt"
      headerRight={
        <TouchableOpacity
          onPress={onClose}
          style={styles.modalCloseBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={18} color="#64748B" />
        </TouchableOpacity>
      }
    >
      <Text style={styles.modalSubtitle}>
        Select an appointment or create an independent receipt
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollBody}
      >
        {/* Option A: Independent Receipt Button */}
        <TouchableOpacity
          style={styles.independentCard}
          onPress={handleChooseIndependent}
          activeOpacity={0.8}
        >
          <View style={styles.independentLeft}>
            <View style={styles.plusCircle}>
              <Ionicons name="add" size={22} color="#635BFF" />
            </View>
            <View style={styles.independentTextWrap}>
              <Text style={styles.independentTitle}>
                Create independent Receipt
              </Text>
              <Text style={styles.independentSub}>
                Not linked to any appointment
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#635BFF" />
        </TouchableOpacity>

        {/* Section Header: Or Select Specific Appointment */}
        <Text style={styles.sectionHeading}>
          Or select specific appointment
        </Text>

        {/* Search Box */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={17} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search an appointment"
            placeholderTextColor="#94A3B8"
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Appointment Items List */}
        <View style={styles.receiptApptList}>
          {filteredAppointments.map((apt) => (
            <TouchableOpacity
              key={apt.id}
              style={styles.receiptApptItem}
              onPress={() => handleChooseAppointment(apt)}
              activeOpacity={0.75}
            >
              <Avatar name={apt.name} uri={apt.avatar} size={44} />

              <View style={styles.receiptApptInfo}>
                <Text style={styles.receiptApptName} numberOfLines={1}>
                  {apt.name} <Text style={styles.receiptApptDot}>•</Text>{" "}
                  <Text style={styles.receiptApptTime}>{apt.time}</Text>
                </Text>
                <Text style={styles.receiptApptService} numberOfLines={1}>
                  Service: {apt.service}
                </Text>
                <Text style={styles.receiptApptStaff} numberOfLines={1}>
                  Team Member: {apt.teamMember}
                </Text>
              </View>

              <View style={styles.receiptApptRight}>
                <Text style={styles.estLabel}>ESTIMATED</Text>
                <Text style={styles.estPrice}>{apt.estimatedPrice}</Text>
                <Ionicons name="chevron-forward" size={16} color="#635BFF" />
              </View>
            </TouchableOpacity>
          ))}

          {filteredAppointments.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={32} color="#CBD5E1" />
              <Text style={styles.emptyText}>No matching appointments found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </CustomBottomSheet>
  );
}

const styles = StyleSheet.create({
  modalSubtitle: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginBottom: 14,
    marginTop: -4,
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollBody: {
    paddingBottom: 20,
  },

  // Independent Receipt Card
  independentCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  independentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  plusCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  independentTextWrap: {
    flex: 1,
  },
  independentTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  independentSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },

  // Section Header
  sectionHeading: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 10,
  },

  // Search Box
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },

  // List of appointments
  receiptApptList: {
    gap: 10,
  },
  receiptApptItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  receiptApptInfo: {
    flex: 1,
  },
  receiptApptName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  receiptApptDot: {
    color: "#94A3B8",
    fontSize: 12,
  },
  receiptApptTime: {
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  receiptApptService: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  receiptApptStaff: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  receiptApptRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 2,
  },
  estLabel: {
    fontSize: 9,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  estPrice: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
});
