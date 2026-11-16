import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReceivedInvitation } from "@/data/salonsData";

interface PendingInvitationsViewProps {
  invitations: ReceivedInvitation[];
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

export default function PendingInvitationsView({
  invitations,
  onAccept,
  onDecline,
}: PendingInvitationsViewProps) {
  const handleAcceptPress = (inv: ReceivedInvitation) => {
    Alert.alert(
      "Accept Invitation",
      `Accept invitation from ${inv.salonName}? You will be linked as their accountant.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => onAccept(inv.id),
        },
      ]
    );
  };

  const handleDeclinePress = (inv: ReceivedInvitation) => {
    Alert.alert(
      "Decline Invitation",
      `Decline invitation from ${inv.salonName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decline",
          style: "destructive",
          onPress: () => onDecline(inv.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Pending Invitations</Text>
          {invitations.length > 0 && (
            <View style={styles.badgeWrap}>
              <Text style={styles.badgeText}>{invitations.length}</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerSubtitle}>
          Invitations received from salon owners requesting your accounting services.
        </Text>
      </View>

      {/* Cards List or Empty State */}
      {invitations.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="mail-open-outline" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyTitle}>No Pending Invitations</Text>
          <Text style={styles.emptyDesc}>
            You have responded to all salon connection requests. New invitations will appear here.
          </Text>
        </View>
      ) : (
        <View style={styles.cardsList}>
          {invitations.map((inv) => (
            <View key={inv.id} style={styles.invitationCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.avatarWrap}>
                  <Ionicons name="storefront" size={20} color="#635BFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.salonName}>{inv.salonName}</Text>
                  <Text style={styles.senderName}>
                    From: {inv.senderName} {inv.senderEmail ? `(${inv.senderEmail})` : ""}
                  </Text>
                </View>
                <Text style={styles.sentDate}>{inv.sentDate}</Text>
              </View>

              {/* Message Quote Box */}
              <View style={styles.messageBox}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#635BFF" style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.messageText}>"{inv.message}"</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.declineBtn}
                  onPress={() => handleDeclinePress(inv)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.declineBtnText}>Decline</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={() => handleAcceptPress(inv)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.acceptBtnText}>Accept Connection</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  badgeWrap: {
    backgroundColor: "#635BFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 16,
  },
  cardsList: {
    gap: 12,
  },
  invitationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEECFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  salonName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  senderName: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  sentDate: {
    fontSize: 11,
    color: "#9CA3AF",
    alignSelf: "flex-start",
  },
  messageBox: {
    flexDirection: "row",
    backgroundColor: "#FAF9FF",
    borderLeftWidth: 3,
    borderLeftColor: "#635BFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  messageText: {
    fontSize: 12,
    color: "#4B5563",
    fontStyle: "italic",
    flex: 1,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  declineBtn: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  declineBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  acceptBtn: {
    flex: 1.4,
    backgroundColor: "#635BFF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 20,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
  },
});
