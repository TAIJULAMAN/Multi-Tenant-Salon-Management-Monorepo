import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  DashboardActivity,
  DASHBOARD_ACTIVITIES,
} from "@/data/dashboardData";
import CustomModal from "@/components/ui/CustomModal";
import CustomButton from "@/components/ui/CustomButton";

interface DashboardRecentActivityProps {
  selectedSalon: string;
}

export default function DashboardRecentActivity({ selectedSalon }: DashboardRecentActivityProps) {
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [selectedActivity, setSelectedActivity] = useState<DashboardActivity | null>(null);

  const activities = DASHBOARD_ACTIVITIES.filter((act) => {
    const matchesSalon = selectedSalon === "All Salons" || act.salon === selectedSalon;
    const matchesPriority = priorityFilter === "All" || act.priority === priorityFilter;
    return matchesSalon && matchesPriority;
  });

  const getPriorityStyle = (priority: DashboardActivity["priority"]) => {
    switch (priority) {
      case "High":
        return { bg: "#C71F4D", text: "#FFFFFF" };
      case "Medium":
        return { bg: "#FCC419", text: "#1E293B" };
      case "Low":
        return { bg: "#0D6E52", text: "#FFFFFF" };
    }
  };

  const getActivityIcon = (index: number) => {
    if (index === 0) return { icon: "person-remove-outline", bg: "#FFE8EC", color: "#FF4B72" };
    if (index === 1) return { icon: "document-text-outline", bg: "#E2F9F0", color: "#20C997" };
    return { icon: "alert-circle-outline", bg: "#FFF4E6", color: "#FD7E14" };
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Recent Activity</Text>

        {/* Priority Filter Chips */}
        <View style={styles.priorityFilterRow}>
          {(["All", "High", "Medium", "Low"] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.filterChip, priorityFilter === p && styles.filterChipActive]}
              onPress={() => setPriorityFilter(p)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, priorityFilter === p && styles.filterChipTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Activity List */}
      <View style={styles.activitiesList}>
        {activities.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="notifications-off-outline" size={32} color="#9CA3AF" />
            <Text style={styles.emptyText}>No activities found for this filter.</Text>
          </View>
        ) : (
          activities.map((item, index) => {
            const pStyle = getPriorityStyle(item.priority);
            const iconConfig = getActivityIcon(index);

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.activityCard}
                onPress={() => setSelectedActivity(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.avatarWrap, { backgroundColor: iconConfig.bg }]}>
                  <Ionicons name={iconConfig.icon as any} size={20} color={iconConfig.color} />
                </View>

                <View style={styles.activityContent}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.activityTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={[styles.priorityBadge, { backgroundColor: pStyle.bg }]}>
                      <Text style={[styles.priorityBadgeText, { color: pStyle.text }]}>
                        {item.priority}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.salonName}>{item.salon}</Text>
                  <Text style={styles.reasonText} numberOfLines={2}>
                    {item.reason}
                  </Text>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <CustomModal
          visible={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          title="Activity Details"
        >
          <View style={{ paddingTop: 4, gap: 12 }}>
            <View style={styles.modalBanner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{selectedActivity.title}</Text>
                <Text style={styles.modalSalon}>{selectedActivity.salon}</Text>
              </View>
            </View>

            <View style={styles.modalInfoBox}>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Priority Level:</Text>
                <Text
                  style={[
                    styles.modalVal,
                    { color: getPriorityStyle(selectedActivity.priority).bg, fontWeight: "700" },
                  ]}
                >
                  {selectedActivity.priority} Priority
                </Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Timestamp:</Text>
                <Text style={styles.modalVal}>{selectedActivity.date}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}>Notice Context</Text>
            <View style={styles.noticeContextBox}>
              <Text style={styles.noticeContextText}>{selectedActivity.reason}</Text>
            </View>

            <CustomButton
              title="Close"
              onPress={() => setSelectedActivity(null)}
              variant="outline"
              style={{ marginTop: 8 }}
            />
          </View>
        </CustomModal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: -0.2,
  },
  priorityFilterRow: {
    flexDirection: "row",
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "rgba(99, 91, 255, 0.1)",
    borderColor: "#635BFF",
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  filterChipTextActive: {
    color: "#635BFF",
    fontWeight: "700",
  },
  activitiesList: {
    gap: 12,
  },
  activityCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityBadgeText: {
    fontSize: 9,
    fontWeight: "700",
  },
  salonName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#635BFF",
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 16,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
  },
  emptyBox: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
  },
  modalBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    borderRadius: 12,
    padding: 12,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  modalSalon: {
    fontSize: 11,
    color: "#635BFF",
    fontWeight: "600",
  },
  modalInfoBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  modalVal: {
    fontSize: 12,
    color: "#111827",
  },
  noticeContextBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  noticeContextText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 18,
  },
});
