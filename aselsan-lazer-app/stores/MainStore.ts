import { configure, makeAutoObservable, observable } from "mobx";
import { create, persist } from "mobx-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HomeScreenTypes } from "../constants/Config";

configure({ enforceActions: "never" });

class MainStoreC {
  @persist hedefkonumgosterimtipi: "utm" | "latlong" = "utm";
  constructor() {
    makeAutoObservable(this);
  }

  @persist first: boolean = true;
  @persist("object") settings: any = {
    home_screen_type: HomeScreenTypes.MesafeVePusula.id,
    lock_screen: false,
  };

  setFirst(data: boolean) {
    this.first = data;
  }

  setSettings(data: any) {
    this.settings = { ...this.settings, ...data };
  }
}

const hdyrate = create({ storage: AsyncStorage });

export const MainStore = new MainStoreC();

hdyrate("MainStore", MainStore).then(() =>
  console.log("store has been hydrated")
);
