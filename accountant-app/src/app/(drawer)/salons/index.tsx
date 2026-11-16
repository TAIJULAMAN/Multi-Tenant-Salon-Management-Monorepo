import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";

// Mock Data & Types
import {
  INITIAL_SALONS_DATA,
  INITIAL_SENT_INVITATIONS,
  INITIAL_RECEIVED_INVITATIONS,
  REVENUE_CARDS_DATA,
  BREAKDOWN_DATA,
  TRANSACTIONS_DATA,
  INITIAL_PAYOUTS_DATA,
  INITIAL_BANK_SETTINGS,
  SalonInfo,
  SentInvitation,
  ReceivedInvitation,
  PayoutData,
  BankSettingsData,
} from "@/data/salonsData";

// Components
import SalonsHeaderTabs, {
  MainSalonSection,
  MySalonsSubTab,
} from "@/components/salons/SalonsHeaderTabs";
import MySalonsList from "@/components/salons/MySalonsList";
import InvitationsSentList from "@/components/salons/InvitationsSentList";
import RevenueShareView from "@/components/salons/RevenueShareView";
import PayoutsView from "@/components/salons/PayoutsView";
import SalonSettingsView from "@/components/salons/SalonSettingsView";
import PendingInvitationsView from "@/components/salons/PendingInvitationsView";
import RequestAccessView from "@/components/salons/RequestAccessView";

// Modals
import ViewSalonBottomSheet from "@/components/salons/ViewSalonBottomSheet";
import InviteSalonBottomSheet from "@/components/salons/InviteSalonBottomSheet";
import RequestPayoutBottomSheet from "@/components/salons/RequestPayoutBottomSheet";

