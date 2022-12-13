import { PROCESS_KEYS } from "../constants/Params";
import { Base64ToHex } from "./Buffer";
import {
  AngleUnitTypes,
  ArticleMode,
  BatteryErrorTypes,
  BluetoothActivityTypes,
  BluetoothErrorTypes,
  BluetoothSleepTime,
  CompassActivityTypes,
  CompassErrorTypes,
  DeviceSleepTime,
  DistanceUnitTypes,
  findType,
  Language,
  NightVisionMode,
  OdometerActivityTypes,
  OdometerErrorTypes,
} from "../constants/Config";
import { IStore } from "../stores/InstantStore";
import { Alert } from "react-native";
import { string } from "../locales";

export function findData(value: any) {
  try {
    value = Base64ToHex(value);
    const command = value[1];

    switch (command) {
      case PROCESS_KEYS.SeriNo:
        return { key: "serial_no", value: findSerial(value) };
      case PROCESS_KEYS.Versiyon:
        return { key: "device_version", value: findVersion(value) };
      case PROCESS_KEYS.Sicaklik:
        return { key: "temperature", value: findTemperature(value) };
      case PROCESS_KEYS.Basinc:
        return { key: "pressure", value: findPressure(value) };
      case PROCESS_KEYS.Sayac:
        return { key: "shot_counter", value: findShotCounter(value) };
      case PROCESS_KEYS.DurumBilgisi:
        return { key: "statuses", value: findStatuses(value) };
      case PROCESS_KEYS.MesafeOlcuBirimi:
      case PROCESS_KEYS.MesafeOlcuBirimiYaz:
        return { key: "distance_unit", value: findDistanceUnit(value) };
      case PROCESS_KEYS.Artikil:
      case PROCESS_KEYS.ArtikilYaz:
        return { key: "article_mode", value: findArticleMode(value) };
      case PROCESS_KEYS.Dil:
      case PROCESS_KEYS.DilYaz:
        return { key: "language", value: findLanguage(value) };
      case PROCESS_KEYS.AciOlcuBirimi:
      case PROCESS_KEYS.AciOlcuBirimiYaz:
        return { key: "angle_unit_type", value: findAngleUnit(value) };
      case PROCESS_KEYS.GeceGorus:
      case PROCESS_KEYS.GeceGorusYaz:
        return { key: "night_vision_mode", value: findNightVisionMode(value) };
      case PROCESS_KEYS.CihazKapanmaSuresi:
      case PROCESS_KEYS.CihazKapanmaSuresiYaz:
        return { key: "device_sleep_time", value: findDeviceSleep(value) };
      case PROCESS_KEYS.BluetoothKapanmaSuresi:
      case PROCESS_KEYS.BluetoothKapanmaSuresiYaz:
        return {
          key: "bluetooth_sleep_time",
          value: findBluetoothSleep(value),
        };
      case PROCESS_KEYS.AltKapiLimiti:
      case PROCESS_KEYS.AltKapiLimitiYaz:
        return { key: "bottom_door_lock", value: findBottomDoorLock(value) };
      case PROCESS_KEYS.UstKapiLimiti:
      case PROCESS_KEYS.UstKapiLimitiYaz:
        return { key: "top_door_lock", value: findTopDoorLock(value) };
      case PROCESS_KEYS.ManyetikSapmaAcisi:
      case PROCESS_KEYS.ManyetikSapmaAcisiYaz:
        return {
          key: "magnetic_declination_angle",
          value: findMagneticDeclinationAngle(value),
        };
      case PROCESS_KEYS.MesafeVePusula:
        return {
          key: "distance_and_compass",
          value: findDistanceAndCompass(value),
        };
      default:
        return "Not Found";
    }
  } catch (e) {
    console.error(e, value);
    return "Error Data";
  }
}

function findSerial(value: any) {
  return ((value[2] << 8) | value[3]).toString();
}

function findVersion(value: any) {
  return value[2] + "." + value[3] + "v";
}

function findTemperature(value: any) {
  let data = (value[2] << 8) | value[3];
  if ((data & 0x8000) > 0) {
    data = data - 0x10000;
  }
  return data / 100 + "°";
}

function findPressure(value: any) {
  return ((value[2] << 8) | value[3]).toString();
}

function findShotCounter(value: any) {
  return (
    (value[2] << 24) |
    (value[3] << 16) |
    (value[4] << 8) |
    value[5]
  ).toString();
}

