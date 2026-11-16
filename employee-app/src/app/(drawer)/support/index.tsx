import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  SupportTicket,
  INITIAL_SUPPORT_TICKETS,
  SUPPORT_FAQS,
  getStatusPillStyle,
  getPriorityBadgeStyle,
} from "@/components/support/supportData";
import CreateTicketModal from "@/components/support/modals/CreateTicketModal";
import TicketChatModal from "@/components/support/modals/TicketChatModal";

export default function SupportHomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [activeTab, setActiveTab] = useState<"All" | "Replied" | "Pending Admin" | "Closed">("All");
  const [faqSearch, setFaqSearch] = useState("");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq_1");

  // Modals state
  const [createTicketVisible, setCreateTicketVisible] = useState(false);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);

  const filteredTickets = useMemo(() => {
    if (activeTab === "All") return tickets;
    return tickets.filter((t) => t.status === activeTab);
  }, [tickets, activeTab]);

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return SUPPORT_FAQS;
    return SUPPORT_FAQS.filter(
      (f) =>
        f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.answer.toLowerCase().includes(faqSearch.toLowerCase())
    );
  }, [faqSearch]);

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  const handleCreateTicket = (newTicket: SupportTicket) => {
    setTickets([newTicket, ...tickets]);
  };

  const handleSendMessage = (ticketId: string, messageText: string) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const newMsg = {
          id: `m_${Date.now()}`,
          sender: "User" as const,
          text: messageText,
          time: "Just now",
        };
        const updatedTicket = {
          ...t,
          status: "Pending Admin" as const,
          messages: [...t.messages, newMsg],
        };
        if (activeTicket?.id === ticketId) {
          setActiveTicket(updatedTicket);
        }
        return updatedTicket;
      }
      return t;
    });
    setTickets(updated);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.drawerBtn} onPress={handleOpenDrawer} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <Text style={styles.headerSubtitle}>Customer support & knowledge base</Text>
        </View>

        <TouchableOpacity
          style={styles.newTicketBtn}
          onPress={() => setCreateTicketVisible(true)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
          <Text style={styles.newTicketBtnText}>New Ticket</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Banner */}
        <View style={styles.contactBanner}>
          <View style={styles.bannerHeader}>
            <View style={styles.bannerIconCircle}>
              <Ionicons name="headset-outline" size={20} color="#635BFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>We&apos;re here to help!</Text>
              <Text style={styles.bannerSubtitle}>
                Monday - Saturday • 8:00 AM - 8:00 PM EST
              </Text>
            </View>
          </View>

          <View style={styles.channelsGrid}>
            <TouchableOpacity
              style={styles.channelCard}
              onPress={() => Linking.openURL("mailto:support@maximastudio.com")}
              activeOpacity={0.7}
            >
              <View style={styles.channelIconBox}>
                <Ionicons name="mail-outline" size={18} color="#635BFF" />
              </View>
              <View style={styles.channelInfo}>
                <Text style={styles.channelLabel}>Email Support</Text>
                <Text style={styles.channelVal}>support@maximastudio.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.channelCard}
              onPress={() => Linking.openURL("tel:+18005550199")}
              activeOpacity={0.7}
            >
              <View style={[styles.channelIconBox, { backgroundColor: "#ECFDF5" }]}>
                <Ionicons name="call-outline" size={18} color="#10B981" />
              </View>
              <View style={styles.channelInfo}>
                <Text style={styles.channelLabel}>Direct Phone</Text>
                <Text style={styles.channelVal}>+1 (800) 555-0199</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tickets Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>My Support Tickets</Text>
              <Text style={styles.sectionSubtitle}>View ongoing inquiries and responses</Text>
            </View>
            <TouchableOpacity
              style={styles.submitTicketSmallBtn}
              onPress={() => setCreateTicketVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={14} color="#635BFF" />
              <Text style={styles.submitTicketSmallText}>Submit</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View style={styles.tabsRow}>
            {(["All", "Replied", "Pending Admin", "Closed"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tabPill, isActive && styles.tabPillActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tabPillText, isActive && styles.tabPillTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tickets List */}
          <View style={styles.ticketsList}>
            {filteredTickets.map((ticket) => {
              const statusStyle = getStatusPillStyle(ticket.status);
              const priorityStyle = getPriorityBadgeStyle(ticket.priority);

              return (
                <TouchableOpacity
                  key={ticket.id}
                  style={styles.ticketCard}
                  onPress={() => setActiveTicket(ticket)}
                  activeOpacity={0.8}
                >
                  {/* Top Row */}
                  <View style={styles.ticketCardHeader}>
                    <View style={styles.ticketIdBadge}>
                      <Text style={styles.ticketIdText}>{ticket.id}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                      <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
                        {ticket.status}
                      </Text>
                    </View>
                    <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
                      <Text style={[styles.priorityBadgeText, { color: priorityStyle.text }]}>
                        {ticket.priority}
                      </Text>
                    </View>
                    <Text style={styles.ticketDate}>{ticket.date}</Text>
                  </View>

                  {/* Subject */}
                  <Text style={styles.ticketSubject} numberOfLines={2}>
                    {ticket.subject}
                  </Text>

                  {/* Description / Latest Message */}
                  <Text style={styles.ticketSnippet} numberOfLines={2}>
                    {ticket.messages[ticket.messages.length - 1]?.text || ticket.description}
                  </Text>

                  {/* Footer */}
                  <View style={styles.ticketFooter}>
                    <View style={styles.categoryBadge}>
                      <Ionicons name="folder-outline" size={12} color="#64748B" />
                      <Text style={styles.categoryBadgeText}>{ticket.category}</Text>
                    </View>

                    <View style={styles.chatActionBtn}>
                      <Ionicons name="chatbubbles-outline" size={13} color="#635BFF" />
                      <Text style={styles.chatActionText}>
                        {ticket.messages.length} msg{ticket.messages.length > 1 ? "s" : ""} • View
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {filteredTickets.length === 0 && (
              <View style={styles.emptyTickets}>
                <Ionicons name="mail-open-outline" size={36} color="#CBD5E1" />
                <Text style={styles.emptyTicketsTitle}>No tickets in this section</Text>
                <Text style={styles.emptyTicketsSub}>Submit a new ticket if you have any questions.</Text>
              </View>
            )}
          </View>
        </View>

        {/* FAQs Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
              <Text style={styles.sectionSubtitle}>Quick answers to common questions</Text>
            </View>
          </View>

          {/* Search FAQ */}
          <View style={styles.faqSearchBar}>
            <Ionicons name="search-outline" size={16} color="#94A3B8" />
            <TextInput
              style={styles.faqSearchInput}
              placeholder="Search help articles & FAQs..."
              placeholderTextColor="#94A3B8"
              value={faqSearch}
              onChangeText={setFaqSearch}
            />
            {faqSearch.length > 0 && (
              <TouchableOpacity onPress={() => setFaqSearch("")}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Accordion List */}
          <View style={styles.faqList}>
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;

              return (
                <View key={faq.id} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.faqHeader}
                    onPress={() => toggleFaq(faq.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.faqQuestion, isExpanded && styles.faqQuestionActive]}>
                      {faq.question}
                    </Text>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={18}
                      color={isExpanded ? "#635BFF" : "#64748B"}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.faqBody}>
                      <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <CreateTicketModal
        visible={createTicketVisible}
        onClose={() => setCreateTicketVisible(false)}
        onSubmit={handleCreateTicket}
      />

      <TicketChatModal
        visible={!!activeTicket}
        onClose={() => setActiveTicket(null)}
        ticket={activeTicket}
        onSendMessage={handleSendMessage}
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
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  newTicketBtn: {
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
  newTicketBtnText: {
    fontSize: 12,
    fontFamily: "Manrope_700Bold",
    color: "#FFFFFF",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  contactBanner: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  bannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  bannerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    marginTop: 1,
  },
  channelsGrid: {
    gap: 10,
  },
  channelCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  channelIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  channelInfo: {
    flex: 1,
    gap: 2,
  },
  channelLabel: {
    fontSize: 10.5,
    fontFamily: "Manrope_700Bold",
    color: "#94A3B8",
    textTransform: "uppercase",
  },
  channelVal: {
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
    marginTop: 1,
  },
  submitTicketSmallBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  submitTicketSmallText: {
    fontSize: 11.5,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  tabsRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  tabPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  tabPillActive: {
    backgroundColor: "#635BFF",
  },
  tabPillText: {
    fontSize: 11.5,
    fontFamily: "Manrope_600SemiBold",
    color: "#64748B",
  },
  tabPillTextActive: {
    color: "#FFFFFF",
    fontFamily: "Manrope_700Bold",
  },
  ticketsList: {
    gap: 10,
  },
  ticketCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    gap: 8,
  },
  ticketCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ticketIdBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ticketIdText: {
    fontSize: 11,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  priorityBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  ticketDate: {
    marginLeft: "auto",
    fontSize: 10.5,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  ticketSubject: {
    fontSize: 13.5,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  ticketSnippet: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
    lineHeight: 16,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#64748B",
  },
  chatActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chatActionText: {
    fontSize: 11.5,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  emptyTickets: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    gap: 6,
  },
  emptyTicketsTitle: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  emptyTicketsSub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  faqSearchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 38,
    gap: 8,
  },
  faqSearchInput: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: "Manrope_500Medium",
    color: "#1E293B",
    paddingVertical: 0,
  },
  faqList: {
    gap: 8,
  },
  faqItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#F8FAFC",
  },
  faqQuestion: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
    paddingRight: 8,
  },
  faqQuestionActive: {
    color: "#635BFF",
  },
  faqBody: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#FFFFFF",
  },
  faqAnswer: {
    fontSize: 12.5,
    fontFamily: "Manrope_500Medium",
    color: "#475569",
    lineHeight: 18,
  },
});
