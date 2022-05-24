import * as Notifications from "expo-notifications";

export async function createNotification() {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
    }
  } catch (e) {}
}
