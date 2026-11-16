import { NativeTabs } from "expo-router/unstable-native-tabs";
import { usePathname } from "expo-router";

export default function TabLayout() {
  const pathname = usePathname();
  const isRootTab =
    pathname === "/" ||
    pathname === "/salaries" ||
    pathname === "/taxes" ||
    pathname === "/documents" ||
    pathname === "/finances";

  return (
    <NativeTabs
      backgroundColor="#ffffff"
      labelVisibilityMode="labeled"
      tintColor="#635BFF"
      iconColor={{ default: "#9CA3AF", selected: "#635BFF" }}
      labelStyle={{
        default: { color: "#9CA3AF", fontSize: 11 },
        selected: { color: "#635BFF", fontSize: 11 },
      }}
      indicatorColor={"#fff"}
      hidden={!isRootTab}
    >
      <NativeTabs.Trigger name="(dashboard)">
        <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" md="dashboard" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="salaries">
        <NativeTabs.Trigger.Label>Salaries</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="banknote" md="payments" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="taxes">
        <NativeTabs.Trigger.Label>Taxes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="doc.plaintext" md="receipt_long" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="documents">
        <NativeTabs.Trigger.Label>Documents</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="folder" md="description" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="finances">
        <NativeTabs.Trigger.Label>Finances</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.pie" md="pie_chart" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
