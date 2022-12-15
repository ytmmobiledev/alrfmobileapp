import { AngleUnitTypes, DistanceUnitTypes } from "../constants/Config";
import { BleManager } from "react-native-ble-plx";
import { Base64ToHex } from "../functions/Buffer";
import { IStore } from "../stores/InstantStore";
import { flattenDeep } from "lodash";
import ExpoJobQueue from "expo-job-queue";
import { createIV, encrypt } from "../functions/AES";

const transactionId = "monitor_device";

class BLEService {
  private device_id: string = "";
  public static bleManager: BleManager;
  static _this: BLEService;

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
    BLEService.bleManager = new BleManager();
    BLEService._this = this;
  }

  public setData(new_data: any) {
    BLEService._this.data = { ...BLEService._this.data, ...new_data };
  }

  public getData() {
    return BLEService._this.data;
  }

  public setDeviceID(device_id: string) {
    BLEService._this.device_id = device_id;
  }

  public getDeviceID() {
    return BLEService._this.device_id;
  }

  public sendDataToDevice(_key: string, data: any) {
    let device_id = BLEService._this.getDeviceID();
    if (!device_id) {
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

    ExpoJobQueue.addJob("sendMessage", { device_id, data });

    return true;
  }

  public startListener() {
    const device_id = BLEService._this.getDeviceID();

    if (!device_id) throw "no_connect1";

    try {
      BLEService.bleManager?.cancelTransaction(transactionId);
    } catch {}

    BLEService.bleManager.onDeviceDisconnected(device_id, () => {
      BLEService._this.setDeviceID("");
    });

    BLEService.bleManager?.monitorCharacteristicForDevice(
      device_id,
      "2456e1b9-26e2-8f83-e744-f34f01e9d701",
      "2456e1b9-26e2-8f83-e744-f34f01e9d703",
      (error, characteristic) => {
        let value: any = characteristic?.value;

        if (value) {
          const hexValue = [...Base64ToHex(value)];

          ExpoJobQueue.addJob("receiveMessage", { data: hexValue });
        }
      },
      transactionId
    );
  }

  public stopListener() {
    try {
      IStore.queueService.RECEIVE_MESSAGE_BUFFER = [];
      IStore.isEncryptedCommunication = false;
      BLEService.bleManager?.cancelTransaction(transactionId);
    } catch {}
  }
}

export default BLEService;
