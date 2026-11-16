import { Stack } from "expo-router";

export default function WaiversLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="sign" />
      <Stack.Screen name="invitation" />
    </Stack>
  );
}
