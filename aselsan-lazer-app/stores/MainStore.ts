import { configure, makeAutoObservable, observable } from "mobx";
import { create, persist } from "mobx-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {HomeScreenTypes, UnitTypes} from "../constants/Config";
import { Device } from 'react-native-ble-plx';

configure({ enforceActions: "never" });

class MainStoreC {
  constructor() {
    makeAutoObservable(this);
  }

  @persist first: boolean = true;
  @persist("object") device: Device | null = null;
  @persist("object") settings: any = {
    home_screen_type:HomeScreenTypes.MesafeVePusula.id,
    lock_screen:false
  };


  setFirst(data: boolean) {
    this.first = data;
  }
  setDevice(data: Device) {
    this.device = data;
  }
  setSettings(data: any) {
    this.settings = {...this.settings,...data};
  }

}

const hdyrate = create({ storage: AsyncStorage });

export const MainStore = new MainStoreC();

hdyrate("MainStore", MainStore).then(() =>
  console.log("store has been hydrated")
);
