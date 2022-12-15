import { chunk, findIndex, isEqual } from "lodash";
import BLEService from "./BLEService";
import { HexToBase64 } from "../functions/Buffer";
import { IStore } from "../stores/InstantStore";
import { Params, PROCESS_KEYS, PROCESS_KEYS_LENGTH } from "../constants/Params";
import { createIV, encrypt, decrypt } from "../functions/AES";
import { error, success } from "../functions/toast";
import { string } from "../locales";
import { findData } from "../functions/findData";
const Queue = require("fastq");

interface ISendMessage {
  device: any;
  data: number[];
}

interface IRecieveMessage {
  data: number[];
}

interface IProcessMessage {
  data: number[];
}

const params = Params();

export default class QueueService {
  private _RECEIVE_MESSAGE_BUFFER: number[] = [];

  public sendMessageQueue;
  public receiveMessageQueue;
  private processMessageQueue;
  private sendMessageForChunkQueue;

  public get RECEIVE_MESSAGE_BUFFER() {
    return this._RECEIVE_MESSAGE_BUFFER;
  }

  public set RECEIVE_MESSAGE_BUFFER(value: number[]) {
    this._RECEIVE_MESSAGE_BUFFER = value;
  }

  constructor() {
    this.sendMessageQueue = Queue(this.sendMessage, 1);

    this.sendMessageForChunkQueue = Queue(this.sendMessageForChunk, 1);

    this.receiveMessageQueue = Queue(this.receiveMessage, 1);

    this.processMessageQueue = Queue(this.processMessage, 1);
  }

  private sendMessage = (payload: ISendMessage, cb: any) => {
    const { data } = payload;

    const chunks = chunk(data, 20);

    for (const chunk of chunks) {
      this.sendMessageForChunkQueue.push({
        data: chunk,
      });
    }

    cb(null, true);
  };

  private sendMessageForChunk = (payload: ISendMessage, cb: any) => {
    const { data } = payload;

    const device = IStore.ble.getDevice();

    if (device) {
      device
        .getPrimaryService("2456e1b9-26e2-8f83-e744-f34f01e9d701")
        .then((service: any) => {
          return service.getCharacteristic(
            "2456e1b9-26e2-8f83-e744-f34f01e9d703"
          );
        })
        .then((characteristic: any) => {
          return characteristic.writeValue(Uint8Array.from(data));
        })
        .then(() => {
          cb(null, true);
        })
        .catch((e: any) => {
          // console.error(e);
          cb(e, false);
        });
    } else {
      cb(new Error("Device not found"), false);
    }
  };

  private receiveMessage = (payload: IRecieveMessage, cb: any) => {
    const { data: _data } = payload;

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
          let data = this.RECEIVE_MESSAGE_BUFFER.slice(index, secondIndex + 1);

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

            this.processMessageQueue.push({
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
          this.processMessageQueue.push({
            data: [...this.RECEIVE_MESSAGE_BUFFER],
          });

          this.RECEIVE_MESSAGE_BUFFER = [];

          return cb(null, true);
        }
      }
    }

    cb(null, true);
  };

  private processMessage = (payload: IProcessMessage, cb: any) => {
    const { data } = payload;
    const command = data[1];

    // console.log(data.map((e) => e.toString(16)));

    switch (command) {
      case PROCESS_KEYS.KimlikDogrulamaSorgu:
        BLEService._this.sendDataToDevice(
          params.kimlikdurumbilgisi.title,
          params.kimlikdurumbilgisi.getHex(
            PROCESS_KEYS.KimlikDogrulamaSorgu,
            0x00
          )
        );

        const iv = createIV();

        const message = data.slice(2, 18);
        const encrypted = encrypt(message, iv);

        BLEService._this.sendDataToDevice(
          params.kimlikdogrulamasorgususifreli.title,
          params.kimlikdogrulamasorgususifreli.getHex(iv, encrypted)
        );
        break;

      case PROCESS_KEYS.KimlikDogrulama:
        BLEService._this.sendDataToDevice(
          params.kimlikdurumbilgisi.title,
          params.kimlikdurumbilgisi.getHex(PROCESS_KEYS.KimlikDogrulama, 0x00)
        );

        IStore.controlData = createIV();

        BLEService._this.sendDataToDevice(
          params.kimlikdogrulamasorgu.title,
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
          params.kimlikdurumbilgisi.title,
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

        // @ts-ignore
        BLEService.event.emit("monitor", {
          key,
          value: res,
          all_data: BLEService._this.getData(),
        });

        // @ts-ignore
        BLEService.event.emit(key, res);
        break;
    }

    cb(null, true);
  };
}
