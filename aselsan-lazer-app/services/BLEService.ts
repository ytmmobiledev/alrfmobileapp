import { AngleUnitTypes, DistanceUnitTypes } from "../constants/Config";
import { BleManager } from "react-native-ble-plx";
import { error } from "../functions/toast";
import { findData } from "../functions/findData";
import { DeviceEventEmitter } from "react-native";
import { HexToBase64 } from "../functions/Buffer";
import { IStore } from "../stores/InstantStore";
import { l_moment } from "../functions/cMoment";

let exampleRes: any = {
  serial_no: "tlEJEQU=",
  device_version: "tREEESU=",
  temperature: "tR4EBT0=",
  pressure: "tmgEBAUFPQ==",
  shot_counter: "tlMAAAIBPQ==",
  statuses: "tRAHqoo=",
  distance_unit: "tSIAALM=",
  article_mode: "tRgAAbM=",
  distance_and_compass: "tR0AAAAAAAAAAAAAAAXzARIDHQM=",
  language: "tRsAALM=",
  angle_unit_type: "tSAAA7M=",
  night_vision_mode: "tSQAAbM=",
  device_sleep_time: "tSYABbM=",
  bluetooth_sleep_time: "tSoABrM=",
  bottom_door_lock: "tRUD6LM=",
  top_door_lock: "tRcA6LM=",
  magnetic_declination_angle: "tSwK87M=",
};
const transactionId = "monitor_device";

class BLEService {
  private device_id: string = "";
  public static bleManager: BleManager;
  private static _this: BLEService;

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

  public async sendDataToDevice(_key: string, data: any) {
    IStore.setLogger({
      type: "send",
      key: _key,
      data,
      date: l_moment(),
      res: "sending...",
    });

    let device_id = BLEService._this.getDeviceID();
    if (!device_id) {
      throw "no_connect1";
    }

    if (device_id == "test") {
      return new Promise((resolve, reject) => {
        IStore.setLogger({
          type: "send",
          key: _key,
          data,
          date: l_moment(),
          res: "success",
        });

        setTimeout(() => {
          IStore.setLogger({
            type: "receive",
            key: "",
            data: exampleRes[_key],
            date: l_moment(),
            res: "data received",
          });
          const { key, value: res }: any = findData(exampleRes[_key]);
          IStore.setLogger({
            type: "receive",
            key,
            data: res,
            date: l_moment(),
            res: "success",
          });
          BLEService._this.setData({ [key]: res });

          DeviceEventEmitter.emit("monitor", {
            key,
            value: res,
            all_data: BLEService._this.getData(),
          });

          DeviceEventEmitter.emit(key, res);

          resolve(true);
        }, Math.floor(Math.random() * 1000 + 2000));
      });
    }

    return new Promise((resolve, reject) => {
      BLEService.bleManager
        ?.writeCharacteristicWithoutResponseForDevice(
          device_id,
          "2456e1b9-26e2-8f83-e744-f34f01e9d701",
          "2456e1b9-26e2-8f83-e744-f34f01e9d703",
          HexToBase64(data)
        )
        .then((res) => {
          IStore.setLogger({
            type: "send",
            key: _key,
            data,
            date: l_moment(),
            res: "success",
          });

          resolve(res.value);
        })
        .catch((e: any) => {
          IStore.setLogger({
            type: "send",
            key: _key,
            data,
            date: l_moment(),
            res: "error " + JSON.stringify(e),
          });

          reject(e);
          error();
        });
    });
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

    IStore.setLogger({
      type: "receive",
      key: "",
      data: "",
      date: l_moment(),
      res: "listener started",
    });

    BLEService.bleManager?.monitorCharacteristicForDevice(
      device_id,
      "2456e1b9-26e2-8f83-e744-f34f01e9d701",
      "2456e1b9-26e2-8f83-e744-f34f01e9d703",
      (error, characteristic) => {
        let value: any = characteristic?.value;
        IStore.setLogger({
          type: "receive",
          key: "",
          data: value,
          date: l_moment(),
          res: "data received",
        });

        if (value) {
          const { key, value: res }: any = findData(value);

          IStore.setLogger({
            type: "receive",
            key,
            data: JSON.stringify(res),
            date: l_moment(),
            res: "success",
          });

          BLEService._this.setData({ [key]: res });

          DeviceEventEmitter.emit("monitor", {
            key,
            value: res,
            all_data: BLEService._this.getData(),
          });

          DeviceEventEmitter.emit(key, res);
        }
      },
      transactionId
    );
  }

  public stopListener() {
    try {
      BLEService.bleManager?.cancelTransaction(transactionId);
    } catch {}
  }
}

export default BLEService;
