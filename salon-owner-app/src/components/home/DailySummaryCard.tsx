import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Svg, { Path } from "react-native-svg";
import Avatar from "@/components/Avatar";
import ExportReportModal from "./ExportReportModal";
import NewReceiptModal from "@/components/finance/modals/NewReceiptModal";
type SettingsViewState =
  | "DISCONNECTED"
  | "SEARCHING"
  | "SELECT_DEVICE"
  | "CONFIG_SUCCESS"
  | "CONNECTED";

export default function DailySummaryCard() {
  const router = useRouter();

  // Cash Register State
  const [isRegisterOpen, setIsRegisterOpen] = useState(true);
  const [totalReceived, setTotalReceived] = useState(2300);
  const [receiptsCount, setReceiptsCount] = useState(12);
  const [lastReceipt, setLastReceipt] = useState("#R1042");
  const [openingBalance, setOpeningBalance] = useState("200.00");
  const [closeNotes, setCloseNotes] = useState("");
  const [openNotes, setOpenNotes] = useState("");

  // Modal Open States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewReceiptOpen, setIsNewReceiptOpen] = useState(false);
  const [isCloseRegisterOpen, setIsCloseRegisterOpen] = useState(false);
  const [isCloseSuccessOpen, setIsCloseSuccessOpen] = useState(false);
  const [isOpenRegisterModalOpen, setIsOpenRegisterModalOpen] = useState(false);
  const [isOpenSuccessOpen, setIsOpenSuccessOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuBtnRef = useRef<any>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ top: number; right: number }>({ top: 290, right: 20 });

  const handleOpenMenu = () => {
    if (menuBtnRef.current?.measureInWindow) {
      menuBtnRef.current.measureInWindow((_x: number, y: number, _width: number, height: number) => {
        setMenuAnchor({ top: y + height + 6, right: 20 });
        setIsMenuOpen(true);
      });
    } else {
      setMenuAnchor({ top: 290, right: 20 });
      setIsMenuOpen(true);
    }
  };

  // Cash Register Settings Wizard State
  const [settingsView, setSettingsView] = useState<SettingsViewState>("CONNECTED");
  const [deviceIp, setDeviceIp] = useState("192.168.1.150");
  const [devicePort, setDevicePort] = useState("9100");
  const [searchProgress, setSearchProgress] = useState(20);

  // Hardware search animation
  useEffect(() => {
    let interval: any;
    if (isSettingsOpen && settingsView === "SEARCHING") {
      setSearchProgress(20);
      interval = setInterval(() => {
        setSearchProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setSettingsView("SELECT_DEVICE");
            return 100;
          }
          return prev + 25;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isSettingsOpen, settingsView]);

  // Close Register Confirm
  const handleConfirmCloseRegister = () => {
    setIsCloseRegisterOpen(false);
    setIsRegisterOpen(false);
    setIsCloseSuccessOpen(true);
  };

  // Open Register Confirm
  const handleConfirmOpenRegister = () => {
    setIsOpenRegisterModalOpen(false);
    setIsRegisterOpen(true);
    setIsOpenSuccessOpen(true);
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Daily Summary</Text>
          <Text style={styles.dateSubtitle}>Today's session overview</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Status Pill */}
          {isRegisterOpen ? (
            <View style={styles.statusPillOpen}>
              <View style={styles.statusDotOpen} />
              <Text style={styles.statusTextOpen}>REGISTER OPEN</Text>
            </View>
          ) : (
            <View style={styles.statusPillClosed}>
              <View style={styles.statusDotClosed} />
              <Text style={styles.statusTextClosed}>REGISTER CLOSED</Text>
            </View>
          )}

          {/* Menu Option Button (Dedicated, spacious, and triggers anchored dropdown) */}
          <TouchableOpacity
            ref={menuBtnRef}
            style={styles.iconBtn}
            onPress={handleOpenMenu}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>€ {totalReceived.toLocaleString()}</Text>
          <Text style={[styles.metricLabel, { color: "#635BFF" }]}>Total received</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{receiptsCount}</Text>
          <Text style={[styles.metricLabel, { color: "#10B981" }]}>Receipts issued</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>{lastReceipt}</Text>
          <Text style={[styles.metricLabel, { color: "#14B8A6" }]}>Last receipt</Text>
        </View>
      </View>

      {/* Purple Action Panel */}
      <View style={styles.actionPanel}>
        {/* Action 1: New Receipt */}
        <TouchableOpacity
          style={styles.actionBtnWhite}
          onPress={() => setIsNewReceiptOpen(true)}
          activeOpacity={0.85}
        >
          <View style={styles.actionIconPurple}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitleDark}>New Receipt</Text>
          <Text style={styles.actionSubtitleDark}>Create a receipt</Text>
        </TouchableOpacity>

        {/* Action 2: Receipt History */}
        <TouchableOpacity
          style={styles.actionBtnGlass}
          onPress={() => router.push("/payments")}
          activeOpacity={0.85}
        >
          <View style={styles.actionIconGlass}>
            <Ionicons name="receipt-outline" size={18} color="#FFFFFF" />
          </View>
          <Text style={styles.actionTitleLight}>History</Text>
          <Text style={styles.actionSubtitleLight}>Receipt logs</Text>
        </TouchableOpacity>

        {/* Action 3: Open / Close Register */}
        <TouchableOpacity
          style={styles.actionBtnGlass}
          onPress={() => {
            if (isRegisterOpen) {
              setIsCloseRegisterOpen(true);
            } else {
              setIsOpenRegisterModalOpen(true);
            }
          }}
          activeOpacity={0.85}
        >
          <View style={styles.actionIconGlass}>
            <Ionicons
              name={isRegisterOpen ? "close" : "play"}
              size={18}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.actionTitleLight}>
            {isRegisterOpen ? "Close Register" : "Open Register"}
          </Text>
          <Text style={styles.actionSubtitleLight}>
            {isRegisterOpen ? "End day" : "Start session"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 1. NEW RECEIPT MODAL */}
      <NewReceiptModal
        visible={isNewReceiptOpen}
        onClose={() => setIsNewReceiptOpen(false)}
      />

      {/* ======================================================== */}
      {/* 3. CLOSE CASH REGISTER MODAL (With Revenue Donut Chart)  */}
      {/* ======================================================== */}
      <Modal
        visible={isCloseRegisterOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCloseRegisterOpen(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.closeRegisterWrapper}
          >
            <View style={styles.closeRegisterCard}>
              <ScrollView
                style={styles.closeRegisterScroll}
                contentContainerStyle={styles.closeRegisterScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Icon & Title */}
                <View style={styles.closeIconCircle}>
                  <Ionicons name="briefcase-outline" size={26} color="#635BFF" />
                </View>
                <Text style={styles.closeTitle}>Are you sure you want to close today's cash register?</Text>
                <Text style={styles.closeSub}>Please review the summary before proceeding.</Text>

                {/* 3 Summary Cards */}
                <View style={styles.closeSummaryGrid}>
                  <View style={[styles.closeSummaryBox, { backgroundColor: "#635BFF" }]}>
                    <Text style={styles.closeSummaryVal} numberOfLines={1} adjustsFontSizeToFit>€ 2,300</Text>
                    <Text style={styles.closeSummaryLbl} numberOfLines={2}>Total received</Text>
                  </View>

                  <View style={[styles.closeSummaryBox, { backgroundColor: "#22C55E" }]}>
                    <Text style={styles.closeSummaryVal} numberOfLines={1} adjustsFontSizeToFit>+ € 1,300</Text>
                    <Text style={styles.closeSummaryLbl} numberOfLines={2}>Agenzia delle entrate</Text>
                  </View>

                  <View style={[styles.closeSummaryBox, { backgroundColor: "#14B8A6" }]}>
                    <Text style={styles.closeSummaryVal} numberOfLines={1} adjustsFontSizeToFit>12</Text>
                    <Text style={styles.closeSummaryLbl} numberOfLines={2}>Receipts issued</Text>
                  </View>
                </View>

                {/* Revenue per Payment Method Graphic */}
                <View style={styles.revenueMethodCard}>
                  <Text style={styles.revenueMethodTitle}>Revenue per Payment Method</Text>

                  {/* Semicircular breakdown */}
                  <View style={styles.donutGaugeWrapper}>
                    <Svg width={180} height={100} viewBox="0 0 180 100">
                      <Path
                        d="M 20 90 A 70 70 0 0 1 50 35"
                        fill="none"
                        stroke="#635BFF"
                        strokeWidth={14}
                        strokeLinecap="round"
                      />
                      <Path
                        d="M 55 30 A 70 70 0 0 1 90 20"
                        fill="none"
                        stroke="#FBBF24"
                        strokeWidth={14}
                        strokeLinecap="round"
                      />
                      <Path
                        d="M 95 20 A 70 70 0 0 1 130 35"
                        fill="none"
                        stroke="#06B6D4"
                        strokeWidth={14}
                        strokeLinecap="round"
                      />
                      <Path
                        d="M 135 40 A 70 70 0 0 1 160 90"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth={14}
                        strokeLinecap="round"
                      />
                    </Svg>
                    <View style={styles.gaugeCenterLabel}>
                      <Text style={styles.gaugeCenterPrice}>€ 2,300</Text>
                      <Text style={styles.gaugeCenterSub}>Total Received</Text>
                    </View>
                  </View>

                  {/* Payment Methods Legend */}
                  <View style={styles.legendWrap}>
                    <View style={styles.legendTag}>
                      <View style={[styles.dotTiny, { backgroundColor: "#635BFF" }]} />
                      <Text style={styles.legendTagText}>Direct Debit</Text>
                    </View>
                    <View style={styles.legendTag}>
                      <View style={[styles.dotTiny, { backgroundColor: "#FBBF24" }]} />
                      <Text style={styles.legendTagText}>Bank Transfer</Text>
                    </View>
                    <View style={styles.legendTag}>
                      <View style={[styles.dotTiny, { backgroundColor: "#06B6D4" }]} />
                      <Text style={styles.legendTagText}>Credit Card</Text>
                    </View>
                    <View style={styles.legendTag}>
                      <View style={[styles.dotTiny, { backgroundColor: "#22C55E" }]} />
                      <Text style={styles.legendTagText}>Cash</Text>
                    </View>
                  </View>
                </View>

                {/* Notes input */}
                <View style={{ width: "100%", marginBottom: 16 }}>
                  <Text style={styles.inputLabel}>Notes (optional)</Text>
                  <TextInput
                    style={[styles.textInput, { height: 60, textAlignVertical: "top" }]}
                    placeholder="Add closing note for today"
                    placeholderTextColor="#94A3B8"
                    multiline
                    value={closeNotes}
                    onChangeText={setCloseNotes}
                  />
                </View>

                {/* Buttons */}
                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setIsCloseRegisterOpen(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.modalCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: "#635BFF" }]}
                    onPress={handleConfirmCloseRegister}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalActionBtnText}>Close Now</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 4. CLOSE REGISTER SUCCESS MODAL */}
      {/* ======================================================== */}
      <Modal
        visible={isCloseSuccessOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCloseSuccessOpen(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.successCard}>
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <Ionicons name="checkmark" size={36} color="#14B8A6" />
              </View>
            </View>

            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successSub}>Cash register closed successfully.</Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalActionBtn, { backgroundColor: "#EEF2FF" }]}
                onPress={() => {
                  setIsCloseSuccessOpen(false);
                  setIsExportOpen(true);
                }}
              >
                <Text style={[styles.modalActionBtnText, { color: "#635BFF" }]}>Export Report</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalActionBtn, { backgroundColor: "#635BFF" }]}
                onPress={() => setIsCloseSuccessOpen(false)}
              >
                <Text style={styles.modalActionBtnText}>View Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 5. OPEN CASH REGISTER MODAL */}
      {/* ======================================================== */}
      <Modal
        visible={isOpenRegisterModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpenRegisterModalOpen(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.openRegisterCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Open Cash Register</Text>
                <Text style={styles.modalSubtitle}>Enter initial cash balance to start today's session</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsOpenRegisterModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Opening Balance (€)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="200.00"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
                value={openingBalance}
                onChangeText={setOpeningBalance}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (optional)</Text>
              <TextInput
                style={[styles.textInput, { height: 60, textAlignVertical: "top" }]}
                placeholder="Add session notes..."
                placeholderTextColor="#94A3B8"
                multiline
                value={openNotes}
                onChangeText={setOpenNotes}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsOpenRegisterModalOpen(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalActionBtn, { backgroundColor: "#10B981" }]}
                onPress={handleConfirmOpenRegister}
              >
                <Text style={styles.modalActionBtnText}>Open Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 6. OPEN REGISTER SUCCESS MODAL */}
      {/* ======================================================== */}
      <Modal
        visible={isOpenSuccessOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpenSuccessOpen(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.successCard}>
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <Ionicons name="checkmark" size={36} color="#14B8A6" />
              </View>
            </View>

            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successSub}>Cash register opened successfully.</Text>

            <View style={styles.openStatsRow}>
              <Text style={styles.openStatText}>
                Opening Balance: <Text style={{ color: "#635BFF", fontWeight: "bold" }}>€{openingBalance}</Text>
              </Text>
              <Text style={styles.openStatText}>
                Time: <Text style={{ color: "#10B981", fontWeight: "bold" }}>09:00 AM</Text>
              </Text>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={[styles.modalActionBtn, { backgroundColor: "#EEF2FF" }]}
                onPress={() => {
                  setIsOpenSuccessOpen(false);
                  setIsNewReceiptOpen(true);
                }}
              >
                <Text style={[styles.modalActionBtnText, { color: "#635BFF" }]}>New Receipt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalActionBtn, { backgroundColor: "#635BFF" }]}
                onPress={() => setIsOpenSuccessOpen(false)}
              >
                <Text style={styles.modalActionBtnText}>View Dashboard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 7. CASH REGISTER HARDWARE SETTINGS MODAL (Multi-step)   */}
      {/* ======================================================== */}
      <Modal
        visible={isSettingsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSettingsOpen(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.settingsCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Cash Register Settings</Text>
                <Text style={styles.modalSubtitle}>Fiscal device connection & status</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsSettingsOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ width: "100%" }}>
            {/* State: CONNECTED */}
            {settingsView === "CONNECTED" && (
              <View>
                <View style={styles.connectedBadge}>
                  <View style={styles.statusDotOpen} />
                  <Text style={styles.connectedBadgeText}>DEVICE CONNECTED & SYNCED</Text>
                </View>

                <View style={styles.deviceInfoBox}>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceKey}>Hardware Model:</Text>
                    <Text style={styles.deviceVal}>Epson FP-81II RT</Text>
                  </View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceKey}>IP Address:</Text>
                    <Text style={styles.deviceVal}>{deviceIp}</Text>
                  </View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceKey}>Port:</Text>
                    <Text style={styles.deviceVal}>{devicePort}</Text>
                  </View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceKey}>Fiscal Memory:</Text>
                    <Text style={[styles.deviceVal, { color: "#10B981" }]}>Active / OK</Text>
                  </View>
                  <View style={styles.deviceRow}>
                    <Text style={styles.deviceKey}>Thermal Paper Roll:</Text>
                    <Text style={[styles.deviceVal, { color: "#635BFF" }]}>92% Full</Text>
                  </View>
                </View>

                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: "#EEF2FF" }]}
                    onPress={() => Alert.alert("Test Print", "Sending 80mm test fiscal receipt to Epson printer...")}
                  >
                    <Ionicons name="print-outline" size={16} color="#635BFF" />
                    <Text style={[styles.modalActionBtnText, { color: "#635BFF" }]}>Test Print</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalActionBtn, { backgroundColor: "#FEE2E2" }]}
                    onPress={() => {
                      setSettingsView("DISCONNECTED");
                      setIsRegisterOpen(false);
                      Alert.alert("Disconnected", "Cash register hardware unlinked.");
                    }}
                  >
                    <Text style={[styles.modalActionBtnText, { color: "#EF4444" }]}>Disconnect</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* State: DISCONNECTED */}
            {settingsView === "DISCONNECTED" && (
              <View style={{ alignItems: "center", paddingVertical: 14 }}>
                <View style={styles.disconnectedIconBox}>
                  <Ionicons name="print-outline" size={32} color="#94A3B8" />
                </View>
                <Text style={styles.disconnectedTitle}>No Device Connected</Text>
                <Text style={styles.disconnectedSub}>Connect your fiscal thermal printer via Local LAN or Bluetooth.</Text>

                <TouchableOpacity
                  style={[styles.primaryActionBtn, { marginTop: 16 }]}
                  onPress={() => setSettingsView("SEARCHING")}
                >
                  <Ionicons name="search" size={16} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>Search for Devices</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* State: SEARCHING */}
            {settingsView === "SEARCHING" && (
              <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <ActivityIndicator size="large" color="#635BFF" style={{ marginBottom: 16 }} />
                <Text style={styles.disconnectedTitle}>Searching nearby devices...</Text>
                <Text style={styles.disconnectedSub}>Scanning 192.168.1.0/24 subnet</Text>

                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${searchProgress}%` }]} />
                </View>
              </View>
            )}

            {/* State: SELECT_DEVICE */}
            {settingsView === "SELECT_DEVICE" && (
              <View>
                <Text style={styles.sectionHeading}>Discovered Devices (1 Found)</Text>
                <TouchableOpacity
                  style={styles.foundDeviceCard}
                  onPress={() => setSettingsView("CONNECTED")}
                >
                  <Ionicons name="print" size={24} color="#635BFF" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.foundDeviceName}>Epson FP-81II RT</Text>
                    <Text style={styles.foundDeviceIp}>{deviceIp}:{devicePort}</Text>
                  </View>
                  <View style={styles.connectChip}>
                    <Text style={styles.connectChipText}>Connect</Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Manual IP Address</Text>
                  <TextInput
                    style={styles.textInput}
                    value={deviceIp}
                    onChangeText={setDeviceIp}
                  />
                </View>
              </View>
            )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ======================================================== */}
      {/* 8. MORE OPTIONS QUICK MENU */}
      {/* ======================================================== */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        >
          <View style={[styles.menuBox, { marginTop: menuAnchor.top, marginRight: menuAnchor.right }]}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                setIsSettingsOpen(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={18} color="#635BFF" />
              <Text style={styles.menuItemText}>Cash Register Settings</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                setIsExportOpen(true);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="download-outline" size={18} color="#10B981" />
              <Text style={styles.menuItemText}>Export Report</Text>
            </TouchableOpacity>


          </View>
        </TouchableOpacity>
      </Modal>

      {/* 9. EXPORT REPORT MODAL */}
      <ExportReportModal
        visible={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        defaultTitle="Daily Summary Report"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  dateSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusPillOpen: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  statusDotOpen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  statusTextOpen: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#10B981",
  },
  statusPillClosed: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE4E6",
    borderWidth: 1,
    borderColor: "#FECDD3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  statusDotClosed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F43F5E",
  },
  statusTextClosed: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#F43F5E",
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  metricBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#F8FAFC",
  },
  metricValue: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
  },
  actionPanel: {
    backgroundColor: "#635BFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    gap: 8,
  },
  actionBtnWhite: {
    flex: 1.1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 10,
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconPurple: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  actionTitleDark: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  actionSubtitleDark: {
    fontSize: 9,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  actionBtnGlass: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 12,
    padding: 10,
    justifyContent: "center",
  },
  actionIconGlass: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  actionTitleLight: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  actionSubtitleLight: {
    fontSize: 9,
    fontFamily: "Manrope_500Medium",
    color: "rgba(255, 255, 255, 0.75)",
  },

  // Modals generic
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: "85%",
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  centerModalScroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  modalSubtitle: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 16,
  },
  independentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  plusCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  independentTitle: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  independentSub: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  sectionHeading: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  receiptApptList: {
    gap: 10,
    marginBottom: 14,
  },
  receiptApptItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  receiptApptInfo: {
    flex: 1,
  },
  receiptApptName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  receiptApptTime: {
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  receiptApptService: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  receiptApptStaff: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  receiptApptRight: {
    alignItems: "flex-end",
  },
  estLabel: {
    fontSize: 9,
    fontFamily: "Manrope_600SemiBold",
    color: "#94A3B8",
  },
  estPrice: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },

  // Inputs
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    backgroundColor: "#F8FAFC",
  },
  paymentMethodRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  paymentMethodChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  paymentMethodChipActive: {
    backgroundColor: "#EEF2FF",
    borderColor: "#635BFF",
  },
  paymentMethodText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  paymentMethodTextActive: {
    color: "#635BFF",
  },
  primaryActionBtn: {
    backgroundColor: "#635BFF",
    borderRadius: 12,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 14,
    width: "100%",
  },
  primaryActionBtnText: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Close Register Modal
  closeRegisterWrapper: {
    width: "100%",
    maxWidth: 390,
    maxHeight: "90%",
    alignItems: "center",
    justifyContent: "center",
  },
  closeRegisterCard: {
    width: "100%",
    maxHeight: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  closeRegisterScroll: {
    width: "100%",
  },
  closeRegisterScrollContent: {
    alignItems: "center",
    paddingBottom: 4,
  },
  closeIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  closeTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  closeSub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  closeSummaryGrid: {
    flexDirection: "row",
    gap: 6,
    width: "100%",
    marginBottom: 14,
  },
  closeSummaryBox: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  closeSummaryVal: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  closeSummaryLbl: {
    fontSize: 9,
    fontFamily: "Manrope_600SemiBold",
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
    textAlign: "center",
    lineHeight: 12,
  },
  revenueMethodCard: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  revenueMethodTitle: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  donutGaugeWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeCenterLabel: {
    position: "absolute",
    bottom: 4,
    alignItems: "center",
  },
  gaugeCenterPrice: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  gaugeCenterSub: {
    fontSize: 9,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  legendWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 12,
    rowGap: 6,
    marginTop: 8,
    width: "100%",
    paddingHorizontal: 4,
  },
  legendTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dotTiny: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendTagText: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  modalCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  modalCancelBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  modalActionBtn: {
    flex: 1.2,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  modalActionBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Success cards
  successCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  successIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successIconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 20,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  successSub: {
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginBottom: 16,
    textAlign: "center",
  },
  openRegisterCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  openStatsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  openStatText: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },

  // Settings Card
  settingsCard: {
    width: "100%",
    maxWidth: 390,
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
  },
  connectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  connectedBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#10B981",
  },
  deviceInfoBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
  },
  deviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deviceKey: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  deviceVal: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  disconnectedIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  disconnectedTitle: {
    fontSize: 16,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  disconnectedSub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 16,
  },
  progressBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#635BFF",
  },
  foundDeviceCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#635BFF",
    backgroundColor: "#FAFAFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  foundDeviceName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  foundDeviceIp: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  connectChip: {
    backgroundColor: "#635BFF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  connectChipText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },

  // Menu Box
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuBox: {
    width: 240,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
  },
});
