import ExpoJobQueue from "expo-job-queue";
import { chunk, findIndex, isEqual } from "lodash";
import { HexToBase64 } from "../functions/Buffer";
import BLEService from "./BLEService";
import { IStore } from "../stores/InstantStore";
import {
  createIV,
  decrypt,
  encrypt,
  Params,
  PROCESS_KEYS,
  PROCESS_KEYS_LENGTH,
} from "../constants/Params";
import { error, success } from "../functions/toast";
import { string } from "../locales";
import { findData } from "../functions/findData";
import { DeviceEventEmitter } from "react-native";

const params = Params();

interface ISendMessage {
  device_id: string;
  data: number[];
}

interface IRecieveMessage {
  data: number[];
}

interface IProcessMessage {
  data: number[];
}

export default class QueueService {
  private _RECEIVE_MESSAGE_BUFFER: number[] = [];
  constructor() {
    ExpoJobQueue.configure({});
    ExpoJobQueue.addWorker("sendMessage", this.sendMessage);
    ExpoJobQueue.addWorker("sendMessageForChunk", this.sendMessageForChunk);
    ExpoJobQueue.addWorker("receiveMessage", this.receiveMessage);
    ExpoJobQueue.addWorker("processMessage", this.processMessage);
  }

  public get RECEIVE_MESSAGE_BUFFER() {
    return this._RECEIVE_MESSAGE_BUFFER;
  }

  public set RECEIVE_MESSAGE_BUFFER(value: number[]) {
    this._RECEIVE_MESSAGE_BUFFER = value;
  }

  private sendMessage = (payload: ISendMessage) => {
    return new Promise((resolve) => {
      const { data, device_id } = payload;

      const chunks = chunk(data, 20);

      /*console.log(
        "giden",
        data.map((d) => d.toString(16))
      );*/

      for (const chunk of chunks) {
        ExpoJobQueue.addJob("sendMessageForChunk", {
          data: chunk,
          device_id,
        });
      }

      resolve(undefined);
    });
  };

  private sendMessageForChunk = (payload: ISendMessage) => {
    return new Promise((resolve) => {
      const { data, device_id } = payload;

      const message = HexToBase64(data);

      BLEService.bleManager
        .writeCharacteristicWithoutResponseForDevice(
          device_id,
          "2456e1b9-26e2-8f83-e744-f34f01e9d701",
          "2456e1b9-26e2-8f83-e744-f34f01e9d703",
          message
        )
        .then((res) => {
          resolve(undefined);
        })
        .catch((err) => {
          resolve(undefined);
        });
    });
  };

  private receiveMessage = (payload: IRecieveMessage) => {
    return new Promise((resolve) => {
      const { data: _data } = payload;

      /*console.log(
        "gelen",
        _data.map((d) => d.toString(16))
      );*/

      this.RECEIVE_MESSAGE_BUFFER.push(..._data);

      if (IStore.isEncryptedCommunication) {
        const index = findIndex(
          this.RECEIVE_MESSAGE_BUFFER,
          (item) => item == 0x7e
        );
        const secondIndex = findIndex(
          this.RECEIVE_MESSAGE_BUFFER,
          (item) => item == 0x7e,
          index + 1
        );

        if (index !== -1 && secondIndex === -1 && index !== 0) {
          this.RECEIVE_MESSAGE_BUFFER = this.RECEIVE_MESSAGE_BUFFER.slice(
            index + 1
          );
        }

        if (index !== -1 && secondIndex !== -1 && index !== secondIndex) {
          try {
            let data = this.RECEIVE_MESSAGE_BUFFER.slice(
              index,
              secondIndex + 1
            );

            data.forEach((item, index) => {
              if (item == 0x7d && data[index + 1] == 0x5e) {
                data[index] = 0x7e;
                // @ts-ignore
                data[index + 1] = null;
              } else if (item == 0x7d && data[index + 1] == 0x5d) {
                data[index] = 0x7d;
                // @ts-ignore
                data[index + 1] = null;
              }
            });

            data = data.filter((e) => e !== null);

            try {
              const iv = Uint8Array.from(data.slice(1, 17));
              const encrypted_data = data.slice(17, data.length - 1);

              const decrypted_data = decrypt(encrypted_data, iv);

              ExpoJobQueue.addJob("processMessage", {
                data: [...decrypted_data],
              });
            } catch (e) {}

            this.RECEIVE_MESSAGE_BUFFER = this.RECEIVE_MESSAGE_BUFFER.slice(
              secondIndex + 1
            );
          } catch (e) {}
        }
      } else {
        const checkData = Object.values(PROCESS_KEYS_LENGTH);

        for (const data of checkData) {
          if (
            this.RECEIVE_MESSAGE_BUFFER[1] === data.key &&
            this.RECEIVE_MESSAGE_BUFFER.length == data.length
          ) {
            ExpoJobQueue.addJob("processMessage", {
              data: [...this.RECEIVE_MESSAGE_BUFFER],
            });

            this.RECEIVE_MESSAGE_BUFFER = [];

            return resolve(undefined);
          }
        }
      }

      resolve(undefined);
    });
  };

