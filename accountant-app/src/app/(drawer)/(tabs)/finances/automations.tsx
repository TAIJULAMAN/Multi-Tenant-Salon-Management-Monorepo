import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomButton from "@/components/ui/CustomButton";
import CustomSwitch from "@/components/ui/CustomSwitch";
import CustomModal from "@/components/ui/CustomModal";

type PaymentMethodTab = "Cash" | "Card" | "Online";

const AUTOMATION_TABS: PaymentMethodTab[] = ["Cash", "Card", "Online"];

export default function AutomationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PaymentMethodTab>("Cash");

  // Automation toggles per tab
  const [automationsState, setAutomationsState] = useState({
    Cash: { whatsapp: true, email: false, phone: false },
    Card: { whatsapp: true, email: true, phone: false },
    Online: { whatsapp: true, email: true, phone: true },
  });

  // Personalization Modal
  const [editingTemplate, setEditingTemplate] = useState<{
    channel: "WhatsApp" | "Email" | "Phone Message";
    text: string;
  } | null>(null);

  const currentToggles = automationsState[activeTab];

  const handleToggle = (channel: "whatsapp" | "email" | "phone") => {
    setAutomationsState((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [channel]: !prev[activeTab][channel],
      },
    }));
  };

  const handleOpenPersonalize = (channel: "WhatsApp" | "Email" | "Phone Message") => {
    let defaultText = "";
    if (channel === "WhatsApp") {
      defaultText = "Ciao {client_name}! Ecco la tua ricevuta fiscale di €{total_amount} per il servizio presso {salon_name}.";
    } else if (channel === "Email") {
      defaultText = "Gentile {client_name}, le inviamo in allegato la ricevuta n. {receipt_number} relativa al pagamento di €{total_amount}. Grazie per aver scelto {salon_name}.";
    } else {
      defaultText = "{salon_name}: Ricevuta di €{total_amount} emessa. Link fiscale: https://rec.it/{receipt_number}";
    }
    setEditingTemplate({ channel, text: defaultText });
  };

  const handleSaveTemplate = () => {
    Alert.alert("Template Saved", `${editingTemplate?.channel} template updated successfully.`);
    setEditingTemplate(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* 1. Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={22} color="#1E293B" />
          <Text style={styles.headerTitle}>Set Automations</Text>
        </TouchableOpacity>

        <View style={styles.breadcrumbBadge}>
          <Ionicons name="home-outline" size={13} color="#635BFF" />
          <Text style={styles.breadcrumbDivider}>/</Text>
          <Text style={styles.breadcrumbText}>Payments</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Separate Container Card for the 3 Tab Boxes */}
        <View style={styles.tabsContainerCard}>
          <View style={styles.tabBoxesRow}>
            {AUTOMATION_TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabBox,
                    isActive ? styles.tabBoxActive : styles.tabBoxInactive,
                  ]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.tabBoxText,
                      isActive ? styles.tabBoxTextActive : styles.tabBoxTextInactive,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Main Content Card with 3 Channel Cards */}
        <View style={styles.mainCard}>
          <View style={styles.cardsList}>
            {/* Card 1: WhatsApp */}
            <View style={styles.channelCard}>
              <View style={[styles.channelIcon, { backgroundColor: "#22C55E" }]}>
                <Ionicons name="call" size={18} color="#FFFFFF" />
              </View>

              <View style={styles.channelMiddleRow}>
                <Text style={styles.channelTitle}>
                  Send whatsapp message{"\n"}with receipt
                </Text>
                <CustomSwitch
                  value={currentToggles.whatsapp}
                  onValueChange={() => handleToggle("whatsapp")}
                />
              </View>

              <TouchableOpacity
                style={styles.personalizePillBtn}
                onPress={() => handleOpenPersonalize("WhatsApp")}
                activeOpacity={0.7}
              >
                <Text style={styles.personalizePillText}>Personalize Whatsapp Message</Text>
              </TouchableOpacity>
            </View>

            {/* Card 2: Email */}
            <View style={styles.channelCard}>
              <View style={[styles.channelIcon, { backgroundColor: "#5C60F5" }]}>
                <Ionicons name="mail" size={18} color="#FFFFFF" />
              </View>

              <View style={styles.channelMiddleRow}>
                <Text style={styles.channelTitle}>
                  Send email with receipt
                </Text>
                <CustomSwitch
                  value={currentToggles.email}
                  onValueChange={() => handleToggle("email")}
                />
              </View>

              <TouchableOpacity
                style={styles.personalizePillBtn}
                onPress={() => handleOpenPersonalize("Email")}
                activeOpacity={0.7}
              >
                <Text style={styles.personalizePillText}>Personalize Email</Text>
              </TouchableOpacity>
            </View>

            {/* Card 3: Phone Message */}
            <View style={styles.channelCard}>
              <View style={[styles.channelIcon, { backgroundColor: "#F59E0B" }]}>
                <Ionicons name="chatbubble" size={17} color="#FFFFFF" />
              </View>

              <View style={styles.channelMiddleRow}>
                <Text style={styles.channelTitle}>
                  Send phone message with{"\n"}receipt
                </Text>
                <CustomSwitch
                  value={currentToggles.phone}
                  onValueChange={() => handleToggle("phone")}
                />
              </View>

              <TouchableOpacity
                style={styles.personalizePillBtn}
                onPress={() => handleOpenPersonalize("Phone Message")}
                activeOpacity={0.7}
              >
                <Text style={styles.personalizePillText}>Personalize Phone Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Personalize Template Modal */}
      <CustomModal
        visible={editingTemplate !== null}
        onClose={() => setEditingTemplate(null)}
        title={`Personalize ${editingTemplate?.channel}`}
      >
        <View style={{ gap: 12 }}>
          <Text style={styles.templateIntroText}>
            Dynamic tags: <Text style={{ fontWeight: "700", color: "#635BFF" }}>{"{client_name}"}</Text>,{" "}
            <Text style={{ fontWeight: "700", color: "#635BFF" }}>{"{total_amount}"}</Text>,{" "}
            <Text style={{ fontWeight: "700", color: "#635BFF" }}>{"{receipt_number}"}</Text>,{" "}
            <Text style={{ fontWeight: "700", color: "#635BFF" }}>{"{salon_name}"}</Text>
          </Text>

          <TextInput
            style={styles.templateTextInput}
            multiline
            numberOfLines={4}
            value={editingTemplate?.text}
            onChangeText={(txt) =>
              setEditingTemplate((prev) => (prev ? { ...prev, text: txt } : null))
            }
            placeholder="Type your message template..."
            placeholderTextColor="#9CA3AF"
          />

          {/* Expo UI Modal Action Buttons */}
          <View style={styles.modalActionButtonsRow}>
            <View style={{ flex: 1 }}>
              <CustomButton
                title="Cancel"
                onPress={() => setEditingTemplate(null)}
                variant="outlined"
                size="small"
              />
            </View>

            <View style={{ flex: 1.2 }}>
              <CustomButton
                title="Save Template"
                onPress={handleSaveTemplate}
                variant="filled"
                size="small"
              />
            </View>
          </View>
        </View>
      </CustomModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1E293B",
  },
  breadcrumbBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  breadcrumbDivider: {
    fontSize: 11,
    color: "#94A3B8",
  },
  breadcrumbText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#635BFF",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  tabsContainerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  tabBoxesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tabBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1.2,
  },
  tabBoxActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  tabBoxInactive: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
  },
  tabBoxText: {
    fontSize: 13,
    fontWeight: "700",
  },
  tabBoxTextActive: {
    color: "#FFFFFF",
  },
  tabBoxTextInactive: {
    color: "#64748B",
  },
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardsList: {
    gap: 16,
  },
  channelCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  channelIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  channelMiddleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  channelTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: "500",
    color: "#1E293B",
    lineHeight: 19,
  },
  personalizePillBtn: {
    backgroundColor: "#F3EFFE",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  personalizePillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5C60F5",
  },
  templateIntroText: {
    fontSize: 11.5,
    color: "#4B5563",
    lineHeight: 17,
  },
  templateTextInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    fontSize: 12.5,
    color: "#1E293B",
    minHeight: 90,
    textAlignVertical: "top",
  },
  modalActionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
});
