import { COLORS } from "@/constants/theme";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
        }}
      />
    </Tabs>
  );
}