  private processMessage = (payload: IProcessMessage) => {
    return new Promise((resolve) => {
      const { data } = payload;
      const command = data[1];

      switch (command) {
        case PROCESS_KEYS.KimlikDogrulamaSorgu:
          BLEService._this.sendDataToDevice(
            "kimlikdurumbilgisi",
            params.kimlikdurumbilgisi.getHex(
              PROCESS_KEYS.KimlikDogrulamaSorgu,
              0x00
            )
          );

          const iv = createIV();

          const message = data.slice(2, 18);
          const encrypted = encrypt(message, iv);

          const _message = params.kimlikdogrulamasorgususifreli.getHex(
            iv,
            encrypted
          );

          BLEService._this.sendDataToDevice(
            "kimlikdogrulamasorgususifreli",
            _message
          );
          break;

        case PROCESS_KEYS.KimlikDogrulama:
          BLEService._this.sendDataToDevice(
            "kimlikdurumbilgisi",
            params.kimlikdurumbilgisi.getHex(PROCESS_KEYS.KimlikDogrulama, 0x00)
          );

          IStore.controlData = createIV();

          BLEService._this.sendDataToDevice(
            "kimlikdogrulamasorgu",
            params.kimlikdogrulamasorgu.getHex(IStore.controlData)
          );

          break;

        case PROCESS_KEYS.KimlikDurumBilgisi:
          const cmd = data[2];
          const status = data[3];

          /* let title = "Kimlik doğrulama başarısız";
          if (status == 0x01) error(title, "Kontrol toplamı hatası");
          else if (status == 0x02) error(title, "Komut hatası");
          else if (status == 0x03) error(title, "Geçersiz mesaj paketi");
          else if (status == 0x04) error(title, "Hatalı içerik");*/

          if (status != 0x00) {
            IStore.loadingConnect = -1;
            BLEService._this.stopListener();
            BLEService.bleManager
              .cancelDeviceConnection(BLEService._this.getDeviceID())
              .then(() => {});
            error(
              string["kimlikdogrulamabasarisiz"],
              string["desteklenmeyencihaz"]
            );
          }

          break;

        case PROCESS_KEYS.KimlikDogrulamaSifreli:
          const _iv = Uint8Array.from(data.slice(2, 18));
          const _encrypted = data.slice(18, 34);

          const decrypted = decrypt(_encrypted, _iv);

          const isOk = isEqual(decrypted, IStore.controlData);

          BLEService._this.sendDataToDevice(
            "kimlikdurumbilgisi",
            params.kimlikdurumbilgisi.getHex(
              PROCESS_KEYS.KimlikDogrulamaSifreli,
              isOk ? 0x00 : 0x04
            )
          );

          if (isOk) {
            this.RECEIVE_MESSAGE_BUFFER = [];
            IStore.isEncryptedCommunication = true;
            IStore.loadingConnect = -1;
            IStore.navigation?.goBack?.();
            success();
          }

          break;

        default:
          const { key, value: res }: any = findData(HexToBase64(data));

          BLEService._this.setData({ [key]: res });

          DeviceEventEmitter.emit("monitor", {
            key,
            value: res,
            all_data: BLEService._this.getData(),
          });

          DeviceEventEmitter.emit(key, res);
          break;
      }

      resolve(undefined);
    });
  };
}
