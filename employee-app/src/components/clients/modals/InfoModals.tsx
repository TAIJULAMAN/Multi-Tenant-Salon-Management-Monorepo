import React from "react";
import { ScrollView, Text, View, Image, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { AmountBlock, FigmaModal, Label, ModalFooter, RankRow, SoftButton } from "../common";
import {
  ClientAppointment,
  CommunicationEntry,
  MESSAGE_STATUS_STYLES,
  PAYMENT_METHOD_STYLES,
  RECEIPT_STATUS_STYLES,
  Receipt,
  SENDER_TYPE_STYLES,
  STAFF_AVATARS,
} from "../clientsData";

// ---------------------------------------------------------------------------
// List of Services (Figma 1:37436)
// ---------------------------------------------------------------------------

export function ServicesListModal({
  visible,
  onClose,
  appointment,
}: {
  visible: boolean;
  onClose: () => void;
  appointment: ClientAppointment | null;
}) {
  return (
    <FigmaModal visible={visible} onClose={onClose} title="List of Services">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {appointment?.services.map((s, i) => (
          <RankRow
            key={`${s.name}-${i}`}
            index={i + 1}
            name={s.name}
            right={<AmountBlock amount={`€ ${s.price}`} caption={s.paymentState} />}
          />
        ))}
      </ScrollView>
    </FigmaModal>
  );
}

// ---------------------------------------------------------------------------
// Communication Log detail (Figma 1:39915 WhatsApp replies, 1:40248 Email content)
// ---------------------------------------------------------------------------

/** Solid round channel tile (WhatsApp green, Email primary, SMS yellow). */
export function ChannelIcon({ channel, size = 40 }: { channel: CommunicationEntry["channel"]; size?: number }) {
  const cfg =
    channel === "WhatsApp"
      ? { icon: "logo-whatsapp" as const, bg: colors.green }
      : channel === "Email"
      ? { icon: "mail-outline" as const, bg: colors.primary }
      : { icon: "chatbubbles-outline" as const, bg: colors.yellow };
  return (
    <View style={[styles.channelIcon, { width: size, height: size, borderRadius: size / 2, backgroundColor: cfg.bg }]}>
      <Ionicons name={cfg.icon} size={size * 0.5} color={colors.white} />
    </View>
  );
}

export function senderType(entry: CommunicationEntry) {
  return entry.sender ? ("Staff Member" as const) : ("System" as const);
}

export function CommunicationDetailModal({
  visible,
  onClose,
  entry,
  onArchive,
}: {
  visible: boolean;
  onClose: () => void;
  entry: CommunicationEntry | null;
  onArchive?: (entry: CommunicationEntry) => void;
}) {
  return (
    <FigmaModal visible={visible} onClose={onClose} title="Communication Log">
      {entry && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.widget}>
            <View style={styles.msgHeader}>
              <ChannelIcon channel={entry.channel} />
              <Text style={styles.msgTitle}>{entry.message}</Text>
            </View>

            <View style={styles.block}>
              <Text style={styles.blockTitle}>Informations</Text>
              <Text style={styles.label}>Sent by</Text>
              <View style={styles.senderRow}>
                {entry.sender ? (
                  <>
                    <Image source={{ uri: STAFF_AVATARS[3] }} style={styles.senderAvatar} />
                    <Text style={styles.value}>{entry.sender}</Text>
                  </>
                ) : (
                  <Text style={styles.value}>System</Text>
                )}
                <Label label={senderType(entry)} styleDef={SENDER_TYPE_STYLES[senderType(entry)]} />
              </View>
              <View style={styles.twoCol}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Date</Text>
                  <Text style={styles.value}>{entry.date}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Time</Text>
                  <Text style={styles.value}>{entry.time}</Text>
                </View>
              </View>
              <Text style={[styles.label, { marginTop: 14 }]}>Status</Text>
              <Label label={entry.status} styleDef={MESSAGE_STATUS_STYLES[entry.status]} />
            </View>

            <View style={styles.block}>
              <Text style={styles.blockTitle}>Content</Text>
              {entry.replies ? (
                entry.replies.length === 0 ? (
                  <Text style={styles.muted}>No replies yet.</Text>
                ) : (
                  entry.replies.map((r, i) => {
                    const own = !r.fromClient;
                    return (
                      <View key={i} style={[styles.chatWrap, own && { alignItems: "flex-end" }]}>
                        <View style={[styles.chatUser, own && { flexDirection: "row-reverse" }]}>
                          <Image
                            source={{ uri: own ? STAFF_AVATARS[3] : STAFF_AVATARS[4] }}
                            style={styles.chatAvatar}
                          />
                          <Text style={styles.chatAuthor}>{r.author}</Text>
                        </View>
                        <View style={[styles.bubble, own ? styles.bubbleOwn : styles.bubbleClient]}>
                          <Text style={styles.bubbleText}>{r.text}</Text>
                        </View>
                      </View>
                    );
                  })
                )
              ) : (
                <View style={styles.emailBox}>
                  <Text style={styles.emailTitle}>{entry.contentTitle}</Text>
                  <Text style={styles.emailBody}>{entry.contentBody}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <SoftButton
              label="Archive"
              onPress={() => {
                onArchive?.(entry);
                onClose();
              }}
            />
          </View>
        </ScrollView>
      )}
    </FigmaModal>
  );
}

// ---------------------------------------------------------------------------
// Receipt detail (opened from the receipt ID link in "Receipts list")
// ---------------------------------------------------------------------------

export function ReceiptModal({
  visible,
  onClose,
  receipt,
}: {
  visible: boolean;
  onClose: () => void;
  receipt: Receipt | null;
}) {
  return (
    <FigmaModal visible={visible} onClose={onClose} title={receipt ? `Receipt ${receipt.id}` : "Receipt"}>
      {receipt && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.senderRow, { marginBottom: 16 }]}>
            <Image source={{ uri: receipt.avatar }} style={styles.receiptAvatar} />
            <Text style={styles.value}>{receipt.teamMember}</Text>
          </View>
          {[
            ["Service", receipt.service],
            ["Scheduled Date", receipt.scheduledDate],
            ["Price", `€ ${receipt.price}`],
          ].map(([l, v]) => (
            <View key={l} style={styles.receiptRow}>
              <Text style={styles.label}>{l}</Text>
              <Text style={styles.value}>{v}</Text>
            </View>
          ))}
          <View style={styles.receiptRow}>
            <Text style={styles.label}>Payment Method</Text>
            <Label label={receipt.paymentMethod} styleDef={PAYMENT_METHOD_STYLES[receipt.paymentMethod]} />
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.label}>Status</Text>
            <Label label={receipt.status} styleDef={RECEIPT_STATUS_STYLES[receipt.status]} />
          </View>
          <ModalFooter
            primaryLabel="Download"
            onPrimary={() => Alert.alert("Download", `Receipt ${receipt.id} downloaded.`)}
          />
        </ScrollView>
      )}
    </FigmaModal>
  );
}

const styles = StyleSheet.create({
  channelIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  widget: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: 16,
    gap: 16,
  },
  msgHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  msgTitle: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  block: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: 16,
    ...shadows.card,
  },
  blockTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  muted: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  senderRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  senderAvatar: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  receiptAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
  },
  twoCol: {
    flexDirection: "row",
    gap: 12,
  },
  chatWrap: {
    marginBottom: 14,
  },
  chatUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  chatAuthor: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  bubble: {
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: "90%",
  },
  bubbleOwn: {
    alignSelf: "flex-end",
    backgroundColor: colors.tealSoft,
  },
  bubbleClient: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryTint,
    marginLeft: 46,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  emailBox: {
    backgroundColor: colors.primaryTint,
    borderRadius: radius.card,
    padding: 20,
    gap: 12,
  },
  emailTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  emailBody: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  receiptRow: {
    marginBottom: 14,
  },
});
