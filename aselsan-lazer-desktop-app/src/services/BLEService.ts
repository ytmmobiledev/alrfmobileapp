import { AngleUnitTypes, DistanceUnitTypes } from "../constants/Config";
import { error } from "../functions/toast";
import { findData } from "../functions/findData";
import DeviceEventEmitter from "events";
import { Base64ToHex, HexToBase64 } from "../functions/Buffer";
import { IStore } from "../stores/InstantStore";
import { l_moment } from "../functions/cMoment";
import { createIV, encrypt } from "../functions/AES";
import { flattenDeep } from "lodash";
import { string } from "../locales";

class BLEService {
  private device: any = null;
  public characteristic: any = null;
  static _this: BLEService;
  private static event: DeviceEventEmitter = new DeviceEventEmitter();

  private data = {
    serial_no: "",
    device_version: "",
    temperature: "",
    pressure: "",
    shot_counter: "",
    statuses: {
      odometer_activity: {
        title: "lazermesafeolceraktifligi",
        value: null,
      },
      compass_activity: {
        title: "pusulaaktifligi",
        value: null,
      },
      bluetooth_activity: {
        title: "bluetoothaktifligi",
        value: null,
      },
      odometer_error: {
        title: "lazermesafeolcerhatabilgisi",
        value: null,
      },
      compass_error: {
        title: "pusulahatabilgisi",
        value: null,
      },
      bluetooth_error: {
        title: "bluetoothhatabilgisi",
        value: null,
      },
      battery_error: {
        title: "bataryahatabilgisi",
        value: null,
      },
    },
    distance_unit: "",
    article_mode: "",
    distance_and_compass: {
      distance: 0,
      distance_unit: DistanceUnitTypes.Metre.id,
      angle_unit: AngleUnitTypes.Derece.id,
      azimuth: 0,
      elevation: 0,
      roll: 0,
    },
    language: "",
    angle_unit_type: "",
    night_vision_mode: "",
    device_sleep_time: null,
    bluetooth_sleep_time: null,
    bottom_door_lock: 0,
    top_door_lock: 0,
    magnetic_declination_angle: 0,
  };

  constructor() {
    BLEService._this = this;
  }

  public setData(new_data: any) {
    BLEService._this.data = { ...BLEService._this.data, ...new_data };
  }
  public getData() {
    return BLEService._this.data;
  }

  public setDevice(device: any) {
    BLEService._this.device = device;
  }

  public getDevice() {
    return BLEService._this.device;
  }

  public sendDataToDevice(_key: string, data: any) {
    let device = BLEService._this.getDevice();
    if (!device) {
      throw "no_connect1";
    }

    if (IStore.isEncryptedCommunication) {
      const length = data.length % 16;
      const padding = 16 - length;

      data = data.concat(new Array(padding).fill(0x00));

      const iv = createIV();

      let encrypted = encrypt(data, iv);

      let message: any = [...iv, ...encrypted].map((e: number) => {
        if (e == 0x7e) {
          return [0x7d, 0x5e];
        } else if (e == 0x7d) {
          return [0x7d, 0x5d];
        }

        return e;
      });

      message = flattenDeep(message);

      data = [0x7e, ...message, 0x7e];
    }

    IStore.queueService.sendMessageQueue.push({
      data,
    });
  }

  public startListener() {
    const device = BLEService._this.getDevice();

    if (!device) throw "no_connect1";

    /* device.addEventListener("gattserverdisconnected", () => {
      BLEService._this.setDevice(null);
    });*/

    device
      .getPrimaryService("2456e1b9-26e2-8f83-e744-f34f01e9d701")
      .then((service: any) => {
        return service.getCharacteristic(
          "2456e1b9-26e2-8f83-e744-f34f01e9d703"
        );
      })
      .then((_characteristic: any) => {
        BLEService._this.characteristic = _characteristic;
        BLEService._this.characteristic.addEventListener(
          "characteristicvaluechanged",
          BLEService._this.onChangeListener
        );
        BLEService._this.characteristic.startNotifications();
      })
      .catch((e: any) => {
        // console.warn(e);
        error(string["baglantihatasi"]);
      });
  }

  public onChangeListener(event: any) {
    let value = event.target.value;

    if (value) {
      IStore.queueService.receiveMessageQueue.push({
        data: [...new Uint8Array(value.buffer)],
      });
    }
  }

  public stopListener() {
    try {
      IStore.queueService.RECEIVE_MESSAGE_BUFFER = [];
      IStore.isEncryptedCommunication = false;
      BLEService._this.characteristic.removeEventListener(
        "characteristicvaluechanged",
        BLEService._this.onChangeListener
      );
      BLEService._this.characteristic = null;
    } catch {}
  }
}

export default BLEService;
