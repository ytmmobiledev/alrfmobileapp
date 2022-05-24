import * as React from "react";
import Colors from "../constants/Colors";
import { Spinner } from "native-base";
import { useEffect } from "react";
import { CView } from "../components/CView";
import {MainStore} from "../stores/MainStore";
import BLEService from "../services/BLEService";
import {IStore} from "../stores/InstantStore";

export default function Startup(props: any) {
  const { navigation }=props

  const ble = IStore.ble;

  useEffect(() => {
    setTimeout(() => {

      controlData();
    }, 3000);
  }, []);

  function controlData() {

    ble.setDevice(MainStore.device)

    if(MainStore.first){
      MainStore.setFirst(false)
      navigation.navigate("Slide")
    }else{
      navigation.navigate("Root")
    }
  }


  return (
    <CView  flex={1} center color="primary">
      <Spinner color={Colors.white} />
    </CView>
  );
}
