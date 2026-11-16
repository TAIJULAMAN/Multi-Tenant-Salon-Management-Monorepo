import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SupportTicket,
  getStatusPillStyle,
  getPriorityBadgeStyle,
} from "../supportData";

interface TicketChatModalProps {
  visible: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  onSendMessage: (ticketId: string, messageText: string) => void;
}

export default function TicketChatModal({
  visible,
  onClose,
  ticket,
  onSendMessage,
}: TicketChatModalProps) {
  const [replyText, setReplyText] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [visible, ticket?.messages]);

  if (!ticket) return null;

  const statusBadge = getStatusPillStyle(ticket.status);
  const priorityBadge = getPriorityBadgeStyle(ticket.priority);

  const handleSend = () => {
    if (!replyText.trim()) return;
    onSendMessage(ticket.id, replyText.trim());
    setReplyText("");
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 150);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.ticketIdRow}>
                <Text style={styles.ticketId}>{ticket.id}</Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: statusBadge.bg, borderColor: statusBadge.border },
                  ]}
                >
                  <Text style={[styles.statusText, { color: statusBadge.text }]}>
                    {ticket.status}
                  </Text>
                </View>
                <View
                  style={[
                    styles.priorityPill,
                    { backgroundColor: priorityBadge.bg },
                  ]}
                >
                  <Text style={[styles.priorityText, { color: priorityBadge.text }]}>
                    {ticket.priority}
                  </Text>
                </View>
              </View>

              <Text style={styles.subjectText} numberOfLines={1}>
                {ticket.subject}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Messages Scroll Area */}
          <ScrollView
            ref={scrollRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {ticket.messages.map((msg) => {
              const isUser = msg.sender === "User";
              return (
                <View
                  key={msg.id}
                  style={[styles.messageWrapper, isUser ? styles.msgWrapperUser : styles.msgWrapperAdmin]}
                >
                  <View style={styles.senderHeader}>
                    <Text style={styles.senderName}>{isUser ? "You" : "Customer Support Specialist"}</Text>
                    <Text style={styles.msgTime}>{msg.time}</Text>
                  </View>

                  <View
                    style={[
                      styles.messageBubble,
                      isUser ? styles.bubbleUser : styles.bubbleAdmin,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isUser ? styles.textUser : styles.textAdmin,
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Composer Input */}
          <View style={styles.composerRow}>
            <TextInput
              style={styles.composerInput}
              placeholder="Type a message or response..."
              placeholderTextColor="#94A3B8"
              value={replyText}
              onChangeText={setReplyText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendBtn, !replyText.trim() && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!replyText.trim()}
              activeOpacity={0.8}
            >
              <Ionicons name="send" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 440,
    height: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  ticketIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketId: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  statusPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  priorityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  subjectText: {
    fontSize: 13.5,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  closeBtn: {
    padding: 6,
  },
  messagesScroll: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageWrapper: {
    maxWidth: "85%",
    gap: 4,
  },
  msgWrapperUser: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  msgWrapperAdmin: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  senderHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 4,
  },
  senderName: {
    fontSize: 10.5,
    fontFamily: "Manrope_700Bold",
    color: "#64748B",
  },
  msgTime: {
    fontSize: 9.5,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  messageBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  bubbleUser: {
    backgroundColor: "#635BFF",
    borderTopRightRadius: 2,
  },
  bubbleAdmin: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  messageText: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  textUser: {
    fontFamily: "Manrope_500Medium",
    color: "#FFFFFF",
  },
  textAdmin: {
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
  },
  composerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  composerInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12.5,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    maxHeight: 80,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#635BFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#635BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  sendBtnDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
});
