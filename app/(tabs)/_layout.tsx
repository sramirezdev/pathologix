import { Tabs } from "expo-router";
import { colors } from "../../src/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: () => null }} />
      <Tabs.Screen name="play" options={{ title: "Jugar", tabBarIcon: () => null }} />
      <Tabs.Screen name="ranking" options={{ title: "Ranking", tabBarIcon: () => null }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil", tabBarIcon: () => null }} />
    </Tabs>
  );
}
