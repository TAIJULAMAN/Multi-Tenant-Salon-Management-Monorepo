import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "@/components/Header";
import CustomSwitch from "@/components/ui/CustomSwitch";
import DatePickerInput from "@/components/ui/DatePickerInput";
import { colors, fonts, radius, shadows } from "@/constants/figmaTheme";
import {
  GiftCard,
  GiftCardLogo,
  GiftCardTemplate,
  SERVICE_OPTIONS,
  createGiftCardDraft,
  giftCardsStore,
} from "@/components/clients/clientsData";
import { BrandMark, GiftCardBack, GiftCardFront } from "@/components/clients/giftCards/GiftCardVisual";
import {
  CompactDropdown,
  FormInput,
  FormLabel,
  PrimaryButton,
  SoftButton,
  TitleBar,
  UploadDropzone,
  shared,
} from "@/components/clients/common";
import { pickFile } from "@/components/clients/pickFile";

const LOGOS: { id: GiftCardLogo; label: string }[] = [
  { id: "none", label: "No Logo" },
  { id: "main", label: "Main Logo" },
  { id: "alternative", label: "Alternative Logo" },
  { id: "minimal", label: "Minimal Logo" },
];

const TEMPLATE_DESC = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.";
const TEMPLATES: GiftCardTemplate[] = [1, 2];

