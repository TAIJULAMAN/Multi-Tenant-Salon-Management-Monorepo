import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SentInvitation } from "@/data/salonsData";

interface InvitationsSentListProps {
  invitations: SentInvitation[];
  onResend: (id: string) => void;
  onRevoke: (id: string) => void;
}

export default function InvitationsSentList({
  invitations,
  onResend,
  onRevoke,
}: InvitationsSentListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Accepted" | "Rejected" | "Expired"
  >("All");

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      inv.salonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: SentInvitation["status"]) => {
    switch (status) {
      case "Accepted":
        return { bg: "#ECFDF5", text: "#10B981", icon: "checkmark-circle" as const };
      case "Pending":
        return { bg: "#FFFBEB", text: "#F59E0B", icon: "time" as const };
      case "Rejected":
        return { bg: "#FEF2F2", text: "#EF4444", icon: "close-circle" as const };
      case "Expired":
        return { bg: "#F3F4F6", text: "#6B7280", icon: "alert-circle" as const };
    }
  };

  const handleResend = (inv: SentInvitation) => {
    Alert.alert(
      "Resend Invitation",
      `Resend accountant connection invitation to ${inv.email}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Resend",
          onPress: () => onResend(inv.id),
        },
      ]
    );
  };

  const handleRevoke = (inv: SentInvitation) => {
    Alert.alert(
      "Revoke Invitation",
      `Are you sure you want to cancel the invitation sent to ${inv.salonName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Revoke",
          style: "destructive",
          onPress: () => onRevoke(inv.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Search & Header */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sent invitations..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {(["All", "Pending", "Accepted", "Rejected", "Expired"] as const).map((st) => (
          <TouchableOpacity
            key={st}
            style={[styles.filterChip, statusFilter === st && styles.filterChipActive]}
            onPress={() => setStatusFilter(st)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === st && styles.filterChipTextActive,
              ]}
            >
              {st}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Invitation Cards */}
      {filteredInvitations.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="mail-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Sent Invitations</Text>
          <Text style={styles.emptyDesc}>No invitations match your filters.</Text>
        </View>
      ) : (
        <View style={styles.cardsList}>
          {filteredInvitations.map((inv) => {
            const statusConfig = getStatusColor(inv.status);
            return (
              <View key={inv.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.avatarWrap}>
                      <Ionicons name="send" size={18} color="#635BFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.salonName} numberOfLines={1}>
                        {inv.salonName}
                      </Text>
                      <Text style={styles.emailText} numberOfLines={1}>
                        {inv.email}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    <Ionicons
                      name={statusConfig.icon}
                      size={12}
                      color={statusConfig.text}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.statusBadgeText, { color: statusConfig.text }]}>
                      {inv.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBody}>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>Sent Date</Text>
                    <Text style={styles.infoValue}>{inv.date}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>Plan</Text>
                    <Text style={styles.infoValue}>{inv.plan}</Text>
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>Share</Text>
                    <Text style={[styles.infoValue, { color: "#635BFF", fontWeight: "700" }]}>
                      {inv.share}
                    </Text>
                  </View>
                </View>

                {/* Actions for Pending / Expired */}
                {(inv.status === "Pending" || inv.status === "Expired") && (
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.actionBtnSecondary}
                      onPress={() => handleResend(inv)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="refresh-outline" size={14} color="#635BFF" style={{ marginRight: 4 }} />
                      <Text style={styles.actionBtnSecondaryText}>Resend</Text>
                    </TouchableOpacity>

                    {inv.status === "Pending" && (
                      <TouchableOpacity
                        style={styles.actionBtnDanger}
                        onPress={() => handleRevoke(inv)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                        <Text style={styles.actionBtnDangerText}>Revoke</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 13,
    color: "#1F2937",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterChipActive: {
    backgroundColor: "#635BFF",
    borderColor: "#635BFF",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  cardsList: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  salonName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  emailText: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoCol: {
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  cardActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    justifyContent: "flex-end",
  },
  actionBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EEECFF",
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#635BFF",
  },
  actionBtnDanger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
  },
  actionBtnDangerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EF4444",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});
