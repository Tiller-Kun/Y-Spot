import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { colors } from "@/constants/theme";
import { StartupGate } from "@/components/StartupGate";
import { AppProviders } from "@/state/AppProviders";

export default function RootLayout() {
  return (
    <AppProviders>
      <StartupGate>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTintColor: colors.primary,
            headerTitleStyle: { color: colors.text },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="spot/[id]"
            options={{ title: "", headerBackTitle: "Back" }}
          />
          <Stack.Screen
            name="filters"
            options={{ title: "Filters", presentation: "modal" }}
          />
        </Stack>
      </StartupGate>
    </AppProviders>
  );
}