/** Add / Edit Gift Card — Figma 1:42016 (Basic Details + template) → 1:42455 (branding, details, live preview). */
export default function AddGiftCardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, clientId } = useLocalSearchParams<{ id?: string; clientId?: string }>();
  const existing = id ? giftCardsStore.getById(id) : undefined;
  const isEdit = !!existing;

  const [step, setStep] = useState<1 | 2>(1);
  const [card, setCard] = useState<GiftCard>(() => existing ?? { ...createGiftCardDraft(), clientId });
  const [amountText, setAmountText] = useState(existing ? String(existing.amount) : "");
  const [quantityText, setQuantityText] = useState(String(existing?.quantity ?? 1));
  const [customTemplate, setCustomTemplate] = useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  const set = <K extends keyof GiftCard>(key: K, value: GiftCard[K]) => setCard((c) => ({ ...c, [key]: value }));

  const toggleService = (s: string) =>
    set(
      "eligibleServices",
      card.eligibleServices.includes(s) ? card.eligibleServices.filter((x) => x !== s) : [...card.eligibleServices, s]
    );

  const servicesLabel =
    card.eligibleServices.length === 0 || card.eligibleServices.length === SERVICE_OPTIONS.length
      ? "All Services"
      : card.eligibleServices.join(", ");

  const handleNext = () => {
    const amount = parseFloat(amountText);
    if (!(parseInt(quantityText, 10) > 0)) {
      Alert.alert("Required", "Please enter how many gift cards you want to create.");
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Required", "Please enter the gift card amount.");
      return;
    }
    setCard((c) => ({ ...c, amount, quantity: parseInt(quantityText, 10) }));
    setStep(2);
  };

  const handleSave = () => {
    const missing = [
      ["Salon Name", card.salonName],
      ["Website", card.website],
      ["Address", card.address],
      ["Date of Issue", card.issueDate],
      ["Date of Expiration", card.expirationDate],
      ["Usage Limit", card.usageLimit],
      ["Receiver Name", card.receiverName],
    ].find(([, v]) => !String(v).trim());
    if (missing) {
      Alert.alert("Required", `Please enter the ${missing[0]}.`);
      return;
    }
    const saved = {
      ...card,
      eligibleServices: card.eligibleServices.length ? card.eligibleServices : [...SERVICE_OPTIONS],
    };
    if (isEdit) giftCardsStore.update(saved.id, saved);
    else giftCardsStore.add(saved);
    Alert.alert(isEdit ? "Gift Card Updated" : "Gift Card Created", `Gift card ${saved.code} saved successfully.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const goBack = () => (step === 2 ? setStep(1) : router.canGoBack() ? router.back() : router.navigate("/(drawer)/(tabs)/clients" as never));

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) + 60 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TitleBar
          title={isEdit ? "Edit Gift Card" : "Add Gift Card"}
          onBack={goBack}
          onHome={() => router.navigate("/(drawer)/(tabs)/clients" as never)}
        />

        {step === 1 ? (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Basic Details</Text>
              <FormInput
                label="How many gift cards do you want to create?"
                required
                keyboardType="number-pad"
                value={quantityText}
                onChangeText={setQuantityText}
                placeholder="1"
                containerStyle={{ marginBottom: 0 }}
              />
              <View>
                <View style={styles.amountHeader}>
                  <FormLabel label="Amount" required />
                  <View style={styles.hideRow}>
                    <CustomSwitch value={card.hideAmount} onValueChange={(v) => set("hideAmount", v)} />
                    <Text style={styles.hideText}>Hide amount</Text>
                  </View>
                </View>
                <View style={styles.amountRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter amount"
                    placeholderTextColor={colors.text}
                    keyboardType="numeric"
                    value={amountText}
                    onChangeText={setAmountText}
                  />
                  <CompactDropdown
                    value={card.currency}
                    options={["€", "$", "£"]}
                    onChange={(v) => set("currency", v)}
                    style={{ width: 76 }}
                  />
                </View>
              </View>

              <Text style={shared.formLabel}>Select Template</Text>
              {TEMPLATES.map((t) => {
                const active = card.template === t && !customTemplate;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.templateCard, active && styles.templateActive]}
                    onPress={() => {
                      setCustomTemplate(null);
                      set("template", t);
                    }}
                    activeOpacity={0.85}
                    accessibilityState={{ selected: active }}
                  >
                    <GiftCardFront template={t} amount={amountText || 200} currency={card.currency} hideAmount={card.hideAmount} />
                    <Text style={styles.templateName}>Template Name</Text>
                    <Text style={styles.templateDesc}>{TEMPLATE_DESC}</Text>
                  </TouchableOpacity>
                );
              })}
              <View style={[styles.templateCard, customTemplate ? styles.templateActive : null]}>
                <UploadDropzone
                  title={customTemplate ?? "Upload Custom Gift Card"}
                  style={styles.customUpload}
                  onPress={async () => {
                    const f = await pickFile(["image/*", "application/pdf"]);
                    if (f) setCustomTemplate(f.name);
                  }}
                />
              </View>
            </View>

            <View style={styles.footerRow}>
              <PrimaryButton label="Next" onPress={handleNext} />
            </View>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Logo and Branding</Text>
              <Text style={[shared.formLabel, { marginBottom: 0 }]}>Choose Logo</Text>
              <View style={styles.logoGrid}>
                {LOGOS.map((l) => {
                  const active = card.logo === l.id;
                  return (
                    <TouchableOpacity
                      key={l.id}
                      style={[styles.logoCard, active && styles.logoCardActive]}
                      onPress={() => set("logo", l.id)}
                      activeOpacity={0.75}
                      accessibilityState={{ selected: active }}
                    >
                      {l.id === "none" ? (
                        <Ionicons name="ban-outline" size={28} color={colors.primary} />
                      ) : (
                        <BrandMark logo={l.id} size={16} />
                      )}
                      <Text style={[styles.logoLabel, l.id === "none" && { fontFamily: fonts.semibold }]}>{l.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.colorsRow}>
                <Text style={[shared.formLabel, { marginBottom: 0 }]}>Template Colors</Text>
                <SoftButton
                  label="Customize Logo"
                  icon="color-palette-outline"
                  small
                  onPress={() => Alert.alert("Customize Logo", "Logo and color customization coming soon.")}
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Gift Card Details</Text>
              <View>
                <View style={shared.row}>
                  <View style={shared.col}>
                    <FormInput label="Salon Name" required placeholder="Enter salon name" value={card.salonName} onChangeText={(v) => set("salonName", v)} />
                  </View>
                  <View style={shared.col}>
                    <FormInput
                      label="Website"
                      required
                      placeholder="Enter website"
                      autoCapitalize="none"
                      value={card.website}
                      onChangeText={(v) => set("website", v)}
                    />
                  </View>
                </View>
                <FormInput label="Address" required placeholder="Enter address" value={card.address} onChangeText={(v) => set("address", v)} />
                <View style={shared.row}>
                  <View style={shared.col}>
                    <DatePickerInput label="Date of Issue" required placeholder="Enter date" value={card.issueDate} onChange={(v) => set("issueDate", v)} />
                  </View>
                  <View style={shared.col}>
                    <DatePickerInput
                      label="Date of Expiration"
                      required
                      placeholder="Enter date"
                      value={card.expirationDate}
                      onChange={(v) => set("expirationDate", v)}
                    />
                  </View>
                </View>
                <View style={shared.row}>
                  <View style={shared.col}>
                    <FormInput
                      label="Usage Limit"
                      required
                      placeholder="Enter limit"
                      keyboardType="number-pad"
                      value={card.usageLimit}
                      onChangeText={(v) => set("usageLimit", v)}
                    />
                  </View>
                  <View style={shared.col}>
                    <FormLabel label="Eligible Services" required />
                    <TouchableOpacity style={styles.selectBox} onPress={() => setServicesOpen((o) => !o)} activeOpacity={0.75}>
                      <Text style={styles.selectText} numberOfLines={1}>
                        {servicesLabel}
                      </Text>
                      <Ionicons name={servicesOpen ? "chevron-up" : "chevron-down"} size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </View>
                {servicesOpen && (
                  <View style={styles.servicesList}>
                    {SERVICE_OPTIONS.map((s) => {
                      const active = card.eligibleServices.includes(s);
                      return (
                        <TouchableOpacity key={s} style={styles.serviceItem} onPress={() => toggleService(s)}>
                          <Ionicons name={active ? "checkbox" : "square-outline"} size={20} color={active ? colors.primary : colors.textMuted} />
                          <Text style={styles.serviceText}>{s}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                <View style={shared.row}>
                  <View style={shared.col}>
                    <FormInput
                      label="Receiver Name"
                      required
                      placeholder="Enter receiver name"
                      value={card.receiverName}
                      onChangeText={(v) => set("receiverName", v)}
                    />
                  </View>
                  <View style={shared.col}>
                    <FormInput
                      label="Gifter Name (optional)"
                      placeholder="Enter gifter name"
                      value={card.gifterName}
                      onChangeText={(v) => set("gifterName", v)}
                    />
                  </View>
                </View>
                <FormInput
                  label="Personal Message (Optional)"
                  multiline
                  placeholder="Enter a description"
                  value={card.message}
                  onChangeText={(v) => set("message", v)}
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Live Preview</Text>
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

            <View style={styles.footerRow}>
              <PrimaryButton label="Save" onPress={handleSave} />
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
    gap: 16,
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
  },
  amountHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hideRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  hideText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  amountRow: {
    flexDirection: "row",
    gap: 8,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
    backgroundColor: colors.white,
  },
  templateCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 6,
  },
  templateActive: {
    borderColor: colors.primary,
  },
  templateName: {
    fontSize: 18,
    lineHeight: 25,
    fontFamily: fonts.medium,
    color: colors.text,
    marginTop: 14,
  },
  templateDesc: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  customUpload: {
    marginBottom: 0,
    paddingVertical: 48,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  logoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  logoCard: {
    width: "48.4%",
    height: 112,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.subtleAlt,
    backgroundColor: colors.subtleAlt,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoCardActive: {
    borderColor: colors.primary,
  },
  logoLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  colorsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  servicesList: {
    borderRadius: radius.md,
    paddingVertical: 6,
    marginTop: -8,
    marginBottom: 16,
    backgroundColor: colors.white,
    ...shadows.overlay,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  serviceText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text,
  },
});
