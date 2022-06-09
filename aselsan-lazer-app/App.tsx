import "expo-dev-client";

import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

import Loading from "./components/Loading";
import { Alert } from "react-native";
import DescriptionModal from "./components/DescriptionModal";
import CustomModal from "./components/CustomModal";
import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import { IStore } from "./stores/InstantStore";
import CToast from "./components/CToast";
import Colors from "./constants/Colors";
import SetModal from "./components/SetModal";
import Logger from "./components/Logger";




Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const getPermissions = async () => {};

  Notifications.addNotificationResponseReceivedListener((response) => {
    // Uygulama kapalıyken bildirim geldiğinde
    const {
      notification: {
        request: {
          content: { data: item },
        },
      },
    }: any = response;

    try {
      if (!item.page) throw new Error("Page not found");

      IStore.setGoPage({ name: item.page, params: { ...item.params } });
    } catch (e) {
      //IStore.setGoPage({ name: "Notifications", params: {} });
    }
  });

  const updateController = () => {
    Updates.checkForUpdateAsync().then(({ isAvailable }) => {
      if (isAvailable) {
        Updates.fetchUpdateAsync().then(({ isNew }) => {
          if (isNew) {
            Alert.alert(
              "Yeni Güncelleme Mevcut",
              "Uygulama yeniden başlatılacaktır",
              [
                {
                  text: "Güncelle",
                  onPress: async () => {
                    await Updates.reloadAsync();
                  },
                },
              ],
              { cancelable: false }
            );
          }
        });
      }
    });
  };

  useEffect(() => {
    getPermissions();
    Notifications.addNotificationReceivedListener((notification) => {
      // Uygulama açıkken bildirim geldiğinde

      const {
        request: {
          content: { data },
        },
      } = notification;
    });

    updateController();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider style={{backgroundColor:Colors.darkGray}}>
        <Logger/>
        <Navigation colorScheme={colorScheme} />
        <StatusBar  style={"light"} backgroundColor={Colors.primary}/>

        <Loading />
        <DescriptionModal />
        <CustomModal />
        <SetModal />

        <CToast />

      </SafeAreaProvider>
    );
  }
}
