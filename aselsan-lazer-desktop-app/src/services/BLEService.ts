import { AngleUnitTypes, DistanceUnitTypes } from "../constants/Config";
import { error } from "../functions/toast";
import { findData } from "../functions/findData";
import DeviceEventEmitter from "events";
import { HexToBase64 } from "../functions/Buffer";
import { IStore } from "../stores/InstantStore";
import { l_moment } from "../functions/cMoment";

let exampleRes: any = {
  serial_no: "tlEJEQU=",
  device_version: "tREEESU=",
  temperature: "tR4EBT0=",
  pressure: "tmgEBAUFPQ==",
  shot_counter: "tlMAAAIBPQ==",
  statuses: "tRCjtAQ=",
  distance_unit: "tSIAALM=",
  article_mode: "tRgAAbM=",
  distance_and_compass: "tR0AAIf/AKwQAEQzAAEEABUAGQ==",
  language: "tRsAALM=",
  angle_unit_type: "tSAAA7M=",
  night_vision_mode: "tSQAAbM=",
  device_sleep_time: "tSYABbM=",
  bluetooth_sleep_time: "tSoABrM=",
  bottom_door_lock: "tRUD6LM=",
  top_door_lock: "tRcA6LM=",
  magnetic_declination_angle: "tSwK87M=",
};

class BLEService {
  private device: any = null;
  public characteristic: any = null;
  private static _this: BLEService;
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

  public async sendDataToDevice(_key: string, data: any) {
    IStore.setLogger({
      type: "send",
      key: _key,
      data,
      date: l_moment(),
      res: "sending...",
    });

    let device = BLEService._this.getDevice();
    if (!device) {
      throw "no_connect1";
    }

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

        // @ts-ignore
        BLEService.event.emit("monitor", {
          key,
          value: res,
          all_data: BLEService._this.getData(),
        });

        // @ts-ignore
        BLEService.event.emit(key, res);

        resolve(true);
      }, Math.floor(Math.random() * 1000 + 2000));
    });

    return new Promise((resolve, reject) => {
      device
        .getPrimaryService("2456e1b9-26e2-8f83-e744-f34f01e9d701")
        .then((service: any) => {
          return service.getCharacteristic("battery_level");
        })
        .then((characteristic: any) => {
          return characteristic.writeValue(HexToBase64(data));
        })
        .then(() => {
          IStore.setLogger({
            type: "send",
            key: _key,
            data,
            date: l_moment(),
            res: "success",
          });
          resolve(true);
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
    const device = BLEService._this.getDevice();

    if (!device || device == "test") throw "no_connect1";

    device.addEventListener("gattserverdisconnected", () => {
      BLEService._this.setDevice(null);
    });

    IStore.setLogger({
      type: "receive",
      key: "",
      data: "",
      date: l_moment(),
      res: "listener started",
    });

    device
      .getPrimaryService("2456e1b9-26e2-8f83-e744-f34f01e9d701")
      .then((service: any) => {
        return service.getCharacteristic("battery_level");
      })
      .then((_characteristic: any) => {
        BLEService._this.characteristic = _characteristic;
        BLEService._this.characteristic.addEventListener(
          "characteristicvaluechanged",
          BLEService._this.onChangeListener
        );
      })
      .catch((e: any) => {
        console.warn(e);
        error("Bağlantı Hatası");
      });
  }

  public onChangeListener(event: any) {
    let value = event.target.value;

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

      // @ts-ignore
      BLEService.event.emit("monitor", {
        key,
        value: res,
        all_data: BLEService._this.getData(),
      });

      // @ts-ignore
      BLEService.event.emit(key, res);
    }
  }

  public stopListener() {
    try {
      BLEService._this.characteristic.removeEventListener(
        "characteristicvaluechanged",
        BLEService._this.onChangeListener
      );
      BLEService._this.characteristic = null;
    } catch {}
  }
}

export default BLEService;
