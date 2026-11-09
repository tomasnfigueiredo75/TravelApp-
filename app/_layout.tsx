import { Stack } from "expo-router";
import { Platform, StatusBar } from "react-native";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

export default function RootLayout() {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false
      })
    });
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("travel-reminders", {
        name: "Lembretes de viagem",
        importance: Notifications.AndroidImportance.HIGH
      });
    }
  }, []);
  return <>
    <StatusBar barStyle="dark-content" />
    <Stack screenOptions={{ headerShown: false }} />
  </>;
}