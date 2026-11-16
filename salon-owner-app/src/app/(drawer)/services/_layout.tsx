import { Stack } from "expo-router";

export default function ServicesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="edit/[id]" />
      <Stack.Screen name="categories/index" />
      <Stack.Screen name="bundles/index" />
      <Stack.Screen name="bundles/add" />
      <Stack.Screen name="bundles/[id]" />
      <Stack.Screen name="import" />
    </Stack>
  );
}
