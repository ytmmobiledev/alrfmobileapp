import {
  AngleUnitTypes,
  ArticleMode,
  BluetoothSleepTime,
  DeviceSleepTime,
  Language,
  NightVisionMode,
  UnitTypes
} from "./Config";
import {IStore} from "../stores/InstantStore";
import {setModalTypes} from "../components/SetModal";

export const Params = ()=>{
  const ble = IStore.ble;

  return {
    serial_no:{
      title:"serino",
      get: ble.getSerialNo
    },
    device_version:{
      title:"cihazversiyonu",
      get: ble.getDeviceVersion
    },
    temperature:{
      title:"sicaklik",
      get: ble.getTemperature
    },
    statuses:{
      title:"cihazdurumbilgisi",
      get: ble.getStatuses
    },
    unit_type:{
      title:"mesafeolcubirimi",
      options:UnitTypes,
      type:setModalTypes.Select,
      get: ble.getDistanceUnit,
      set: ble.setDistanceUnit
    },
    article_modes:{
      title:"artikilmodu",
      options:ArticleMode,
      type:setModalTypes.Select,
      get: ble.getArticalMode,
      set: ble.setArticalMode
    },
    language:{
      title:"dilsecimi",
      options:Language,
      type:setModalTypes.Select,
      get: ble.getLanguage,
      set: ble.setLanguage
    },
    angle_unit_type:{
      title:"aciolcubirimi",
      options:AngleUnitTypes,
      type:setModalTypes.Select,
      get: ble.getAngleUnitType,
      set: ble.setAngleUnitType
    },
    night_vision_mode:{
      title:"gecegorusmodu",
      options:NightVisionMode,
      type:setModalTypes.Select,
      get: ble.getNightVisionMode,
      set: ble.setNightVisionMode
    },
    device_sleep_time:{
      title:"cihazkapanmasuresi",
      options:DeviceSleepTime,
      type:setModalTypes.Select,
      get: ble.getDeviceSleepTime,
      set: ble.setDeviceSleepTime
    },
    bluetooth_sleep_time:{
      title:"bluetoothzamanasimisuresi",
      options:BluetoothSleepTime,
      type:setModalTypes.Select,
      get: ble.getBluetoothSleepTime,
      set: ble.setBluetoothSleepTime
    },
    lower_door_lock:{
      title:"altkapikilidi",
      type:setModalTypes.Number,
      get: ble.getLowerDoorLock,
      set: ble.setLowerDoorLock
    },
    top_door_lock:{
      title:"ustkapikilidi",
      type:setModalTypes.Number,
      get: ble.getTopDoorLock,
      set: ble.setTopDoorLock
    },
    magnetic_declination_angle:{
      title:"manyetiksapmaacisi",
      type:setModalTypes.Number,
      get: ble.getMagneticDeclinationAngle,
      set: ble.setMagneticDeclinationAngle
    },

  }
}