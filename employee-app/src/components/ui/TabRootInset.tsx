import React from "react";
import { SafeAreaView } from "react-native-screens/experimental";

/**
 * Bottom inset for the root screen of a tab that sets `disableAutomaticContentInsets`.
 *
 * On Android, NativeTabs keeps reserving the tab bar's height even while the bar is
 * hidden, which left a white strip under every pushed screen. Those tabs opt out of the
 * automatic inset, so their root screen (where the bar is visible) applies it here.
 */
export default function TabRootInset({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView collapsable={false} style={{ flex: 1 }} edges={{ bottom: true }}>
      {children}
    </SafeAreaView>
  );
}
