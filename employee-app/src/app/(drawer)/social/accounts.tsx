import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomHeader from "@/components/ui/CustomHeader";
import { colors, radius } from "@/constants/figmaTheme";
import { SocialAccount } from "@/components/social/socialData";
import { PlatformIcon } from "@/components/social/SocialUI";
import { updateSocialAccounts, useSocialAccounts } from "@/components/social/useSocialAccounts";
import ConnectAccountModal from "@/components/social/modals/ConnectAccountModal";

/** Connected social accounts (adapted from salon-owner Social Accounts). */
export default function SocialAccountsScreen() {
  const insets = useSafeAreaInsets();
  const accounts = useSocialAccounts();
  const [selected, setSelected] = useState<SocialAccount | null>(null);

  const handleToggle = (account: SocialAccount) => {
    if (account.status === "Connected") {
      Alert.alert(`Disconnect ${account.name}`, `Are you sure you want to disconnect ${account.name}?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          style: "destructive",
          onPress: () =>
            updateSocialAccounts((prev) =>
              prev.map((a) => (a.id === account.id ? { ...a, status: "Not Connected" } : a)),
            ),
        },
      ]);
    } else {
      setSelected(account);
    }
  };

  const handleConnect = (accountId: string, handle: string) =>
    updateSocialAccounts((prev) =>
      prev.map((a) => (a.id === accountId ? { ...a, status: "Connected", handle } : a)),
    );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <CustomHeader title="Connected Accounts" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Social Media Accounts</Text>
          <Text style={styles.cardSub}>Connect your accounts to see analytics in the Social Media section.</Text>
          <View style={styles.list}>
            {accounts.map((acc) => {
              const isConnected = acc.status === "Connected";
              return (
                <View key={acc.id} style={styles.row}>
                  <View style={styles.rowLeft}>
                    <View style={styles.iconWrap}>
                      <PlatformIcon platform={acc.platform} size={20} brand />
                    </View>
                    <View style={styles.flex}>
                      <View style={styles.nameRow}>
                        <Text style={styles.name}>{acc.name}</Text>
                        <View style={[styles.status, isConnected ? styles.statusOn : styles.statusOff]}>
                          <Text style={[styles.statusText, isConnected ? styles.statusTextOn : styles.statusTextOff]}>
                            {acc.status}
                          </Text>
                        </View>
                      </View>
                      {isConnected && acc.handle ? <Text style={styles.handle}>{acc.handle}</Text> : null}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.actionBtn, isConnected ? styles.disconnectBtn : styles.connectBtn]}
                    onPress={() => handleToggle(acc)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.actionText, isConnected ? styles.disconnectText : styles.connectText]}>
                      {isConnected ? "Disconnect" : "Connect"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <ConnectAccountModal
        visible={!!selected}
        onClose={() => setSelected(null)}
        account={selected}
        onConnect={handleConnect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 6,
  },
  cardHeading: {
    fontSize: 15,
    fontFamily: "Manrope_700Bold",
    color: colors.text,
  },
  cardSub: {
    fontSize: 12,
    fontFamily: "Manrope_500Medium",
    color: colors.textMuted,
    marginBottom: 8,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  name: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: colors.text,
  },
  handle: {
    fontSize: 11.5,
    fontFamily: "Manrope_500Medium",
    color: colors.textMuted,
    marginTop: 2,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusOn: {
    backgroundColor: "#EBFAF0",
  },
  statusOff: {
    backgroundColor: colors.yellowSoft,
  },
  statusText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  statusTextOn: {
    color: colors.green,
  },
  statusTextOff: {
    color: "#B38A00",
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  connectBtn: {
    backgroundColor: colors.primarySoft,
  },
  disconnectBtn: {
    backgroundColor: colors.pinkSoft,
  },
  actionText: {
    fontSize: 11.5,
    fontFamily: "Manrope_700Bold",
  },
  connectText: {
    color: colors.primary,
  },
  disconnectText: {
    color: colors.pink,
  },
});
