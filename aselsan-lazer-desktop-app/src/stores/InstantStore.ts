//@ts-nocheck
import { observable, action } from "mobx";
import BLEService from "../services/BLEService";
import { setModalTypes } from "../componenets/SetModal";
import QueueService from "../services/QueueService";

class InstantStoreC {
  @observable ble: BLEService = new BLEService();

  queueService: QueueService = new QueueService();

  @observable loading: boolean = false;
  @observable desc_modal: any = {};
  @observable custom_modal: any = {};
  @observable set_modal: {
    visible: boolean;
    title?: string;
    description?: string;
    icon?: any;
    value?: any;
    options?: any;
    type: keyof typeof setModalTypes;
    numberParams: any;
    onChange: any;
  } = {};
  @observable go_page: any = {};
  @observable logger: any = [];
  @observable tab_index: string = "olcum";

  @observable firsLocation: boolean = true;

  isEncryptedCommunication: boolean = false;

  @observable loadingConnect: number = -1;

  decl: number | null = null;

  firstDeclToast: boolean = true;

  controlData: Uint8Array;

  navigation: any;

  @action setBLE(data: BLEService) {
    this.ble = data;
  }
  @action setLoading(data: boolean) {
    this.loading = data;
  }
  @action setDescModal(data: any) {
    this.desc_modal = data;
  }
  @action setSetModal(data: any) {
    this.set_modal = data;
  }
  @action setCustomModal(data: any) {
    this.custom_modal = data;
  }
  @action setGoPage(data: any) {
    this.go_page = data;
  }
  @action setLogger(data: any) {
    //console.warn(data)
    this.logger = [...this.logger, data];
  }
  @action setTabIndex(data: string) {
    this.tab_index = data;
  }
}

export const IStore = new InstantStoreC();
