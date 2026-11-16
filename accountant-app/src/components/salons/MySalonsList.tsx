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
import { SalonInfo } from "@/data/salonsData";

interface MySalonsListProps {
  salons: SalonInfo[];
  onSelectSalon: (salon: SalonInfo) => void;
  onOpenInviteModal: () => void;
  onUnlinkSalon?: (salon: SalonInfo) => void;
}

export default function MySalonsList({
  salons,
  onSelectSalon,
  onOpenInviteModal,
  onUnlinkSalon,
}: MySalonsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "In order" | "Late">("All");
  const [planFilter, setPlanFilter] = useState<"All" | "Premium" | "Enterprise" | "Basic">("All");

  const filteredSalons = salons.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || s.paymentStatus === statusFilter;
    const matchesPlan = planFilter === "All" || s.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "SRL":
      case "SRLS":
        return { bg: "#EEECFF", text: "#635BFF" };
      case "SPA":
        return { bg: "#ECFDF5", text: "#10B981" };
      case "SNC":
      case "SAS":
        return { bg: "#FEF3C7", text: "#D97706" };
      default:
        return { bg: "#F3F4F6", text: "#4B5563" };
    }
  };

  const handleUnlink = (salon: SalonInfo) => {
    Alert.alert(
      "Disconnect Salon",
      `Are you sure you want to unlink ${salon.name}? You will lose accountant administrative access.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () => {
            if (onUnlinkSalon) onUnlinkSalon(salon);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Action Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search salon, owner, city..."
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

        <TouchableOpacity
          style={styles.inviteButton}
          onPress={onOpenInviteModal}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.inviteButtonText}>Invite Salon</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        <Text style={styles.filterLabel}>Status:</Text>
        {(["All", "In order", "Late"] as const).map((st) => (
          <TouchableOpacity
            key={st}
            style={[styles.filterChip, statusFilter === st && styles.filterChipActive]}
            onPress={() => setStatusFilter(st)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, statusFilter === st && styles.filterChipTextActive]}>
              {st}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.filterDivider} />

        <Text style={styles.filterLabel}>Plan:</Text>
        {(["All", "Premium", "Enterprise", "Basic"] as const).map((pl) => (
          <TouchableOpacity
            key={pl}
            style={[styles.filterChip, planFilter === pl && styles.filterChipActive]}
            onPress={() => setPlanFilter(pl)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, planFilter === pl && styles.filterChipTextActive]}>
              {pl}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count Info */}
      <View style={styles.countRow}>
        <Text style={styles.countText}>
          Showing <Text style={{ fontWeight: "700", color: "#111827" }}>{filteredSalons.length}</Text> salons
        </Text>
      </View>

      {/* Salons List */}
      {filteredSalons.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No salons found</Text>
          <Text style={styles.emptySubtitle}>Try changing your search query or filters</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {filteredSalons.map((salon) => {
            const badgeColor = getBadgeColor(salon.badge);

            return (
              <TouchableOpacity
                key={salon.id}
                style={styles.salonCard}
                onPress={() => onSelectSalon(salon)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.avatar}>
                    <Ionicons name="business" size={22} color="#635BFF" />
                  </View>

                  <View style={styles.headerInfo}>
                    <View style={styles.titleRow}>
                      <Text style={styles.salonName} numberOfLines={1}>
                        {salon.name}
                      </Text>
                      <View style={[styles.badgePill, { backgroundColor: badgeColor.bg }]}>
                        <Text style={[styles.badgeText, { color: badgeColor.text }]}>
                          {salon.badge}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.ownerText}>
                      {salon.ownerName} • {salon.city}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    {/* Unlink button matching web disconnect action */}
                    <TouchableOpacity
                      style={styles.unlinkBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleUnlink(salon);
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="link-outline" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardFooter}>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Plan</Text>
                    <Text style={styles.footerValue}>{salon.plan}</Text>
                  </View>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Referral</Text>
                    <Text style={[styles.footerValue, { color: "#635BFF", fontWeight: "700" }]}>
                      {salon.referral}
                    </Text>
                  </View>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Renewal</Text>
                    <Text style={styles.footerValue}>{salon.nextRenewal}</Text>
                  </View>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Status</Text>
                    <View
                      style={[
                        styles.statusPill,
                        salon.paymentStatus === "In order"
                          ? styles.statusInOrder
                          : styles.statusLate,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusPillText,
                          salon.paymentStatus === "In order"
                            ? styles.statusTextInOrder
                            : styles.statusTextLate,
                        ]}
                      >
                        {salon.paymentStatus}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
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
  topBar: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 10,
    height: 44,
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
  inviteButton: {
    backgroundColor: "#635BFF",
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  inviteButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: 8,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    marginRight: 2,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  filterChipActive: {
    backgroundColor: "#635BFF",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  filterDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
  countRow: {
    marginVertical: 10,
  },
  countText: {
    fontSize: 12,
    color: "#6B7280",
  },
  listContainer: {
    gap: 12,
  },
  salonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  salonName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    flexShrink: 1,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  ownerText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  unlinkBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerItem: {
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusInOrder: {
    backgroundColor: "#ECFDF5",
  },
  statusLate: {
    backgroundColor: "#FEF2F2",
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: "700",
  },
  statusTextInOrder: {
    color: "#10B981",
  },
  statusTextLate: {
    color: "#EF4444",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
});
