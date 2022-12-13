import { AngleUnitTypes, DistanceUnitTypes } from "../constants/Config";
import { BleManager, Characteristic } from "react-native-ble-plx";
import { error, success } from "../functions/toast";
import { findData } from "../functions/findData";
import { DeviceEventEmitter } from "react-native";
import { Base64ToHex, HexToBase64 } from "../functions/Buffer";
import { IStore } from "../stores/InstantStore";
import { l_moment } from "../functions/cMoment";
import {
  createIV,
  decrypt,
  encrypt,
  Params,
  PROCESS_KEYS,
  PROCESS_KEYS_LENGTH,
} from "../constants/Params";
import { chunk, isEqual, findIndex, flattenDeep } from "lodash";
import { string } from "../locales";

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

const param = Params();

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

  private buffer: any[] = [];

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

  private async bufferControl() {
    const checkData = Object.values(PROCESS_KEYS_LENGTH);

    const buffer = [...BLEService._this.buffer];

    if (IStore.isEncryptedCommunication) {
      const index = findIndex(buffer, (item) => item === 0x7e);
      const secondIndex = findIndex(buffer, (item) => item === 0x7e, index + 1);

      if (index !== -1 && secondIndex !== -1 && index !== secondIndex) {
        BLEService._this.buffer = buffer.slice(secondIndex);
        let data = buffer.slice(index, secondIndex + 1);

        data.forEach((item, index) => {
          if (item == 0x7d && data[index + 1] == 0x5e) {
            data[index] = 0x7e;
            data[index + 1] = null;
          } else if (item == 0x7d && data[index + 1] == 0x5d) {
            data[index] = 0x7d;
            data[index + 1] = null;
          }
        });

        data = data.filter((item) => item !== null);

        try {
          const iv = Uint8Array.from(data.slice(1, 17));
          const encrypted_data = data.slice(17, data.length - 1);

          const decrypted_data = decrypt(encrypted_data, iv);

          await BLEService._this.controlData([...decrypted_data]);
        } catch (e) {
          console.error(e, BLEService._this.buffer);
        }

        return data;
      }

      return;
    }

    for (const data of checkData) {
      if (buffer[1] === data.key) {
        if (buffer.length < data.length) {
          return false;
        } else {
          await BLEService._this.controlData(buffer);

          BLEService._this.buffer.splice(0, data.length);

          return true;
        }
      }
    }
  }

  private async controlData(buffer: any[]) {
    const command = buffer[1];

    switch (command) {
      case PROCESS_KEYS.KimlikDogrulamaSorgu:
        await BLEService._this.sendDataToDevice(
          "kimlikdurumbilgisi",
          param.kimlikdurumbilgisi.getHex(
            PROCESS_KEYS.KimlikDogrulamaSorgu,
            0x00
          )
        );

        const iv = createIV();

        const message = buffer.slice(2, 18);
        const encrypted = encrypt(message, iv);

        const _message = param.kimlikdogrulamasorgususifreli.getHex(
          iv,
          encrypted
        );

        await BLEService._this.sendDataToDevice(
          "kimlikdogrulamasorgususifreli",
          _message
        );
        break;

      case PROCESS_KEYS.KimlikDogrulama:
        await BLEService._this.sendDataToDevice(
          "kimlikdurumbilgisi",
          param.kimlikdurumbilgisi.getHex(PROCESS_KEYS.KimlikDogrulama, 0x00)
        );

        IStore.controlData = createIV();

        await BLEService._this.sendDataToDevice(
          "kimlikdogrulamasorgu",
          param.kimlikdogrulamasorgu.getHex(IStore.controlData)
        );

        break;

      case PROCESS_KEYS.KimlikDurumBilgisi:
        const cmd = buffer[2];
        const status = buffer[3];

        /* let title = "Kimlik doğrulama başarısız";
        if (status == 0x01) error(title, "Kontrol toplamı hatası");
        else if (status == 0x02) error(title, "Komut hatası");
        else if (status == 0x03) error(title, "Geçersiz mesaj paketi");
        else if (status == 0x04) error(title, "Hatalı içerik");*/

        if (status != 0x00) {
          IStore.loadingConnect = -1;
          BLEService._this.stopListener();
          BLEService.bleManager.cancelDeviceConnection(
            BLEService._this.device_id
          );
          error(
            string["kimlikdogrulamabasarisiz"],
            string["desteklenmeyencihaz"]
          );
        }

        break;

      case PROCESS_KEYS.KimlikDogrulamaSifreli:
        const _iv = Uint8Array.from(buffer.slice(2, 18));
        const _encrypted = buffer.slice(18, 34);

        const decrypted = decrypt(_encrypted, _iv);

        const isOk = isEqual(decrypted, IStore.controlData);

        await BLEService._this.sendDataToDevice(
          "kimlikdurumbilgisi",
          param.kimlikdurumbilgisi.getHex(
            PROCESS_KEYS.KimlikDogrulamaSifreli,
            isOk ? 0x00 : 0x04
          )
        );

        if (isOk) {
          BLEService._this.buffer = [];
          IStore.isEncryptedCommunication = true;
          IStore.loadingConnect = -1;
          IStore.navigation?.goBack?.();
          success();
        }

        break;

      default:
        const { key, value: res }: any = findData(HexToBase64(buffer));

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
        break;
    }
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

    const processes: any[] = [];
    const errors = [];

    const chunks = chunk(data, 20);

    for (const chunk of chunks) {
      try {
        const { value } =
          await BLEService.bleManager?.writeCharacteristicWithoutResponseForDevice(
            device_id,
            "2456e1b9-26e2-8f83-e744-f34f01e9d701",
            "2456e1b9-26e2-8f83-e744-f34f01e9d703",
            HexToBase64(chunk)
          );
        processes.push(value);
      } catch (e) {
        errors.push(e);
      }
    }

    if (errors.length) {
      IStore.setLogger({
        type: "send",
        key: _key,
        data,
        date: l_moment(),
        res: "error " + JSON.stringify(errors),
      });
      error();
      return;
    }

    IStore.setLogger({
      type: "send",
      key: _key,
      data,
      date: l_moment(),
      res: "success",
    });

    return processes;
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
      async (error, characteristic) => {
        let value: any = characteristic?.value;
        IStore.setLogger({
          type: "receive",
          key: "",
          data: value,
          date: l_moment(),
          res: "data received",
        });

        if (value) {
          const hexValue = [...Base64ToHex(value)];

          BLEService._this.buffer = [...BLEService._this.buffer, ...hexValue];

          BLEService._this.bufferControl();
        }
      },
      transactionId
    );
  }

  public stopListener() {
    try {
      BLEService._this.buffer = [];
      IStore.isEncryptedCommunication = false;
      BLEService.bleManager?.cancelTransaction(transactionId);
    } catch {}
  }
}

export default BLEService;
