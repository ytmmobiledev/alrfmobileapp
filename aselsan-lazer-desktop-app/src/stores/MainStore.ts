//@ts-nocheck

import { observable, action } from "mobx";
import { create, persist } from "mobx-persist";
import {HomeScreenTypes} from "../constants/Config";

class MainStoreC {

  @persist @observable first: boolean = true;
  @persist("object") @observable device:any = {device_id:"test"};
  @persist("object") @observable settings:any = {
    home_screen_type:HomeScreenTypes.MesafeVePusula.id,
    lock_screen:false
  };



  @action setFirst(data: boolean) {
    this.first = data;
  }
  @action setDevice(data: any) {
    this.device = data;
  }
  @action setSettings(data: any) {
    this.settings = {...this.settings,...data};
  }
}

export const MStore = new MainStoreC();

try {
  const hydrate = create({});
  hydrate("MStore", MStore)
      .then(() => console.info("MStore hydrated"))
      .catch((e) => console.error("Store Error: ", e));
}catch (e) {

}

