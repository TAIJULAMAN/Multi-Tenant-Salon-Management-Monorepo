import { Stack } from "expo-router";

export default function FilesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="folders/index" />
      <Stack.Screen name="folders/[id]" />
    </Stack>
  );
}
