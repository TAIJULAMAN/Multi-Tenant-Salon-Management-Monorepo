import { NativeTabs } from "expo-router/unstable-native-tabs";
import { usePathname } from "expo-router";

export default function TabLayout() {
  const pathname = usePathname();
  const isRootTab =
    pathname === "/" ||
    pathname === "/calendar" ||
    pathname === "/clients" ||
    pathname === "/shifts" ||
    pathname === "/statistics";

  return (
    <NativeTabs
      backgroundColor="#ffffff"
      labelVisibilityMode="labeled"
      tintColor="#5C55FF"
      iconColor={{ default: "#9CA3AF", selected: "#5C55FF" }}
      labelStyle={{
        default: { color: "#9CA3AF", fontSize: 11 },
        selected: { color: "#5C55FF", fontSize: 11 }
      }}
      indicatorColor={"#fff"}
      hidden={!isRootTab}
    >
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2" md="dashboard" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendar" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Appointments</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_today" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="clients" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Clients</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.2" md="people" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="shifts" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Shifts</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="clock" md="schedule" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="statistics">
        <NativeTabs.Trigger.Label>Statistics</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.line.uptrend.xyaxis" md="trending_up" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
