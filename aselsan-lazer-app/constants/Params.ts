import {
  AngleUnitTypes,
  ArticleMode,
  BluetoothSleepTime,
  DeviceSleepTime, DistanceUnitTypes,
  Language,
  NightVisionMode
} from "./Config";
import {IStore} from "../stores/InstantStore";
import {setModalTypes} from "../components/SetModal";
import {string} from "../locales";

declare global {
  interface Array<T> {
    checksum(data:any): Array<T>;
  }
}


export const PROCESS_KEYS={
  DurumBilgisi:0x10,
  Versiyon:0x11,
  Mesafe:0x12,
  CIT:0x13,
  AltKapiLimitiYaz:0x14,
  AltKapiLimiti:0x15,
  UstKapiLimitiYaz:0x16,
  UstKapiLimiti:0x17,
  ArtikilYaz:0x18,
  Artikil:0x19,
  DilYaz:0x1A,
  Dil:0x1B,
  Pusula:0x1C,
  MesafeVePusula:0x1D,
  Sicaklik:0x1E,
  AciOlcuBirimiYaz:0x1F,
  AciOlcuBirimi:0x20,
  MesafeOlcuBirimiYaz:0x21,
  MesafeOlcuBirimi:0x22,
  GeceGorusYaz:0x23,
  GeceGorus:0x24,
  CihazKapanmaSuresiYaz:0x25,
  CihazKapanmaSuresi:0x26,
  BluetoothKapanmaSuresiYaz:0x29,
  BluetoothKapanmaSuresi:0x2A,
  ManyetikSapmaAcisiYaz:0x2B,
  ManyetikSapmaAcisi:0x2C,
  SeriNo:0x51,
  Sayac:0x53,
  Basinc:0x68,
}

Array.prototype.checksum = function(data:number){
  return checkSum([...this,...intToBytes(data)])
}


function intToBytes(x:number) {
  return [(x<<16),(x<<24)].map(z=> z>>>24)
}

function checkSum(bytes:any) {
  let checksum = 0x00
  for(let i = 0; i < bytes.length; i++)
    checksum += (bytes[i] & 0xFF)

  checksum = ((~checksum + 1) & 0xFF);
  return [...bytes,checksum]
}

export const Params = ()=>{
  return {
    statuses:{
      title:"cihazdurumbilgisi",
      getHex:[0xA5,PROCESS_KEYS.DurumBilgisi].checksum(0)
    },
    device_version:{
      title:"cihazversiyonu",
      getHex:[0xA5,PROCESS_KEYS.Versiyon].checksum(0)
    },
    bottom_door_lock:{
      title:"altkapikilidi",
      type:setModalTypes.Number,
      numberParams:{fixed:0,min:0,max:15000,unit:string.metre2},
      setHex:((number:number)=>[0xA5,PROCESS_KEYS.AltKapiLimitiYaz].checksum(number)),
      getHex:[0xA5,PROCESS_KEYS.AltKapiLimiti].checksum(0)
    },
    top_door_lock:{
      title:"ustkapikilidi",
      type:setModalTypes.Number,
      numberParams:{fixed:0,min:0,max:5000,unit:string.metre2},
      setHex:((number:number)=>[0xA5,PROCESS_KEYS.UstKapiLimitiYaz].checksum(number)),
      getHex:[0xA5,PROCESS_KEYS.UstKapiLimiti].checksum(0)
    },
    article_mode:{
      title:"artikilmodu",
      options:ArticleMode,
      type:setModalTypes.Select,
      setHex:((id:number)=>[0xA5,PROCESS_KEYS.ArtikilYaz].checksum(id)),
      getHex:[0xA5,PROCESS_KEYS.Artikil].checksum(0)
    },
    language:{
      title:"dilsecimi",
      options:Language,
      type:setModalTypes.Select,
      setHex:((id:number)=>[0xA5,PROCESS_KEYS.DilYaz].checksum(id)),
      getHex:[0xA5,PROCESS_KEYS.Dil].checksum(0)
    },
    distance_and_compass:{
      title:"mesafevepusula",
      getHex:[0xA5,PROCESS_KEYS.MesafeVePusula].checksum(0)
    },
    temperature:{
      title:"sicaklik",
      getHex:[0xA5,PROCESS_KEYS.Sicaklik].checksum(0)
    },
    angle_unit_type:{
      title:"aciolcubirimi",
      options:AngleUnitTypes,
      type:setModalTypes.Select,
      setHex:((id:number)=>[0xA5,PROCESS_KEYS.AciOlcuBirimiYaz].checksum(id)),
      getHex:[0xA5,PROCESS_KEYS.AciOlcuBirimi].checksum(0)
    },
    distance_unit:{
      title:"mesafeolcubirimi",
      options:DistanceUnitTypes,
      type:setModalTypes.Select,
      setHex:((id:number)=>[0xA5,PROCESS_KEYS.MesafeOlcuBirimiYaz].checksum(id)),
      getHex:[0xA5,PROCESS_KEYS.MesafeOlcuBirimi].checksum(0)
    },
    night_vision_mode:{
      title:"gecegorusmodu",
      options:NightVisionMode,
      type:setModalTypes.Select,
      setHex:((id:number)=>[0xA5,PROCESS_KEYS.GeceGorusYaz].checksum(id)),
      getHex:[0xA5,PROCESS_KEYS.GeceGorus].checksum(0)
    },
    device_sleep_time:{
      title:"cihazkapanmasuresi",
      options:DeviceSleepTime,
      type:setModalTypes.Select,
      setHex:((id:number)=>[0xA5,PROCESS_KEYS.CihazKapanmaSuresiYaz].checksum(id)),
      getHex:[0xA5,PROCESS_KEYS.CihazKapanmaSuresi].checksum(0)
    },
    bluetooth_sleep_time:{
      title:"bluetoothzamanasimisuresi",
      options:BluetoothSleepTime,
      type:setModalTypes.Select,
      setHex:((id:number)=>[0xA5,PROCESS_KEYS.BluetoothKapanmaSuresiYaz].checksum(id)),
      getHex:[0xA5,PROCESS_KEYS.BluetoothKapanmaSuresi].checksum(0)
    },
    magnetic_declination_angle:{
      title:"manyetiksapmaacisi",
      type:setModalTypes.Number,
      numberParams:{fixed:1, min:-3599,max:3599,unit:string.derece},
      setHex:((number:number)=>[0xA5,PROCESS_KEYS.ManyetikSapmaAcisiYaz].checksum(number)),
      getHex:[0xA5,PROCESS_KEYS.ManyetikSapmaAcisi].checksum(0)
    },
    serial_no:{
      title:"serino",
      getHex:[0xA6,PROCESS_KEYS.SeriNo].checksum(0)
    },
    shot_counter:{
      title:"atissayaci",
      getHex:[0xA6,PROCESS_KEYS.Sayac].checksum(0)
    },
    pressure:{
      title:"basinc",
      getHex:[0xA6,PROCESS_KEYS.Basinc].checksum(0)
    },

  }
}