import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { CLIENT_TAG_STYLES, COVER_IMAGE, fullName, useClient } from "@/components/clients/clientsData";
import { Label, PrimaryButton, TitleBar } from "@/components/clients/common";
import BasicDataTab from "@/components/clients/details/BasicDataTab";
import AppointmentsTab from "@/components/clients/details/AppointmentsTab";
import FinancialTab from "@/components/clients/details/FinancialTab";
import NotesTab from "@/components/clients/details/NotesTab";
import MedicalTab from "@/components/clients/details/MedicalTab";
import CommunicationLogTab from "@/components/clients/details/CommunicationLogTab";
import ClientFormModal, { ClientFormMode } from "@/components/clients/modals/ClientFormModal";

/**
 * Client details — Figma 1:35745 (Basic Data), 1:37130 (Appointments), 1:38171 (Financial Information),
 * 1:39232 (Notes & Attachments), 1:39485 (Medical), 1:39631 (Communication Log).
 */
const TABS: { id: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "Basic Data", icon: "reader-outline" },
  { id: "Appointments", icon: "calendar-clear-outline" },
  { id: "Financial Information", icon: "wallet-outline" },
  { id: "Notes & Attachments", icon: "reorder-three-outline" },
  { id: "Medical", icon: "medkit-outline" },
  { id: "Communication Log", icon: "chatbubbles-outline" },
];

export default function ClientDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useClient(id);

  const [activeTab, setActiveTab] = useState("Basic Data");
  const [formMode, setFormMode] = useState<ClientFormMode | null>(null);

  const name = fullName(client);
  const goBack = () => (router.canGoBack() ? router.back() : router.navigate("/(drawer)/(tabs)/clients" as never));
  const bookNow = () => router.push("/(drawer)/(tabs)/calendar/add" as never);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) + 80 }]}
        keyboardShouldPersistTaps="handled"
      >
        <TitleBar
          title={name}
          onBack={goBack}
          onHome={() => router.navigate("/(drawer)/(tabs)/clients" as never)}
        />

        {/* Profile ("user heading") */}
        <View style={styles.profileCard}>
          <Image source={{ uri: COVER_IMAGE }} style={styles.cover} />
          <View style={styles.profileBody}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: client.avatar }} style={styles.avatar} />
            </View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.location}>{client.location}</Text>
            {client.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {client.tags.map((t) => (
                  <Label key={t} label={t} styleDef={CLIENT_TAG_STYLES[t] ?? { bg: colors.primarySoft, text: colors.primary }} />
                ))}
              </View>
            )}

            <View style={styles.activityRow}>
              <View style={styles.activityItem}>
                <Ionicons name="calendar-clear-outline" size={24} color={colors.text} />
                <Text style={styles.activityValue}>{client.createdAtLabel}</Text>
                <Text style={styles.activityLabel}>Created At</Text>
              </View>
              <View style={styles.activityItem}>
                <Text style={styles.hash}>#</Text>
                <Text style={styles.activityValue}>{client.clientCode}</Text>
                <Text style={styles.activityLabel}>Client ID</Text>
              </View>
            </View>

            <PrimaryButton label="Book Now" onPress={bookNow} style={styles.bookBtn} />
          </View>

          {/* "activity links" tab bar */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsBar} contentContainerStyle={styles.tabsContent}>
            {TABS.map((t) => {
              const active = t.id === activeTab;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.tabBtn, active && styles.tabBtnActive]}
                  onPress={() => setActiveTab(t.id)}
                  activeOpacity={0.7}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Ionicons name={t.icon} size={20} color={active ? colors.primary : colors.text} />
                  <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.id}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {activeTab === "Basic Data" && (
          <BasicDataTab
            client={client}
            onEditPersonal={() => setFormMode("edit")}
            onEditAddress={() => setFormMode("address")}
          />
        )}
        {activeTab === "Appointments" && <AppointmentsTab />}
        {activeTab === "Financial Information" && <FinancialTab clientId={client.id} />}
        {activeTab === "Notes & Attachments" && <NotesTab />}
        {activeTab === "Medical" && <MedicalTab client={client} />}
        {activeTab === "Communication Log" && <CommunicationLogTab />}
      </ScrollView>

      <ClientFormModal
        visible={formMode !== null}
        mode={formMode ?? "edit"}
        client={client}
        onClose={() => setFormMode(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    overflow: "hidden",
    ...shadows.card,
  },
  cover: {
    width: "100%",
    height: 150,
    backgroundColor: colors.primarySoft,
  },
  profileBody: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  avatarWrap: {
    marginTop: -50,
    padding: 3,
    borderRadius: 52,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.pinkSoft,
  },
  name: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
    marginTop: 8,
  },
  location: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  activityRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginTop: 20,
  },
  activityItem: {
    alignItems: "center",
    gap: 2,
  },
  hash: {
    fontSize: 24,
    lineHeight: 26,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  activityValue: {
    fontSize: 20,
    lineHeight: 27,
    fontFamily: fonts.semibold,
    color: colors.text,
    marginTop: 4,
  },
  activityLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  bookBtn: {
    alignSelf: "stretch",
    height: 44,
    marginTop: 20,
  },
  tabsBar: {
    backgroundColor: colors.primarySoft,
  },
  tabsContent: {
    paddingHorizontal: 8,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 48,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  tabTextActive: {
    color: colors.primary,
  },
});
