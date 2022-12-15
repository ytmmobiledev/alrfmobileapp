import {
  AngleUnitTypes,
  ArticleMode,
  BluetoothSleepTime,
  DeviceSleepTime,
  DistanceUnitTypes,
  Language,
  NightVisionMode,
} from "./Config";
import { setModalTypes } from "../components/SetModal";
import { string } from "../locales";
import { productId } from "../functions/AES";

declare global {
  interface Array<T> {
    checksum(data: any): Array<T>;
  }
}

export const PROCESS_KEYS = {
  KimlikDurumBilgisi: 0xa0,
  KimlikDogrulama: 0xa1,
  KimlikDogrulamaSorgu: 0xa2,
  KimlikDogrulamaSifreli: 0xa3,
  DurumBilgisi: 0x10,
  Versiyon: 0x11,
  Mesafe: 0x12,
  CIT: 0x13,
  AltKapiLimitiYaz: 0x14,
  AltKapiLimiti: 0x15,
  UstKapiLimitiYaz: 0x16,
  UstKapiLimiti: 0x17,
  ArtikilYaz: 0x18,
  Artikil: 0x19,
  DilYaz: 0x1a,
  Dil: 0x1b,
  Pusula: 0x1c,
  MesafeVePusula: 0x1d,
  Sicaklik: 0x1e,
  AciOlcuBirimiYaz: 0x1f,
  AciOlcuBirimi: 0x20,
  MesafeOlcuBirimiYaz: 0x21,
  MesafeOlcuBirimi: 0x22,
  GeceGorusYaz: 0x23,
  GeceGorus: 0x24,
  CihazKapanmaSuresiYaz: 0x25,
  CihazKapanmaSuresi: 0x26,
  BluetoothKapanmaSuresiYaz: 0x29,
  BluetoothKapanmaSuresi: 0x2a,
  ManyetikSapmaAcisiYaz: 0x2b,
  ManyetikSapmaAcisi: 0x2c,
  SeriNo: 0x51,
  Sayac: 0x53,
  Basinc: 0x68,
};

export const PROCESS_KEYS_LENGTH = {
  KimlikDurumBilgisi: {
    key: 0xa0,
    length: 5,
  },
  KimlikDogrulama: {
    key: 0xa1,
    length: 5,
  },
  KimlikDogrulamaSorgu: {
    key: 0xa2,
    length: 19,
  },
  KimlikDogrulamaSifreli: {
    key: 0xa3,
    length: 39,
  },
  DurumBilgisi: {
    key: 0x10,
    length: 5,
  },
  Versiyon: {
    key: 0x11,
    length: 5,
  },
  Mesafe: {
    key: 0x12,
    length: 13,
  },
  CIT: {
    key: 0x13,
    length: 5,
  },
  AltKapiLimitiYaz: {
    key: 0x14,
    length: 5,
  },
  AltKapiLimiti: {
    key: 0x15,
    length: 5,
  },
  UstKapiLimitiYaz: {
    key: 0x16,
    length: 5,
  },
  UstKapiLimiti: {
    key: 0x17,
    length: 5,
  },
  ArtikilYaz: {
    key: 0x18,
    length: 5,
  },
  Artikil: {
    key: 0x19,
    length: 5,
  },
  DilYaz: {
    key: 0x1a,
    length: 5,
  },
  Dil: {
    key: 0x1b,
    length: 5,
  },
  Pusula: {
    key: 0x1c,
    length: 10,
  },
  MesafeVePusula: {
    key: 0x1d,
    length: 20,
  },
  Sicaklik: {
    key: 0x1e,
    length: 5,
  },
  AciOlcuBirimiYaz: {
    key: 0x1f,
    length: 5,
  },
  AciOlcuBirimi: {
    key: 0x20,
    length: 5,
  },
  MesafeOlcuBirimiYaz: {
    key: 0x21,
    length: 5,
  },
  MesafeOlcuBirimi: {
    key: 0x22,
    length: 5,
  },
  GeceGorusYaz: {
    key: 0x23,
    length: 5,
  },
  GeceGorus: {
    key: 0x24,
    length: 5,
  },
  CihazKapanmaSuresiYaz: {
    key: 0x25,
    length: 5,
  },
  CihazKapanmaSuresi: {
    key: 0x26,
    length: 5,
  },
  BluetoothKapanmaSuresiYaz: {
    key: 0x29,
    length: 5,
  },
  BluetoothKapanmaSuresi: {
    key: 0x2a,
    length: 5,
  },
  ManyetikSapmaAcisiYaz: {
    key: 0x2b,
    length: 5,
  },
  ManyetikSapmaAcisi: {
    key: 0x2c,
    length: 5,
  },
  SeriNo: {
    key: 0x51,
    length: 5,
  },
  Sayac: {
    key: 0x53,
    length: 7,
  },
  Basinc: {
    key: 0x68,
    length: 7,
  },
};

Array.prototype.checksum = function (data: number) {
  return checkSum([...this, ...intToBytes(data)]);
};

function intToBytes(x: number) {
  return [x << 16, x << 24].map((z) => z >>> 24);
}

function checkSum(bytes: any) {
  let checksum = 0x00;
  for (let i = 0; i < bytes.length; i++) checksum += bytes[i] & 0xff;

  checksum = (~checksum + 1) & 0xff;
  return [...bytes, checksum];
}

