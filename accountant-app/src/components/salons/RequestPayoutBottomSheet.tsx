import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import CustomModal from "@/components/ui/CustomModal";
import CustomInput from "@/components/ui/CustomInput";
import CustomButton from "@/components/ui/CustomButton";
import { BankSettingsData } from "@/data/salonsData";

interface RequestPayoutBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  availableBalance: number;
  bankSettings: BankSettingsData;
  onSubmitPayout: (payout: {
    amount: string;
    invoiceNo: string;
    note: string;
  }) => void;
}

export default function RequestPayoutBottomSheet({
  visible,
  onClose,
  availableBalance,
  bankSettings,
  onSubmitPayout,
}: RequestPayoutBottomSheetProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [amount, setAmount] = useState(availableBalance.toString());
  const [invoiceFile, setInvoiceFile] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [payoutNotes, setPayoutNotes] = useState("");

  const handleReset = () => {
    setStep(1);
    setAmount(availableBalance.toString());
    setInvoiceFile(null);
    setPayoutNotes("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handlePickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (!res.canceled) {
        const asset = res.assets[0];
        const sizeInMb = asset.size ? asset.size / (1024 * 1024) : 0;
        const sizeStr = asset.size
          ? sizeInMb >= 1
            ? `${sizeInMb.toFixed(2)} MB`
            : `${(asset.size / 1024).toFixed(0)} KB`
          : "1.2 MB";

        setInvoiceFile({
          name: asset.name,
          size: sizeStr,
        });
      }
    } catch (err) {
      Alert.alert("Error", "Could not pick document.");
    }
  };

  const handleNext = () => {
    if (step === 1) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        Alert.alert("Invalid Amount", "Please enter a valid payout amount.");
        return;
      }
      if (parsedAmount > availableBalance) {
        Alert.alert(
          "Insufficient Balance",
          `Amount exceeds available balance of €${availableBalance}.`
        );
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!invoiceFile) {
        Alert.alert(
          "Invoice Required",
          "Please attach your professional fee invoice PDF before continuing."
        );
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      const newInvoiceNo = `PAYOUT-2026-${Date.now().toString().slice(-6)}`;
      onSubmitPayout({
        amount: `€ ${parseFloat(amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}`,
        invoiceNo: newInvoiceNo,
        note: payoutNotes || "Accountant referral settlement",
      });
      handleReset();
    }
  };

  return (
    <CustomModal
      visible={visible}
      onClose={handleClose}
      title={`Request Payout (Step ${step} of 4)`}
    >
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Step Indicator */}
        <View style={styles.stepIndicatorRow}>
          {[1, 2, 3, 4].map((s) => (
            <View key={s} style={styles.stepIndicatorItem}>
              <View
                style={[
                  styles.stepCircle,
                  step >= s ? styles.stepCircleActive : styles.stepCircleInactive,
                ]}
              >
                <Text
                  style={[
                    styles.stepCircleText,
                    step >= s ? styles.stepCircleTextActive : styles.stepCircleTextInactive,
                  ]}
                >
                  {s}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step >= s ? styles.stepLabelActive : styles.stepLabelInactive,
                ]}
              >
                {s === 1 ? "Amount" : s === 2 ? "Invoice" : s === 3 ? "Bank" : "Confirm"}
              </Text>
            </View>
          ))}
        </View>

        {/* STEP 1: Payout Amount */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.balanceInfoBox}>
              <Text style={styles.balanceInfoLabel}>Available for Withdrawal</Text>
              <Text style={styles.balanceInfoAmount}>
                €{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>

            <CustomInput
              label="Withdrawal Amount (€) *"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="e.g. 1500"
              iconName="cash-outline"
            />

            <TouchableOpacity
              style={styles.maxButton}
              onPress={() => setAmount(availableBalance.toString())}
              activeOpacity={0.7}
            >
              <Text style={styles.maxButtonText}>Use Max Available Balance</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: Invoice Upload */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionHeader}>Attach Professional Invoice *</Text>
            <Text style={styles.sectionSub}>
              Please attach an electronic invoice / receipt for €
              {parseFloat(amount || "0").toLocaleString()} addressed to the platform.
            </Text>

            {invoiceFile ? (
              <View style={styles.fileAttachedCard}>
                <Ionicons name="document-text" size={32} color="#635BFF" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {invoiceFile.name}
                  </Text>
                  <Text style={styles.fileSize}>{invoiceFile.size}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setInvoiceFile(null)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={handlePickDocument}
                activeOpacity={0.8}
              >
                <Ionicons name="cloud-upload-outline" size={36} color="#635BFF" />
                <Text style={styles.uploadBoxTitle}>Select PDF or Image Document</Text>
                <Text style={styles.uploadBoxSub}>Max file size: 10MB</Text>
              </TouchableOpacity>
            )}

            <CustomInput
              label="Invoice Reference / Notes (Optional)"
              value={payoutNotes}
              onChangeText={setPayoutNotes}
              placeholder="e.g. Q3 referral fee invoice"
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {/* STEP 3: Bank Details Confirmation */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionHeader}>Confirm Destination Account</Text>
            <View style={styles.bankCard}>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Bank Transfer Holder</Text>
                <Text style={styles.bankValue}>{bankSettings.bankHolder}</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>IBAN</Text>
                <Text style={styles.bankValueIban}>{bankSettings.iban}</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>VAT Number</Text>
                <Text style={styles.bankValue}>{bankSettings.vatNumber}</Text>
              </View>
              <View style={styles.bankRow}>
                <Text style={styles.bankLabel}>Address</Text>
                <Text style={styles.bankValue}>{bankSettings.address}</Text>
              </View>
            </View>

            <View style={styles.securityNotice}>
              <Ionicons name="lock-closed" size={16} color="#10B981" />
              <Text style={styles.securityText}>
                Transfer will be executed securely via SEPA directly to your registered bank account.
              </Text>
            </View>
          </View>
        )}

        {/* STEP 4: Summary & Submit */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Payout Request Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Requested Amount</Text>
                <Text style={styles.summaryAmount}>
                  €{parseFloat(amount || "0").toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Processing Fee</Text>
                <Text style={styles.summaryFree}>€0.00 (Free)</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated Settlement</Text>
                <Text style={styles.summaryValue}>1 - 2 Business Days</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Attached Invoice</Text>
                <Text style={styles.summaryValue} numberOfLines={1}>
                  {invoiceFile?.name || "Invoice.pdf"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.bottomButtonsRow}>
          {step > 1 ? (
            <CustomButton
              title="Back"
              onPress={() => setStep((s) => (s - 1) as any)}
              variant="outline"
              style={styles.actionBtn}
            />
          ) : (
            <CustomButton
              title="Cancel"
              onPress={handleClose}
              variant="ghost"
              style={styles.actionBtn}
            />
          )}

          <CustomButton
            title={step === 4 ? "Submit Request" : "Next"}
            onPress={handleNext}
            variant="primary"
            style={styles.actionBtn}
            icon={
              step === 4 ? (
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              ) : (
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              )
            }
            iconPosition="right"
          />
        </View>
      </ScrollView>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 520,
  },
  stepIndicatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  stepIndicatorItem: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  stepCircleActive: {
    backgroundColor: "#635BFF",
  },
  stepCircleInactive: {
    backgroundColor: "#E5E7EB",
  },
  stepCircleText: {
    fontSize: 11,
    fontWeight: "700",
  },
  stepCircleTextActive: {
    color: "#FFFFFF",
  },
  stepCircleTextInactive: {
    color: "#6B7280",
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: "600",
  },
  stepLabelActive: {
    color: "#635BFF",
  },
  stepLabelInactive: {
    color: "#9CA3AF",
  },
  stepContent: {
    marginBottom: 10,
  },
  balanceInfoBox: {
    backgroundColor: "#EEECFF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  balanceInfoLabel: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
    marginBottom: 2,
  },
  balanceInfoAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#635BFF",
  },
  maxButton: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 16,
  },
  maxButtonText: {
    fontSize: 12,
    color: "#635BFF",
    fontWeight: "700",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#635BFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#FAF9FF",
  },
  uploadBoxTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#635BFF",
    marginTop: 8,
  },
  uploadBoxSub: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  fileAttachedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEECFF",
    borderRadius: 12,
    padding: 12,
  },
  fileName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
  },
  fileSize: {
    fontSize: 11,
    color: "#6B7280",
  },
  bankCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 12,
  },
  bankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  bankLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  bankValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  bankValueIban: {
    fontSize: 11,
    fontWeight: "700",
    color: "#635BFF",
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    padding: 10,
    gap: 8,
  },
  securityText: {
    fontSize: 11,
    color: "#065F46",
    flex: 1,
  },
  summaryCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#635BFF",
  },
  summaryFree: {
    fontSize: 12,
    fontWeight: "700",
    color: "#10B981",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
  },
  bottomButtonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    marginBottom: 4,
  },
  actionBtn: {
    flex: 1,
  },
});