export default function SalonsScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  // Navigation Tabs State
  const [activeSection, setActiveSection] = useState<MainSalonSection>("MySalons");
  const [activeSubTab, setActiveSubTab] = useState<MySalonsSubTab>("MySalons");

  // Data State
  const [salonsList, setSalonsList] = useState<SalonInfo[]>(INITIAL_SALONS_DATA);
  const [sentInvitations, setSentInvitations] = useState<SentInvitation[]>(INITIAL_SENT_INVITATIONS);
  const [receivedInvitations, setReceivedInvitations] = useState<ReceivedInvitation[]>(INITIAL_RECEIVED_INVITATIONS);
  const [payoutsList, setPayoutsList] = useState<PayoutData[]>(INITIAL_PAYOUTS_DATA);
  const [bankSettings, setBankSettings] = useState<BankSettingsData>(INITIAL_BANK_SETTINGS);
  const [availableBalance, setAvailableBalance] = useState<number>(1500);

  // Modals State
  const [selectedSalon, setSelectedSalon] = useState<SalonInfo | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRequestPayoutModal, setShowRequestPayoutModal] = useState(false);

  // Handlers
  const handleSelectSalon = (salon: SalonInfo) => {
    router.push({
      pathname: "/(drawer)/salons/view-salon" as any,
      params: {
        id: salon.id,
        name: salon.name,
        badge: salon.badge,
        ownerName: salon.ownerName,
        city: salon.city,
        email: salon.email,
        plan: salon.plan,
        planPrice: salon.planPrice,
        paymentStatus: salon.paymentStatus,
        nextRenewal: salon.nextRenewal,
        referral: salon.referral,
      },
    });
  };

  const handleInviteSuccess = (data: {
    salonName: string;
    email: string;
    plan: string;
    share: string;
  }) => {
    setShowInviteModal(false);

    const newSent: SentInvitation = {
      id: `inv_${Date.now()}`,
      salonName: data.salonName,
      email: data.email,
      date: "Just now",
      status: "Pending",
      plan: data.plan,
      planDetails: `Annual • €${data.plan === "Enterprise" ? "3,000" : data.plan === "Premium" ? "2,000" : "1,000"}.00 /yr`,
      share: data.share,
      lastShare: "-",
    };

    setSentInvitations([newSent, ...sentInvitations]);
    Alert.alert(
      "Invitation Sent!",
      `An accountant link invitation has been successfully sent to ${data.email} with ${data.share} referral commission rate.`,
      [
        {
          text: "View Sent Invitations",
          onPress: () => {
            setActiveSection("MySalons");
            setActiveSubTab("InvitationsSent");
          },
        },
        { text: "OK" },
      ]
    );
  };

  const handleResendSent = (id: string) => {
    Alert.alert("Invitation Resent", "A reminder email was sent to the salon owner.");
  };

  const handleRevokeSent = (id: string) => {
    setSentInvitations((prev) => prev.filter((i) => i.id !== id));
    Alert.alert("Invitation Revoked", "The invitation has been cancelled.");
  };

  const handleAcceptReceived = (id: string) => {
    const inv = receivedInvitations.find((i) => i.id === id);
    if (!inv) return;

    // Add to My Salons list
    const newSalon: SalonInfo = {
      id: `salon_${Date.now()}`,
      name: inv.salonName,
      badge: "SRL",
      ownerName: inv.senderName,
      city: "Milano",
      email: inv.senderEmail || "owner@salon.it",
      plan: "Premium",
      planPrice: "Annual • €2,000.00 / yr",
      paymentStatus: "In order",
      nextRenewal: "Aug 2027",
      referral: "30%",
    };

    setSalonsList([newSalon, ...salonsList]);
    setReceivedInvitations((prev) => prev.filter((i) => i.id !== id));

    Alert.alert(
      "Connected Successfully!",
      `You are now connected with ${inv.salonName} as their accountant. The salon has been added to My Salons.`,
      [
        {
          text: "View My Salons",
          onPress: () => {
            setActiveSection("MySalons");
            setActiveSubTab("MySalons");
          },
        },
        { text: "OK" },
      ]
    );
  };

  const handleDeclineReceived = (id: string) => {
    setReceivedInvitations((prev) => prev.filter((i) => i.id !== id));
    Alert.alert("Invitation Declined", "The request has been removed.");
  };

  const handleSubmitPayout = (payout: {
    amount: string;
    invoiceNo: string;
    note: string;
  }) => {
    setShowRequestPayoutModal(false);

    const newPayout: PayoutData = {
      id: `pay_${Date.now()}`,
      requestDate: "Just now",
      amount: payout.amount,
      invoiceNo: payout.invoiceNo,
      status: "Pending",
      paymentDate: "Est. 2 - 3 days",
      note: payout.note,
    };

    setPayoutsList([newPayout, ...payoutsList]);
    setAvailableBalance(0);

    Alert.alert(
      "Payout Request Submitted!",
      `Your payout request ${payout.invoiceNo} for ${payout.amount} has been queued for bank transfer processing.`
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.drawerToggle}
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
          >
            <Ionicons name="menu-outline" size={26} color="#1F2937" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerSubtitle}>Accountant Portal</Text>
            <Text style={styles.headerTitle}>Salons & Invitations</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => router.push("/notifications" as any)}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color="#1F2937" />
          {receivedInvitations.length > 0 && <View style={styles.notifDot} />}
        </TouchableOpacity>
      </View>

      {/* Header Navigation Tabs */}
      <SalonsHeaderTabs
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        activeSubTab={activeSubTab}
        onSelectSubTab={setActiveSubTab}
        pendingCount={receivedInvitations.length}
      />

      {/* Scrollable View Content */}
      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* MAIN SECTION 1: My Salons */}
        {activeSection === "MySalons" && (
          <>
            {activeSubTab === "MySalons" && (
              <MySalonsList
                salons={salonsList}
                onSelectSalon={handleSelectSalon}
                onOpenInviteModal={() => setShowInviteModal(true)}
              />
            )}

            {activeSubTab === "InvitationsSent" && (
              <InvitationsSentList
                invitations={sentInvitations}
                onResend={handleResendSent}
                onRevoke={handleRevokeSent}
              />
            )}

            {activeSubTab === "RevenueShare" && (
              <RevenueShareView
                revenueCards={REVENUE_CARDS_DATA}
                breakdowns={BREAKDOWN_DATA}
                transactions={TRANSACTIONS_DATA}
                onNavigateToPayouts={() => setActiveSubTab("Payouts")}
              />
            )}

            {activeSubTab === "Payouts" && (
              <PayoutsView
                payouts={payoutsList}
                availableBalance={availableBalance}
                onOpenRequestModal={() => setShowRequestPayoutModal(true)}
              />
            )}

            {activeSubTab === "Settings" && (
              <SalonSettingsView
                initialSettings={bankSettings}
                onSaveSettings={setBankSettings}
              />
            )}
          </>
        )}

        {/* MAIN SECTION 2: Pending Invitations */}
        {activeSection === "PendingInvitations" && (
          <PendingInvitationsView
            invitations={receivedInvitations}
            onAccept={handleAcceptReceived}
            onDecline={handleDeclineReceived}
          />
        )}

        {/* MAIN SECTION 3: Request Access */}
        {activeSection === "RequestAccess" && (
          <RequestAccessView
            onSubmitSuccess={() => {
              setActiveSection("MySalons");
              setActiveSubTab("InvitationsSent");
            }}
          />
        )}
      </ScrollView>

      {/* View Salon Details Modal */}
      <ViewSalonBottomSheet
        visible={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedSalon(null);
        }}
        salon={selectedSalon}
      />

      {/* Invite Salon Wizard Modal */}
      <InviteSalonBottomSheet
        visible={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={handleInviteSuccess}
      />

      {/* Request Payout Wizard Modal */}
      <RequestPayoutBottomSheet
        visible={showRequestPayoutModal}
        onClose={() => setShowRequestPayoutModal(false)}
        availableBalance={availableBalance}
        bankSettings={bankSettings}
        onSubmitPayout={handleSubmitPayout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  drawerToggle: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
  },
  headerSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#635BFF",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