export const Params = () => {
  return {
    kimlikdogrulama: {
      title: "kimlikdogrulama",
      getHex: checkSum([0xa8, PROCESS_KEYS.KimlikDogrulama, 0x00, 0x00]),
    },
    kimlikdurumbilgisi: {
      title: "durumbilgisi",
      getHex: (cevapVerilenKomut: number, durumBilgisi: number) =>
        checkSum([
          0xa8,
          PROCESS_KEYS.KimlikDurumBilgisi,
          cevapVerilenKomut,
          durumBilgisi,
        ]),
    },
    kimlikdogrulamasorgu: {
      title: "kimlikdogrulamasorgu",
      getHex: (dogrulamaVerisi: Uint8Array) =>
        checkSum([0xa8, PROCESS_KEYS.KimlikDogrulamaSorgu, ...dogrulamaVerisi]),
    },
    kimlikdogrulamasorgususifreli: {
      title: "kimlikdogrulamasorgususifreli",
      getHex: (iv: Uint8Array, sifrelenmisDogrulamaVerisi: Uint8Array) =>
        checkSum([
          0xa8,
          PROCESS_KEYS.KimlikDogrulamaSifreli,
          ...iv,
          ...sifrelenmisDogrulamaVerisi,
          ...productId,
        ]),
    },
    statuses: {
      title: "cihazdurumbilgisi",
      getHex: [0xa5, PROCESS_KEYS.DurumBilgisi].checksum(0),
    },
    device_version: {
      title: "cihazversiyonu",
      getHex: [0xa5, PROCESS_KEYS.Versiyon].checksum(0),
    },
    bottom_door_lock: {
      title: "altkapikilidi",
      type: setModalTypes.Number,
      numberParams: { fixed: 0, min: 0, max: 15000, unit: string.metre2 },
      setHex: (number: number) =>
        [0xa5, PROCESS_KEYS.AltKapiLimitiYaz].checksum(number),
      getHex: [0xa5, PROCESS_KEYS.AltKapiLimiti].checksum(0),
    },
    top_door_lock: {
      title: "ustkapikilidi",
      type: setModalTypes.Number,
      numberParams: { fixed: 0, min: 0, max: 5000, unit: string.metre2 },
      setHex: (number: number) =>
        [0xa5, PROCESS_KEYS.UstKapiLimitiYaz].checksum(number),
      getHex: [0xa5, PROCESS_KEYS.UstKapiLimiti].checksum(0),
    },
    article_mode: {
      title: "artikilmodu",
      options: ArticleMode,
      type: setModalTypes.Select,
      setHex: (id: number) => [0xa5, PROCESS_KEYS.ArtikilYaz].checksum(id),
      getHex: [0xa5, PROCESS_KEYS.Artikil].checksum(0),
    },
    language: {
      title: "dilsecimi",
      options: Language,
      type: setModalTypes.Select,
      setHex: (id: number) => [0xa5, PROCESS_KEYS.DilYaz].checksum(id),
      getHex: [0xa5, PROCESS_KEYS.Dil].checksum(0),
    },
    distance_and_compass: {
      title: "mesafevepusula",
      getHex: [0xa5, PROCESS_KEYS.MesafeVePusula].checksum(0),
    },
    temperature: {
      title: "sicaklik",
      getHex: [0xa5, PROCESS_KEYS.Sicaklik].checksum(0),
    },
    angle_unit_type: {
      title: "aciolcubirimi",
      options: AngleUnitTypes,
      type: setModalTypes.Select,
      setHex: (id: number) =>
        [0xa5, PROCESS_KEYS.AciOlcuBirimiYaz].checksum(id),
      getHex: [0xa5, PROCESS_KEYS.AciOlcuBirimi].checksum(0),
    },
    distance_unit: {
      title: "mesafeolcubirimi",
      options: DistanceUnitTypes,
      type: setModalTypes.Select,
      setHex: (id: number) =>
        [0xa5, PROCESS_KEYS.MesafeOlcuBirimiYaz].checksum(id),
      getHex: [0xa5, PROCESS_KEYS.MesafeOlcuBirimi].checksum(0),
    },
    night_vision_mode: {
      title: "gecegorusmodu",
      options: NightVisionMode,
      type: setModalTypes.Select,
      setHex: (id: number) => [0xa5, PROCESS_KEYS.GeceGorusYaz].checksum(id),
      getHex: [0xa5, PROCESS_KEYS.GeceGorus].checksum(0),
    },
    device_sleep_time: {
      title: "cihazkapanmasuresi",
      options: DeviceSleepTime,
      type: setModalTypes.Select,
      setHex: (id: number) =>
        [0xa5, PROCESS_KEYS.CihazKapanmaSuresiYaz].checksum(id),
      getHex: [0xa5, PROCESS_KEYS.CihazKapanmaSuresi].checksum(0),
    },
    bluetooth_sleep_time: {
      title: "bluetoothzamanasimisuresi",
      options: BluetoothSleepTime,
      type: setModalTypes.Select,
      setHex: (id: number) =>
        [0xa5, PROCESS_KEYS.BluetoothKapanmaSuresiYaz].checksum(id),
      getHex: [0xa5, PROCESS_KEYS.BluetoothKapanmaSuresi].checksum(0),
    },
    magnetic_declination_angle: {
      title: "manyetiksapmaacisi",
      type: setModalTypes.Number,
      numberParams: { fixed: 1, min: -3599, max: 3599, unit: string.derece },
      setHex: (number: number) =>
        [0xa5, PROCESS_KEYS.ManyetikSapmaAcisiYaz].checksum(number),
      getHex: [0xa5, PROCESS_KEYS.ManyetikSapmaAcisi].checksum(0),
    },
    serial_no: {
      title: "serino",
      getHex: [0xa6, PROCESS_KEYS.SeriNo].checksum(0),
    },
    shot_counter: {
      title: "atissayaci",
      getHex: [0xa6, PROCESS_KEYS.Sayac].checksum(0),
    },
    pressure: {
      title: "basinc",
      getHex: [0xa6, PROCESS_KEYS.Basinc].checksum(0),
    },
  };
};
