import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomSwitch from "@/components/ui/CustomSwitch";
import { ALL_AUTOMATION_CLIENTS } from "@/components/finance/financeData";

type PaymentTab = "Cash Payment" | "Card Payments" | "Online Payments";
type ChannelType = "whatsapp" | "email" | "phone";

export default function SetAutomationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<PaymentTab>("Card Payments");

  // Toggle states per tab & channel
  const [toggles, setToggles] = useState<Record<PaymentTab, Record<ChannelType, boolean>>>({
    "Cash Payment": { whatsapp: false, email: true, phone: false },
    "Card Payments": { whatsapp: false, email: false, phone: false },
    "Online Payments": { whatsapp: true, email: true, phone: false },
  });

  // Personalization Modal
  const [personalizeChannel, setPersonalizeChannel] = useState<ChannelType | null>(null);
  const [msgTemplate, setMsgTemplate] = useState(
    `Hello, [Name] 👋\n\nWe confirm the receipt of your payment for the service provided at our Salon 💈\n\nYour receipt is attached.\n\nThank you for choosing us! We look forward to welcoming you again soon for more moments of care and beauty. 💜\n\n[Salon Name] Team`
  );
  const [emailSubject, setEmailSubject] = useState("Your Receipt Is Ready");

  // Exceptions Modal
  const [exceptionsOpen, setExceptionsOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [exceptions, setExceptions] = useState<Record<ChannelType, string[]>>({
    whatsapp: ["1"],
    email: [],
    phone: [],
  });

  const toggleChannel = (channel: ChannelType) => {
    setToggles((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [channel]: !prev[activeTab][channel],
      },
    }));
  };

  const filteredClients = useMemo(() => {
    return ALL_AUTOMATION_CLIENTS.filter((c) =>
      c.name.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch]);

  const toggleClientException = (clientId: string) => {
    if (!personalizeChannel) return;
    const currentList = exceptions[personalizeChannel] || [];
    if (currentList.includes(clientId)) {
      setExceptions({
        ...exceptions,
        [personalizeChannel]: currentList.filter((id) => id !== clientId),
      });
    } else {
      setExceptions({
        ...exceptions,
        [personalizeChannel]: [...currentList, clientId],
      });
    }
  };

  const currentExceptionsCount = personalizeChannel ? (exceptions[personalizeChannel] || []).length : 0;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#635BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Automations</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsHeader}>
        {(["Cash Payment", "Card Payments", "Online Payments"] as PaymentTab[]).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 3 Channel Cards matching Web exactly */}
        <View style={styles.cardsGrid}>
          {/* 1. WhatsApp Card */}
          <View style={styles.channelCard}>
            <View style={styles.channelCardTop}>
              <View style={[styles.channelIconBox, { backgroundColor: "#25D366" }]}>
                <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
              </View>
              <CustomSwitch
                value={toggles[activeTab].whatsapp}
                onValueChange={() => toggleChannel("whatsapp")}
              />
            </View>

            <Text style={styles.channelTitle}>Send whatsapp message with receipt</Text>

            <TouchableOpacity
              style={styles.personalizeBtn}
              onPress={() => setPersonalizeChannel("whatsapp")}
              activeOpacity={0.75}
            >
              <Text style={styles.personalizeBtnText}>Personalize Whatsapp Message</Text>
            </TouchableOpacity>
          </View>

          {/* 2. Email Card */}
          <View style={styles.channelCard}>
            <View style={styles.channelCardTop}>
              <View style={[styles.channelIconBox, { backgroundColor: "#635BFF" }]}>
                <Ionicons name="mail" size={20} color="#FFFFFF" />
              </View>
              <CustomSwitch
                value={toggles[activeTab].email}
                onValueChange={() => toggleChannel("email")}
              />
            </View>

            <Text style={styles.channelTitle}>Send email with receipt</Text>

            <TouchableOpacity
              style={styles.personalizeBtn}
              onPress={() => setPersonalizeChannel("email")}
              activeOpacity={0.75}
            >
              <Text style={styles.personalizeBtnText}>Personalize Email</Text>
            </TouchableOpacity>
          </View>

          {/* 3. Phone/SMS Card */}
          <View style={styles.channelCard}>
            <View style={styles.channelCardTop}>
              <View style={[styles.channelIconBox, { backgroundColor: "#F59E0B" }]}>
                <Ionicons name="call" size={20} color="#FFFFFF" />
              </View>
              <CustomSwitch
                value={toggles[activeTab].phone}
                onValueChange={() => toggleChannel("phone")}
              />
            </View>

            <Text style={styles.channelTitle}>Send phone message with receipt</Text>

            <TouchableOpacity
              style={styles.personalizeBtn}
              onPress={() => setPersonalizeChannel("phone")}
              activeOpacity={0.75}
            >
              <Text style={styles.personalizeBtnText}>Personalize Phone Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Global Save Button */}
        <View style={styles.saveSection}>
          <TouchableOpacity
            style={styles.saveAllBtn}
            onPress={() => {
              Alert.alert("Success", `Automation preferences saved for ${activeTab}!`);
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text style={styles.saveAllBtnText}>Save Automations</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ========================================================================= */}
      {/* PERSONALIZE MESSAGE MODAL */}
      {/* ========================================================================= */}
      <Modal
        visible={!!personalizeChannel}
        transparent
        animationType="fade"
        onRequestClose={() => setPersonalizeChannel(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPersonalizeChannel(null)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Personalize {personalizeChannel === "whatsapp" ? "WhatsApp" : personalizeChannel === "email" ? "Email" : "Phone"} Message
              </Text>
              <TouchableOpacity onPress={() => setPersonalizeChannel(null)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {personalizeChannel === "email" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Subject Line</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={emailSubject}
                    onChangeText={setEmailSubject}
                    placeholder="Your Receipt Is Ready"
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Message Template</Text>
                <TextInput
                  style={[styles.modalInput, styles.textArea]}
                  value={msgTemplate}
                  onChangeText={setMsgTemplate}
                  multiline
                  numberOfLines={6}
                />
              </View>

              {/* Exceptions Button */}
              <View style={styles.exceptionsRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exceptionsTitle}>Exceptions to default</Text>
                  <Text style={styles.exceptionsSub}>
                    {currentExceptionsCount} client{currentExceptionsCount === 1 ? "" : "s"} excluded from receiving this message
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.exceptionsBtn}
                  onPress={() => setExceptionsOpen(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="people-outline" size={14} color="#635BFF" />
                  <Text style={styles.exceptionsBtnText}>Manage Exceptions</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setPersonalizeChannel(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={() => {
                  Alert.alert("Template Saved", "Message template and client triggers updated.");
                  setPersonalizeChannel(null);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSaveText}>Save Template</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* ========================================================================= */}
      {/* EXCEPTIONS TO DEFAULT CLIENT SELECTION MODAL */}
      {/* ========================================================================= */}
      <Modal
        visible={exceptionsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setExceptionsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setExceptionsOpen(false)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Exceptions to default</Text>
              <TouchableOpacity onPress={() => setExceptionsOpen(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchBarBox}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search clients..."
                placeholderTextColor="#94A3B8"
                value={clientSearch}
                onChangeText={setClientSearch}
              />
            </View>

            <ScrollView style={styles.clientsList} showsVerticalScrollIndicator={false}>
              {filteredClients.map((client) => {
                const isSelected = personalizeChannel && (exceptions[personalizeChannel] || []).includes(client.id);

                return (
                  <TouchableOpacity
                    key={client.id}
                    style={styles.clientItem}
                    onPress={() => toggleClientException(client.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.clientAvatar, { backgroundColor: client.color }]}>
                      <Text style={styles.clientAvatarText}>{client.initials}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={styles.clientItemName}>{client.name}</Text>
                      <Text style={styles.clientItemRole}>{client.role}</Text>
                    </View>

                    <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                      {isSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={() => setExceptionsOpen(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSaveText}>Save list</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: "#EEF2FF",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  tabsHeader: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabButton: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: "#635BFF",
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  cardsGrid: {
    gap: 12,
  },
  channelCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  channelCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  channelIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  channelTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    lineHeight: 20,
  },
  personalizeBtn: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  personalizeBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  saveSection: {
    marginTop: 8,
  },
  saveAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#635BFF",
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  saveAllBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  modalTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    gap: 6,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
    textTransform: "uppercase",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },
  exceptionsRow: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 4,
  },
  exceptionsTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  exceptionsSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  exceptionsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingVertical: 8,
    borderRadius: 8,
  },
  exceptionsBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  modalFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#635BFF",
    alignItems: "center",
  },
  modalSaveText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Exceptions list
  searchBarBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  clientsList: {
    paddingHorizontal: 20,
    maxHeight: 280,
  },
  clientItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  clientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  clientAvatarText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  clientItemName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  clientItemRole: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
});
