//@ts-nocheck
import { configure, makeAutoObservable } from "mobx";
import BLEService from "../services/BLEService";
import {setModalTypes} from "../components/SetModal";

configure({ enforceActions: "never" });

class InstantStoreC {
  constructor() {
    makeAutoObservable(this);
  }

  ble: BLEService = new BLEService();
  loading: boolean = false;
  desc_modal: any = {};
  custom_modal: any = {};
  set_modal: {visible:boolean,title?:string,description?:string,icon?:any,value?:any,options?:any,type:keyof typeof setModalTypes,onChange:any} = {};
  go_page: any = {};

  setBLE(data: BLEService) {
    this.ble = data;
  }
  setLoading(data: boolean) {
    this.loading = data;
  }
  setDescModal(data: any) {
    this.desc_modal = data;
  }
  setSetModal(data: any) {
    this.set_modal = data;
  }
  setCustomModal(data: any) {
    this.custom_modal = data;
  }
  setGoPage(data: any) {
    this.go_page = data;
  }
}

export const IStore = new InstantStoreC();