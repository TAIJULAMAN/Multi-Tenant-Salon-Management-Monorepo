import { Stack } from "expo-router";

export default function FinanceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/receipt" />
      <Stack.Screen name="automations" />
      <Stack.Screen name="import" />
      <Stack.Screen name="gift-cards/add" />
      <Stack.Screen name="checkout" />
    </Stack>
  );
}
