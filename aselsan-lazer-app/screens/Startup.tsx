//@ts-nocheck
import * as React from "react";
import Colors from "../constants/Colors";
import { Spinner } from "native-base";
import { CView } from "../components/CView";
import { MainStore } from "../stores/MainStore";
import { IStore } from "../stores/InstantStore";
import { goPage } from "../functions/goPage";
import { useFocusEffect } from "@react-navigation/native";

export default function Startup(props: any) {
  const { navigation } = props;

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        controlData();
      }, 1000);
    }, [])
  );

  function controlData() {
    if (MainStore.first) {
      MainStore.setFirst(false);
      goPage({ navigation }, "Slide");
    } else {
      let device_id = IStore.ble.getDeviceID();

      if (device_id) {
        goPage({ navigation }, "Root");
      } else {
        navigation.navigate("ConnectDevice");
      }
    }
  }

  return (
    <CView flex={1} center color="primary">
      <Spinner color={Colors.white} />
    </CView>
  );
}
