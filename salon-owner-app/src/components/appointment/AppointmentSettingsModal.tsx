import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  initialTab?: "general" | "notifications";
  onClose: () => void;
  onSave?: (settings: any) => void;
}

export default function AppointmentSettingsModal({
  visible,
  initialTab = "general",
  onClose,
  onSave,
}: Props) {
  const [activeTab, setActiveTab] = useState<"general" | "notifications">(
    initialTab
  );

  // General Settings State
  const [language, setLanguage] = useState("English (US)");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timeFormat, setTimeFormat] = useState("12 Hours (AM/PM)");
  const [defaultDuration, setDefaultDuration] = useState("30 minutes");
  const [showWeekends, setShowWeekends] = useState(true);
  const [showCancelled, setShowCancelled] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);

  // Notifications State
  const [remind24h, setRemind24h] = useState(true);
  const [remind2h, setRemind2h] = useState(true);
  const [smsChannel, setSmsChannel] = useState(true);
  const [emailChannel, setEmailChannel] = useState(true);
  const [whatsappChannel, setWhatsappChannel] = useState(false);
  const [notifyOnBook, setNotifyOnBook] = useState(true);
  const [notifyOnCancel, setNotifyOnCancel] = useState(true);
  const [autoReviewRequest, setAutoReviewRequest] = useState(true);

  const handleSave = () => {
    if (onSave) {
      onSave({
        general: {
          language,
          dateFormat,
          timeFormat,
          defaultDuration,
          showWeekends,
          showCancelled,
          showCompleted,
        },
        notifications: {
          remind24h,
          remind2h,
          smsChannel,
          emailChannel,
          whatsappChannel,
          notifyOnBook,
          notifyOnCancel,
          autoReviewRequest,
        },
      });
    }
    Alert.alert("Settings Saved", "Appointment settings updated successfully!");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={22} color="#1F2937" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Appointment Settings</Text>
            <Text style={styles.headerSub}>
              Manage calendar & booking preferences
            </Text>
          </View>
          <TouchableOpacity style={styles.saveHeaderBtn} onPress={handleSave}>
            <Text style={styles.saveHeaderBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "general" && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab("general")}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === "general" && styles.tabBtnTextActive,
              ]}
            >
              General
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "notifications" && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab("notifications")}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === "notifications" && styles.tabBtnTextActive,
              ]}
            >
              Notifications
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "general" && (
            <View style={styles.sectionContainer}>
              {/* Language & Regional */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Language & Format</Text>

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Language</Text>
                  <View style={styles.pillsRow}>
                    {["English (US)", "Español", "Français"].map((lang) => (
                      <TouchableOpacity
                        key={lang}
                        style={[
                          styles.optionPill,
                          language === lang && styles.optionPillActive,
                        ]}
                        onPress={() => setLanguage(lang)}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            language === lang && styles.optionPillTextActive,
                          ]}
                        >
                          {lang}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Date Format</Text>
                  <View style={styles.pillsRow}>
                    {["MM/DD/YYYY", "DD/MM/YYYY"].map((df) => (
                      <TouchableOpacity
                        key={df}
                        style={[
                          styles.optionPill,
                          dateFormat === df && styles.optionPillActive,
                        ]}
                        onPress={() => setDateFormat(df)}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            dateFormat === df && styles.optionPillTextActive,
                          ]}
                        >
                          {df}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Time Format</Text>
                  <View style={styles.pillsRow}>
                    {["12 Hours (AM/PM)", "24 Hours"].map((tf) => (
                      <TouchableOpacity
                        key={tf}
                        style={[
                          styles.optionPill,
                          timeFormat === tf && styles.optionPillActive,
                        ]}
                        onPress={() => setTimeFormat(tf)}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            timeFormat === tf && styles.optionPillTextActive,
                          ]}
                        >
                          {tf}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Slot Duration */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Default Slot Duration</Text>
                <Text style={styles.cardSubtitle}>
                  Default duration when clicking an empty calendar cell
                </Text>
                <View style={styles.pillsRow}>
                  {["15 minutes", "30 minutes", "45 minutes", "60 minutes"].map(
                    (dur) => (
                      <TouchableOpacity
                        key={dur}
                        style={[
                          styles.optionPill,
                          defaultDuration === dur && styles.optionPillActive,
                        ]}
                        onPress={() => setDefaultDuration(dur)}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            defaultDuration === dur &&
                              styles.optionPillTextActive,
                          ]}
                        >
                          {dur}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>

              {/* Event Visibility */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Event Visibility</Text>

                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>Show Weekends</Text>
                    <Text style={styles.switchSub}>
                      Display Saturday & Sunday in calendar
                    </Text>
                  </View>
                  <Switch
                    value={showWeekends}
                    onValueChange={setShowWeekends}
                    trackColor={{ false: "#E5E7EB", true: "#635BFF" }}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>
                      Show Cancelled Appointments
                    </Text>
                    <Text style={styles.switchSub}>
                      Keep cancelled cards dimmed on the grid
                    </Text>
                  </View>
                  <Switch
                    value={showCancelled}
                    onValueChange={setShowCancelled}
                    trackColor={{ false: "#E5E7EB", true: "#635BFF" }}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>
                      Show Completed Appointments
                    </Text>
                    <Text style={styles.switchSub}>
                      Render past completed services
                    </Text>
                  </View>
                  <Switch
                    value={showCompleted}
                    onValueChange={setShowCompleted}
                    trackColor={{ false: "#E5E7EB", true: "#635BFF" }}
                  />
                </View>
              </View>
            </View>
          )}

          {activeTab === "notifications" && (
            <View style={styles.sectionContainer}>
              {/* Reminders Card */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Client Reminders</Text>

                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>24 Hours Before</Text>
                    <Text style={styles.switchSub}>
                      Send automated appointment reminder
                    </Text>
                  </View>
                  <Switch
                    value={remind24h}
                    onValueChange={setRemind24h}
                    trackColor={{ false: "#E5E7EB", true: "#635BFF" }}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>2 Hours Before</Text>
                    <Text style={styles.switchSub}>
                      Final day-of-service reminder
                    </Text>
                  </View>
                  <Switch
                    value={remind2h}
                    onValueChange={setRemind2h}
                    trackColor={{ false: "#E5E7EB", true: "#635BFF" }}
                  />
                </View>

                <View style={styles.divider} />

                <Text
                  style={[
                    styles.settingLabel,
                    { marginTop: 6, marginBottom: 8 },
                  ]}
                >
                  Delivery Channels
                </Text>
                <View style={styles.channelRow}>
                  <TouchableOpacity
                    style={[
                      styles.channelChip,
                      smsChannel && styles.channelChipActive,
                    ]}
                    onPress={() => setSmsChannel(!smsChannel)}
                  >
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={15}
                      color={smsChannel ? "#635BFF" : "#6B7280"}
                    />
                    <Text
                      style={[
                        styles.channelChipText,
                        smsChannel && styles.channelChipTextActive,
                      ]}
                    >
                      SMS
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.channelChip,
                      emailChannel && styles.channelChipActive,
                    ]}
                    onPress={() => setEmailChannel(!emailChannel)}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={15}
                      color={emailChannel ? "#635BFF" : "#6B7280"}
                    />
                    <Text
                      style={[
                        styles.channelChipText,
                        emailChannel && styles.channelChipTextActive,
                      ]}
                    >
                      Email
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.channelChip,
                      whatsappChannel && styles.channelChipActive,
                    ]}
                    onPress={() => setWhatsappChannel(!whatsappChannel)}
                  >
                    <Ionicons
                      name="logo-whatsapp"
                      size={15}
                      color={whatsappChannel ? "#16A34A" : "#6B7280"}
                    />
                    <Text
                      style={[
                        styles.channelChipText,
                        whatsappChannel && {
                          color: "#16A34A",
                          fontFamily: "Manrope_700Bold",
                        },
                      ]}
                    >
                      WhatsApp
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Booking Alerts Card */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Salon Staff Alerts</Text>

                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>New Booking Alert</Text>
                    <Text style={styles.switchSub}>
                      Push notification to stylist when booked
                    </Text>
                  </View>
                  <Switch
                    value={notifyOnBook}
                    onValueChange={setNotifyOnBook}
                    trackColor={{ false: "#E5E7EB", true: "#635BFF" }}
                  />
                </View>

                <View style={styles.divider} />

                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>Cancellation Alert</Text>
                    <Text style={styles.switchSub}>
                      Instant alert if client cancels or moves slot
                    </Text>
                  </View>
                  <Switch
                    value={notifyOnCancel}
                    onValueChange={setNotifyOnCancel}
                    trackColor={{ false: "#E5E7EB", true: "#635BFF" }}
                  />
                </View>
              </View>

              {/* Review Request */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Review Collection</Text>
                <View style={styles.switchRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.switchLabel}>
                      Automatic Review Request
                    </Text>
                    <Text style={styles.switchSub}>
                      Ask for Google / Yelp review after service completion
                    </Text>
                  </View>
                  <Switch
                    value={autoReviewRequest}
                    onValueChange={setAutoReviewRequest}
                    trackColor={{ false: "#E5E7EB", true: "#635BFF" }}
                  />
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  titleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 16,
    color: "#1F2937",
  },
  headerSub: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  saveHeaderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#635BFF",
    borderRadius: 8,
  },
  saveHeaderBtnText: {
    fontFamily: "Manrope_700Bold",
    fontSize: 12.5,
    color: "#FFFFFF",
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  tabBtnActive: {
    backgroundColor: "#635BFF",
  },
  tabBtnText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#6B7280",
  },
  tabBtnTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionContainer: {
    gap: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardTitle: {
    fontFamily: "Manrope_700Bold",
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11.5,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  settingRow: {
    gap: 8,
    paddingVertical: 6,
  },
  settingLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12.5,
    color: "#374151",
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  optionPillActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F3F0FF",
  },
  optionPillText: {
    fontFamily: "Manrope_500Medium",
    fontSize: 12,
    color: "#4B5563",
  },
  optionPillTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    gap: 12,
  },
  switchLabel: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 13,
    color: "#1F2937",
  },
  switchSub: {
    fontFamily: "Manrope_500Medium",
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  channelRow: {
    flexDirection: "row",
    gap: 8,
  },
  channelChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  channelChipActive: {
    borderColor: "#635BFF",
    backgroundColor: "#F3F0FF",
  },
  channelChipText: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 12,
    color: "#6B7280",
  },
  channelChipTextActive: {
    color: "#635BFF",
    fontFamily: "Manrope_700Bold",
  },
});
