import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { INITIAL_MOCK_WAIVERS, WaiverItem } from "@/components/waivers/waiversData";
import SignNowSendToModal from "@/components/waivers/modals/SignNowSendToModal";
import AssignWaiverModal from "@/components/waivers/modals/AssignWaiverModal";
import EditWaiverModal from "@/components/waivers/modals/EditWaiverModal";

export default function ViewWaiverDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const waiverId = params.id as string;
  const initialWaiver =
    INITIAL_MOCK_WAIVERS.find((w) => w.id === waiverId) || INITIAL_MOCK_WAIVERS[0];

  const [waiver, setWaiver] = useState<WaiverItem>(initialWaiver);
  const [signModalVisible, setSignModalVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={20} color="#635BFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Waiver Details</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            Template #{waiver.id}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editHeaderBtn}
          onPress={() => setEditModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={16} color="#635BFF" />
          <Text style={styles.editHeaderBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Template Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text" size={22} color="#635BFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{waiver.name}</Text>
              <Text style={styles.heroMeta}>Last updated {waiver.lastUpdate} • {waiver.status}</Text>
            </View>
          </View>

          {waiver.description && (
            <Text style={styles.heroDesc}>{waiver.description}</Text>
          )}

          <View style={styles.kpiRow}>
            <View style={styles.kpiBox}>
              <Text style={styles.kpiVal}>{waiver.signers}</Text>
              <Text style={styles.kpiLabel}>Required Signers</Text>
            </View>

            <View style={styles.kpiBox}>
              <Text style={[styles.kpiVal, { color: "#10B981" }]}>{waiver.signedCount}</Text>
              <Text style={styles.kpiLabel}>Total Signed</Text>
            </View>

            <View style={styles.kpiBox}>
              <Text style={styles.kpiVal}>{waiver.fieldsCount || 5}</Text>
              <Text style={styles.kpiLabel}>Form Fields</Text>
            </View>
          </View>
        </View>

        {/* Direct Action Buttons */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.primaryActionBtn}
            onPress={() => setSignModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
            <Text style={styles.primaryActionBtnText}>Sign Now / Send To</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionBtn}
            onPress={() => setAssignModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="people" size={16} color="#10B981" />
            <Text style={styles.secondaryActionBtnText}>Assign Clients</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configured Signer Fields</Text>
          <View style={styles.fieldsList}>
            {[
              { name: "Full Legal Name", type: "Text", required: true },
              { name: "Email Address", type: "Email", required: true },
              { name: "Date of Birth", type: "Date", required: true },
              { name: "Allergy & Skin Sensitivities", type: "Text Area", required: false },
              { name: "Digital Signature", type: "Signature", required: true },
            ].map((f, idx) => (
              <View key={idx} style={styles.fieldRow}>
                <View style={styles.fieldLeft}>
                  <Text style={styles.fieldIndex}>#{idx + 1}</Text>
                  <Text style={styles.fieldName}>{f.name}</Text>
                </View>
                <View style={styles.fieldRight}>
                  <Text style={styles.fieldTypeTag}>{f.type}</Text>
                  {f.required && <Text style={styles.requiredBadge}>Required</Text>}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Direct URL Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Direct Signing URL</Text>
          <View style={styles.urlBox}>
            <Text style={styles.urlText} numberOfLines={1}>
              {waiver.directLink}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={() => Alert.alert("Copied", "Direct signing link copied to clipboard.")}
            activeOpacity={0.7}
          >
            <Ionicons name="copy-outline" size={14} color="#635BFF" />
            <Text style={styles.copyBtnText}>Copy Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <SignNowSendToModal
        visible={signModalVisible}
        onClose={() => setSignModalVisible(false)}
        waiver={waiver}
      />

      <AssignWaiverModal
        visible={assignModalVisible}
        onClose={() => setAssignModalVisible(false)}
        waiver={waiver}
        mode="client"
      />

      <EditWaiverModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        waiver={waiver}
        onSave={(updated) => setWaiver(updated)}
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
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  editHeaderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editHeaderBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  heroMeta: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
  },
  heroDesc: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#475569",
    lineHeight: 18,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
  },
  kpiRow: {
    flexDirection: "row",
    gap: 10,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 10,
    alignItems: "center",
  },
  kpiVal: {
    fontSize: 16,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  kpiLabel: {
    fontSize: 10,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 2,
    textAlign: "center",
  },
  actionGrid: {
    flexDirection: "row",
    gap: 10,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#635BFF",
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ECFDF5",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  secondaryActionBtnText: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#10B981",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  fieldsList: {
    gap: 8,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  fieldLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fieldIndex: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
  },
  fieldName: {
    fontSize: 13,
    fontFamily: "Manrope_600SemiBold",
    color: "#1E293B",
  },
  fieldRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fieldTypeTag: {
    fontSize: 10,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredBadge: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
    color: "#EF4444",
  },
  urlBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  urlText: {
    fontSize: 12,
    fontFamily: "Manrope_600SemiBold",
    color: "#635BFF",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingVertical: 9,
    borderRadius: 8,
  },
  copyBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
});
