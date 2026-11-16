import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  WaiverItem,
  WaiverSignedRecord,
  INITIAL_MOCK_WAIVERS,
  INITIAL_SIGNED_WAIVERS,
} from "@/components/waivers/waiversData";

import SignNowSendToModal from "@/components/waivers/modals/SignNowSendToModal";
import AssignWaiverModal from "@/components/waivers/modals/AssignWaiverModal";
import EditWaiverModal from "@/components/waivers/modals/EditWaiverModal";
import DeleteWaiverModal from "@/components/waivers/modals/DeleteWaiverModal";
import ActionDropdownModal, { ActionDropdownItem } from "@/components/files/modals/ActionDropdownModal";
import { Ionicons } from "@expo/vector-icons";

export default function WaiversHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<"Waiver Templates" | "Waiver Signed">("Waiver Templates");
  const [search, setSearch] = useState("");
  const [waivers, setWaivers] = useState<WaiverItem[]>(INITIAL_MOCK_WAIVERS);
  const [signedWaivers, setSignedWaivers] = useState<WaiverSignedRecord[]>(INITIAL_SIGNED_WAIVERS);

  // Modals state
  const [selectedWaiver, setSelectedWaiver] = useState<WaiverItem | null>(null);
  const [signModalVisible, setSignModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assignMode, setAssignMode] = useState<"client" | "employee">("client");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [dropdownModalVisible, setDropdownModalVisible] = useState(false);
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number; width?: number; height?: number } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredWaivers = useMemo(() => {
    return waivers.filter((w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      (w.description && w.description.toLowerCase().includes(search.toLowerCase()))
    );
  }, [waivers, search]);

  const filteredSigned = useMemo(() => {
    return signedWaivers.filter((s) =>
      s.waiverName.toLowerCase().includes(search.toLowerCase()) ||
      s.signerName.toLowerCase().includes(search.toLowerCase()) ||
      s.signerEmail.toLowerCase().includes(search.toLowerCase())
    );
  }, [signedWaivers, search]);

  const totalItems = activeTab === "Waiver Templates" ? filteredWaivers.length : filteredSigned.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTemplates = filteredWaivers.slice(startIndex, startIndex + itemsPerPage);
  const currentSigned = filteredSigned.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  const handleEditSave = (updated: WaiverItem) => {
    setWaivers(waivers.map((w) => (w.id === updated.id ? updated : w)));
  };

  const handleDeleteConfirm = () => {
    if (!selectedWaiver) return;
    setWaivers(waivers.filter((w) => w.id !== selectedWaiver.id));
    setDeleteModalVisible(false);
    setSelectedWaiver(null);
  };

  const openActionMenu = (waiver: WaiverItem, e?: any) => {
    setSelectedWaiver(waiver);
    if (e?.currentTarget?.measureInWindow) {
      e.currentTarget.measureInWindow((x: number, y: number, width: number, height: number) => {
        setAnchorPos({ x, y, width, height });
        setDropdownModalVisible(true);
      });
    } else if (e?.nativeEvent?.pageX) {
      setAnchorPos({
        x: e.nativeEvent.pageX - 10,
        y: e.nativeEvent.pageY,
        width: 20,
        height: 20,
      });
      setDropdownModalVisible(true);
    } else {
      setAnchorPos(null);
      setDropdownModalVisible(true);
    }
  };

  const waiverDropdownItems: ActionDropdownItem[] = [
    {
      id: "view",
      label: "View",
      iconName: "eye-outline",
      iconColor: "#635BFF",
      onPress: () => {
        if (selectedWaiver) {
          router.push({
            pathname: "/(drawer)/waivers/[id]" as any,
            params: { id: selectedWaiver.id },
          });
        }
      },
    },
    {
      id: "edit",
      label: "Edit",
      iconName: "pencil-outline",
      iconColor: "#38BDF8",
      onPress: () => setEditModalVisible(true),
    },
    {
      id: "sign_now",
      label: "Sign Now / Send To",
      iconName: "send-outline",
      iconColor: "#10B981",
      onPress: () => setSignModalVisible(true),
    },
    {
      id: "assign_client",
      label: "Assign to Client's Profiles",
      iconName: "people-outline",
      iconColor: "#10B981",
      onPress: () => {
        setAssignMode("client");
        setAssignModalVisible(true);
      },
    },
    {
      id: "assign_employee",
      label: "Assign to Employee",
      iconName: "person-outline",
      iconColor: "#64748B",
      onPress: () => {
        setAssignMode("employee");
        setAssignModalVisible(true);
      },
    },
    {
      id: "delete",
      label: "Delete",
      iconName: "trash-outline",
      iconColor: "#F43F5E",
      textColor: "#F43F5E",
      onPress: () => setDeleteModalVisible(true),
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.drawerBtn} onPress={handleOpenDrawer} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Waivers</Text>
          <Text style={styles.headerSubtitle}>Consent forms & agreements</Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push("/(drawer)/waivers/add" as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Waiver</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(["Waiver Templates", "Waiver Signed"] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, isActive && styles.tabButtonActive]}
              onPress={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              activeTab === "Waiver Templates"
                ? "Search waiver templates..."
                : "Search signed documents or signers..."
            }
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={(txt) => {
              setSearch(txt);
              setCurrentPage(1);
            }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main List */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Waiver Templates" ? (
          /* TEMPLATES TAB */
          <View style={styles.listContainer}>
            {currentTemplates.map((waiver) => (
              <View key={waiver.id} style={styles.waiverCard}>
                {/* Header Row */}
                <View style={styles.cardTopRow}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="document-text" size={20} color="#635BFF" />
                  </View>
                  <View style={styles.waiverHeaderInfo}>
                    <Text style={styles.waiverName}>{waiver.name}</Text>
                    {waiver.description && (
                      <Text style={styles.waiverDesc} numberOfLines={2}>
                        {waiver.description}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.kebabBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      openActionMenu(waiver, e);
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>

                {/* Metadata Badges Row */}
                <View style={styles.metaRow}>
                  <View style={styles.metaBadge}>
                    <Ionicons name="people-outline" size={13} color="#635BFF" />
                    <Text style={styles.metaText}>{waiver.signers} signer(s)</Text>
                  </View>

                  <View style={styles.metaBadgeGreen}>
                    <Ionicons name="checkmark-circle-outline" size={13} color="#10B981" />
                    <Text style={styles.metaTextGreen}>{waiver.signedCount}</Text>
                  </View>

                  <View style={styles.metaBadge}>
                    <Ionicons name="time-outline" size={13} color="#64748B" />
                    <Text style={styles.metaText}>{waiver.lastUpdate}</Text>
                  </View>
                </View>

                {/* Action Buttons Row */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionBtnPrimary}
                    onPress={() => {
                      setSelectedWaiver(waiver);
                      setSignModalVisible(true);
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="send-outline" size={14} color="#635BFF" />
                    <Text style={styles.actionBtnPrimaryText}>Sign / Send</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnSecondary}
                    onPress={() => {
                      setSelectedWaiver(waiver);
                      setAssignMode("client");
                      setAssignModalVisible(true);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="people" size={14} color="#10B981" />
                    <Text style={[styles.actionBtnSecondaryText, { color: "#10B981" }]}>
                      Assign
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtnIcon}
                    onPress={(e) => {
                      openActionMenu(waiver, e);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="ellipsis-horizontal" size={16} color="#64748B" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {currentTemplates.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="document-outline" size={44} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No waiver templates found</Text>
                <Text style={styles.emptySub}>Create your first waiver template to start collecting digital signatures.</Text>
              </View>
            )}
          </View>
        ) : (
          /* SIGNED TAB */
          <View style={styles.listContainer}>
            {currentSigned.map((rec) => (
              <View key={rec.id} style={styles.signedCard}>
                <View style={styles.signedHeaderRow}>
                  <View style={styles.signedIconBox}>
                    <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                  </View>
                  <View style={styles.signedHeaderInfo}>
                    <Text style={styles.signedWaiverName}>{rec.waiverName}</Text>
                    <Text style={styles.signedClientName}>{rec.signerName}</Text>
                  </View>
                  <View style={styles.statusPillCompleted}>
                    <Text style={styles.statusPillCompletedText}>{rec.status}</Text>
                  </View>
                </View>

                <View style={styles.signedMetaRow}>
                  <View style={styles.signedMetaItem}>
                    <Ionicons name="mail-outline" size={13} color="#64748B" />
                    <Text style={styles.signedMetaText}>{rec.signerEmail}</Text>
                  </View>
                  <View style={styles.signedMetaItem}>
                    <Ionicons name="calendar-outline" size={13} color="#64748B" />
                    <Text style={styles.signedMetaText}>{rec.signedDate}</Text>
                  </View>
                </View>

                <View style={styles.signedActionsRow}>
                  <TouchableOpacity
                    style={styles.viewSignedBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/(drawer)/waivers/sign" as any,
                        params: { waiverName: rec.waiverName },
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Ionicons name="eye-outline" size={14} color="#635BFF" />
                    <Text style={styles.viewSignedBtnText}>View Signed Copy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.downloadSignedBtn}
                    onPress={() => Alert.alert("Download PDF", `Downloading PDF copy for ${rec.signerName}...`)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="download-outline" size={14} color="#475569" />
                    <Text style={styles.downloadSignedBtnText}>PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {currentSigned.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="shield-checkmark-outline" size={44} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No signed waivers yet</Text>
                <Text style={styles.emptySub}>Send waiver invitations to clients or employees to see them here.</Text>
              </View>
            )}
          </View>
        )}

        {/* Pagination Controls */}
        {totalItems > 0 && (
          <View style={styles.paginationRow}>
            <Text style={styles.paginationInfo}>
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
            </Text>

            <View style={styles.pageButtonsGroup}>
              <TouchableOpacity
                style={[styles.pageNavBtn, currentPage === 1 && styles.pageNavBtnDisabled]}
                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                activeOpacity={0.7}
              >
                <Ionicons name="chevron-back" size={14} color={currentPage === 1 ? "#CBD5E1" : "#635BFF"} />
                <Text style={[styles.pageNavBtnText, currentPage === 1 && styles.pageNavBtnTextDisabled]}>
                  Prev
                </Text>
              </TouchableOpacity>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                const isSelected = pg === currentPage;
                return (
                  <TouchableOpacity
                    key={pg}
                    style={[styles.pageNumBtn, isSelected && styles.pageNumBtnActive]}
                    onPress={() => setCurrentPage(pg)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.pageNumBtnText, isSelected && styles.pageNumBtnTextActive]}>
                      {pg}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={[styles.pageNavBtn, currentPage === totalPages && styles.pageNavBtnDisabled]}
                onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                activeOpacity={0.7}
              >
                <Text style={[styles.pageNavBtnText, currentPage === totalPages && styles.pageNavBtnTextDisabled]}>
                  Next
                </Text>
                <Ionicons name="chevron-forward" size={14} color={currentPage === totalPages ? "#CBD5E1" : "#635BFF"} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      <SignNowSendToModal
        visible={signModalVisible}
        onClose={() => {
          setSignModalVisible(false);
          setSelectedWaiver(null);
        }}
        waiver={selectedWaiver}
      />

      <AssignWaiverModal
        visible={assignModalVisible}
        onClose={() => {
          setAssignModalVisible(false);
          setSelectedWaiver(null);
        }}
        waiver={selectedWaiver}
        mode={assignMode}
      />

      <EditWaiverModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedWaiver(null);
        }}
        waiver={selectedWaiver}
        onSave={handleEditSave}
      />

      <DeleteWaiverModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setSelectedWaiver(null);
        }}
        waiver={selectedWaiver}
        onConfirm={handleDeleteConfirm}
      />

      <ActionDropdownModal
        visible={dropdownModalVisible}
        onClose={() => setDropdownModalVisible(false)}
        items={waiverDropdownItems}
        anchorPosition={anchorPos}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    gap: 12,
  },
  drawerBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#635BFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  tabButtonActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  tabText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  tabTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  listContainer: {
    gap: 12,
  },
  waiverCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  waiverHeaderInfo: {
    flex: 1,
    gap: 3,
  },
  waiverName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  waiverDesc: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metaText: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  metaBadgeGreen: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  metaTextGreen: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#10B981",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  actionBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
  },
  actionBtnIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  actionBtnIconDelete: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  signedCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 10,
  },
  signedCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  signedIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },
  signerName: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  signedWaiverName: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusCompleted: {
    backgroundColor: "#DCFCE7",
  },
  statusPending: {
    backgroundColor: "#FEF3C7",
  },
  statusDeclined: {
    backgroundColor: "#FEE2E2",
  },
  statusPillText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  statusTextCompleted: {
    color: "#16A34A",
  },
  statusTextPending: {
    color: "#D97706",
  },
  statusTextDeclined: {
    color: "#DC2626",
  },
  signedMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 8,
  },
  signedMetaText: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  signedActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  viewPdfBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewPdfBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resendBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#475569",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  emptySub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 18,
  },
  paginationCard: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 14,
    gap: 12,
  },
  paginationInfo: {
    fontSize: 11,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  pageButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageNavBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  pageNavBtnDisabled: {
    borderColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
  },
  pageNavBtnText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  pageNavBtnTextDisabled: {
    color: "#CBD5E1",
  },
  pageNumBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  pageNumBtnActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  pageNumText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  pageNumTextActive: {
    color: "#FFFFFF",
  },
});
