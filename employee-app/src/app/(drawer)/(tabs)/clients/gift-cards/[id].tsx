import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import { GIFT_LABELS, useGiftCards } from "@/components/clients/clientsData";
import { EmptyState, InfoField, Label, TitleBar } from "@/components/clients/common";
import { GiftCardBack, GiftCardFront } from "@/components/clients/giftCards/GiftCardVisual";

/** View Gift Card — Figma 1:41750: "Gift Card Details" + "Preview" (front & back). */
export default function ViewGiftCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const cards = useGiftCards();
  const card = cards.find((c) => c.id === id);

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate("/(drawer)/(tabs)/clients" as never));

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) + 60 }]}
        showsVerticalScrollIndicator={false}
      >
        <TitleBar title="View Gift Card" onBack={goBack} onHome={() => router.navigate("/(drawer)/(tabs)/clients" as never)} />

        {!card ? (
          <View style={styles.card}>
            <EmptyState icon="gift-outline" text="Gift card not found" />
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Gift Card Details</Text>
              <View style={styles.grid}>
                <InfoField label="How many gift cards do you want to create?" value={String(card.quantity)} />
                <InfoField
                  label="Amount"
                  value={`${card.currency} ${card.amount}`}
                  right={card.hideAmount ? <Label label="Hidden" styleDef={GIFT_LABELS.Hidden} /> : undefined}
                />
                <InfoField label="Salon Name" value={card.salonName} />
                <InfoField label="Website" value={card.website} />
                <InfoField label="Address" value={card.address} full />
                <InfoField label="Date of Issue" value={card.issueDate} />
                <InfoField label="Date of Expiration" value={card.expirationDate} />
                <InfoField label="Usage Limit" value={card.usageLimit} full />
              </View>
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.label}>Eligible Services</Text>
                <View style={styles.servicesRow}>
                  {card.eligibleServices.map((s) => (
                    <Label key={s} label={s} styleDef={{ bg: colors.primarySoft, text: colors.primary }} />
                  ))}
                </View>
              </View>
              <View style={styles.grid}>
                <InfoField label="Receiver Name" value={card.receiverName} />
                <InfoField label="Gifter Name" value={card.gifterName} />
                <InfoField label="Personal Message" value={card.message} full />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Preview</Text>
              <View style={{ gap: 16 }}>
                <GiftCardFront
                  template={card.template}
                  amount={card.amount}
                  currency={card.currency}
                  hideAmount={card.hideAmount}
                  logo={card.logo}
                />
                <GiftCardBack
                  salonName={card.salonName}
                  address={card.address}
                  website={card.website}
                  gifterName={card.gifterName}
                  receiverName={card.receiverName}
                  message={card.message}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: 16,
    gap: 20,
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: -16,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginBottom: 8,
  },
  servicesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
