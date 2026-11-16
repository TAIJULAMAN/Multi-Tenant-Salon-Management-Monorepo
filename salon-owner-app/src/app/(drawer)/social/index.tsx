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
import { useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  SocialAccount,
  INITIAL_SOCIAL_ACCOUNTS,
} from "@/components/social/socialData";
import ConnectAccountModal from "@/components/social/modals/ConnectAccountModal";

export default function SocialHomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_SOCIAL_ACCOUNTS);
  const [selectedAccount, setSelectedAccount] = useState<SocialAccount | null>(null);
  const [connectModalVisible, setConnectModalVisible] = useState(false);

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  const handleToggleAccount = (account: SocialAccount) => {
    if (account.status === "Connected") {
      Alert.alert(
        `Disconnect ${account.name}`,
        `Are you sure you want to disconnect ${account.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disconnect",
            style: "destructive",
            onPress: () => {
              setAccounts((prev) =>
                prev.map((acc) =>
                  acc.id === account.id
                    ? { ...acc, status: "Not Connected" }
                    : acc
                )
              );
            },
          },
        ]
      );
    } else {
      setSelectedAccount(account);
      setConnectModalVisible(true);
    }
  };

  const handleConnectConfirm = (accountId: string, handle: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? {
              ...acc,
              status: "Connected",
              handle,
            }
          : acc
      )
    );
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.drawerBtn} onPress={handleOpenDrawer} activeOpacity={0.7}>
          <Ionicons name="menu-outline" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Social Accounts</Text>
          <Text style={styles.headerSubtitle}>Connected channels & integrations</Text>
        </View>
      </View>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Social Media Accounts Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Social Media Accounts</Text>

          <View style={styles.accountsGrid}>
            {accounts.map((acc) => {
              const isConnected = acc.status === "Connected";

              return (
                <View key={acc.id} style={styles.accountRowCard}>
                  <View style={styles.accountLeft}>
                    {/* Platform Icon */}
                    <View style={styles.iconWrap}>
                      {acc.platform === "x" ? (
                        <Text style={styles.xLogo}>𝕏</Text>
                      ) : (
                        <Ionicons
                          name={acc.iconName as any}
                          size={20}
                          color={acc.brandColor}
                        />
                      )}
                    </View>

                    {/* Platform Name & Status Badge */}
                    <View style={styles.nameRow}>
                      <Text style={styles.accountName}>{acc.name}</Text>
                      <View
                        style={[
                          styles.statusBadge,
                          isConnected ? styles.statusBadgeConnected : styles.statusBadgeDisconnected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            isConnected ? styles.statusTextConnected : styles.statusTextDisconnected,
                          ]}
                        >
                          {acc.status}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Connect / Disconnect Button */}
                  <TouchableOpacity
                    style={[
                      styles.actionBtn,
                      isConnected ? styles.disconnectBtn : styles.connectBtn,
                    ]}
                    onPress={() => handleToggleAccount(acc)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.actionBtnText,
                        isConnected ? styles.disconnectBtnText : styles.connectBtnText,
                      ]}
                    >
                      {isConnected ? "Disconnect" : "Connect"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Connect Account Modal */}
      <ConnectAccountModal
        visible={connectModalVisible}
        onClose={() => {
          setConnectModalVisible(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
        onConnect={handleConnectConfirm}
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
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: "Manrope_500Medium",
    color: "#94A3B8",
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeading: {
    fontSize: 15,
    fontFamily: "Manrope_800ExtraBold",
    color: "#1E293B",
  },
  accountsGrid: {
    gap: 10,
  },
  accountRowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  accountLeft: {
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
  xLogo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  accountName: {
    fontSize: 14,
    fontFamily: "Manrope_700Bold",
    color: "#1E293B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeConnected: {
    backgroundColor: "#DCFCE7",
  },
  statusBadgeDisconnected: {
    backgroundColor: "#FEF9C3",
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: "Manrope_700Bold",
  },
  statusTextConnected: {
    color: "#16A34A",
  },
  statusTextDisconnected: {
    color: "#CA8A04",
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  connectBtn: {
    backgroundColor: "#E0E7FF",
  },
  connectBtnText: {
    fontSize: 11.5,
    fontFamily: "Manrope_700Bold",
    color: "#635BFF",
  },
  disconnectBtn: {
    backgroundColor: "#FFE4E6",
  },
  disconnectBtnText: {
    fontSize: 11.5,
    fontFamily: "Manrope_700Bold",
    color: "#FF4C6A",
  },
  actionBtnText: {
    fontSize: 11.5,
  },
});