function findStatuses(value: any) {
  let status1_binary = value[2].toString(2);
  let status2_binary = value[3].toString(2);

  return {
    odometer_activity: {
      title: "lazermesafeolceraktifligi",
      value: findType(OdometerActivityTypes, status1_binary[2]),
    },
    compass_activity: {
      title: "pusulaaktifligi",
      value: findType(CompassActivityTypes, status1_binary[1]),
    },
    bluetooth_activity: {
      title: "bluetoothaktifligi",
      value: findType(BluetoothActivityTypes, status1_binary[0]),
    },
    odometer_error: {
      title: "lazermesafeolcerhatabilgisi",
      value: findType(
        OdometerErrorTypes,
        status2_binary[6] + "" + status2_binary[7]
      ),
    },
    compass_error: {
      title: "pusulahatabilgisi",
      value: findType(
        CompassErrorTypes,
        status2_binary[4] + "" + status2_binary[5]
      ),
    },
    bluetooth_error: {
      title: "bluetoothhatabilgisi",
      value: findType(
        BluetoothErrorTypes,
        status2_binary[2] + "" + status2_binary[3]
      ),
    },
    battery_error: {
      title: "bataryahatabilgisi",
      value: findType(
        BatteryErrorTypes,
        status2_binary[0] + "" + status2_binary[1]
      ),
    },
  };
}

function findDistanceUnit(value: any) {
  return findType(DistanceUnitTypes, value[3], "");
}

function findArticleMode(value: any) {
  return findType(ArticleMode, value[3], "");
}

function findLanguage(value: any) {
  return findType(Language, value[3], "");
}

function findAngleUnit(value: any) {
  return findType(AngleUnitTypes, value[3], "");
}

function findNightVisionMode(value: any) {
  return findType(NightVisionMode, value[3], "");
}

function findDeviceSleep(value: any) {
  return findType(DeviceSleepTime, value[3], "");
}

function findBluetoothSleep(value: any) {
  return findType(BluetoothSleepTime, value[3], "");
}

function findBottomDoorLock(value: any) {
  return ((value[2] << 8) | value[3]).toString();
}

function findTopDoorLock(value: any) {
  return ((value[2] << 8) | value[3]).toString();
}

export function angleDiffToast(angle: number) {
  if (IStore.decl !== null) {
    const diff = Math.abs(angle - IStore.decl);

    if (diff >= 0.5) {
      /*Alert.alert(
        "Manyetik Sapma Açısı",
        "Bulunduğunuz konumun manyetik sapma açısı cihaz içindekinden farklıdır. Manyetik sapma açısını güncellemek ister misiniz?",
        [
          {
            text: string["hayir"],
            style: "cancel",
          },
          {
            text: string["evet"],
            onPress: () => {
              console.log("OK Pressed");
              console.log(IStore.decl, angle);
            },
          },
        ],
        {
          cancelable: true,
        }
      );*/
    }
  }
}

function findMagneticDeclinationAngle(value: any) {
  let data = (value[2] << 8) | value[3];

  if ((data & 0x8000) > 0) {
    data = data - 0x10000;
  }

  const val = data.toString();

  const val1 = +val.substr(0, val.length - 1);
  const val2 = parseInt(val.substr(-1)) / 10;

  const angle = val1 + val2;

  angleDiffToast(angle);

  console.log("Magnetic Declination Angle", data, typeof data, data.toString());
  return data.toString();
}

function findDistanceAndCompass(value: any) {
  const distance_unit = findType(DistanceUnitTypes, value[2], "id");
  const distance1 = ((value[3] << 16) | (value[4] << 8) | value[5]) / 100;
  const distance2 = ((value[6] << 16) | (value[7] << 8) | value[8]) / 100;
  const distance3 = ((value[9] << 16) | (value[10] << 8) | value[11]) / 100;
  let distance = [
    ...(distance1 ? [distance1] : []),
    ...(distance2 ? [distance2] : []),
    ...(distance3 ? [distance3] : []),
  ];

  if (!Array.isArray(distance) || !distance.length) {
    distance = [0];
  }

  const angle_unit = findType(AngleUnitTypes, value[12], "id");
  let azimuth = (value[13] << 8) | value[14];
  let elevation = (value[15] << 8) | value[16];
  let roll = (value[17] << 8) | value[18];

  if ((azimuth & 0x8000) > 0) {
    azimuth = azimuth - 0x10000;
  }
  azimuth = azimuth / (angle_unit == AngleUnitTypes.Derece.id ? 10 : 1);

  if ((elevation & 0x8000) > 0) {
    elevation = elevation - 0x10000;
  }
  elevation = elevation / (angle_unit == AngleUnitTypes.Derece.id ? 10 : 1);

  if ((roll & 0x8000) > 0) {
    roll = roll - 0x10000;
  }
  roll = roll / (angle_unit == AngleUnitTypes.Derece.id ? 10 : 1);

  return {
    distance,
    distance_unit,
    angle_unit,
    azimuth,
    elevation,
    roll,
  };
}
