import {
  AngleUnitTypes,
  ArticleMode,
  BatteryErrorTypes,
  BluetoothActivityTypes, BluetoothErrorTypes, BluetoothSleepTime,
  CompassActivityTypes, CompassErrorTypes, DeviceSleepTime, findType, Language, NightVisionMode,
  OdometerActivityTypes,
  OdometerErrorTypes, UnitTypes
} from "../constants/Config";
import { BleManager,Device } from 'react-native-ble-plx';
import {error} from "../functions/toast";

const values = {
  serial_no:"342345",
  version:"2.25",
  temperature:"34.2",
  odometer_activity:OdometerActivityTypes.Acik.value,
  compass_activity:CompassActivityTypes.Kapali.value,
  bluetooth_activity:BluetoothActivityTypes.Kapali.value,
  odometer_error:OdometerErrorTypes.HataVar.value,
  compass_error:CompassErrorTypes.BilgiYok.value,
  bluetooth_error:BluetoothErrorTypes.HataYok.value,
  battery_error:BatteryErrorTypes.PilGucuIyi.value,
  distance_unit:UnitTypes.Metre.id,
  article_mode:ArticleMode.Otomatik.id,
  distance_and_compass:{
    distance:5,
    azimuth:170,
    elevation:50,
    roll:10
  },
  language:Language.Turkce.id,
  angle_unit_type:AngleUnitTypes.Derece.id,
  night_vision_mode:NightVisionMode.Kapali.id,
  device_sleep_time:DeviceSleepTime["0"].id,
  bluetooth_sleep_time:BluetoothSleepTime["0"].id,
  lower_door_lock:3234,
  top_door_lock:1234,
  magnetic_declination_angle:45
}


class BLEService {
  public static bleManager: BleManager;
  private static _this: BLEService;

  private device: Device|null = null;

  constructor() {

    BLEService.bleManager = new BleManager()
    BLEService._this = this
  }



  public async sendDataToDevice(data:string){
    let device = BLEService._this.getDevice();
    return new Promise((resolve, reject) => {
      device?.writeCharacteristicWithResponseForService("","",data).then((res)=>{
        resolve(res.value)
      }).catch((e:any)=>{
        reject(e)
        error()
      })
    })
  }

  public async scanDevices(){
    return new Promise((resolve, reject) => {
      BLEService.bleManager.startDeviceScan(null,{allowDuplicates: false},(error, scannedDevice)=>{
        if(error) {
          reject(error)
        }else{
          resolve(scannedDevice)
        }
      });
    })
  }

  public stopScanDevices(){
    BLEService.bleManager.stopDeviceScan();
  }


  public setDevice(device:Device|null){
    BLEService._this.device = device
  }
  public getDevice(){
    return BLEService._this.device
  }




  public async getSerialNo(){
    return new Promise((resolve, reject) => {
      BLEService._this.sendDataToDevice("data").then((res)=>{
        return values.serial_no
      })
    })


  }
  public async getDeviceVersion(){
    return values.version+"v"
  }
  public async getTemperature(){
    return values.temperature+"°"
  }
  public async getStatuses(){
    return {
      odometer_activity:{
        title:"lazermesafeolceraktifligi",
        value:values.odometer_activity
      },
      compass_activity:{
        title:"pusulaaktifligi",
        value:values.compass_activity
      },
      bluetooth_activity:{
        title:"bluetoothaktifligi",
        value:values.bluetooth_activity
      },
      odometer_error:{
        title:"lazermesafeolcerhatabilgisi",
        value:values.odometer_error
      },
      compass_error:{
        title:"pusulahatabilgisi",
        value:values.compass_error
      },
      bluetooth_error:{
        title:"bluetoothhatabilgisi",
        value:values.bluetooth_error
      },
      battery_error:{
        title:"bataryahatabilgisi",
        value:values.battery_error
      },

    }
  }
  public async getDistanceAndDegree(){
    return {
      ...values.distance_and_compass,
    }
  }


  public async getDistanceUnit(){
    return findType(UnitTypes,values.distance_unit,"value")
  }
  public async setDistanceUnit(id:number){
    values.distance_unit = id
    return await BLEService._this.getDistanceUnit()
  }

  public async getArticalMode(){
    return findType(ArticleMode,values.article_mode,"value")
  }
  public async setArticalMode(id:number){
    values.article_mode = id
    return await BLEService._this.getArticalMode()
  }

  public async getLanguage(){
    return findType(Language,values.language,"")
  }
  public async setLanguage(id:number){
    values.language = id
    return await BLEService._this.getLanguage()
  }

  public async getAngleUnitType(){
    return findType(AngleUnitTypes,values.angle_unit_type,"")
  }
  public async setAngleUnitType(id:number){
    values.angle_unit_type = id
    return await BLEService._this.getAngleUnitType()
  }

  public async getNightVisionMode(){
    return findType(NightVisionMode,values.night_vision_mode,"")
  }
  public async setNightVisionMode(id:number){
    values.night_vision_mode = id
    return await BLEService._this.getNightVisionMode()
  }

  public async getDeviceSleepTime(){
    return findType(DeviceSleepTime,values.device_sleep_time,"")
  }
  public async setDeviceSleepTime(id:number){
    values.device_sleep_time = id
    return await BLEService._this.getDeviceSleepTime()
  }

  public async getBluetoothSleepTime(){
    return findType(BluetoothSleepTime,values.bluetooth_sleep_time,"")
  }
  public async setBluetoothSleepTime(id:number){
    values.bluetooth_sleep_time = id
    return await BLEService._this.getBluetoothSleepTime()
  }

  public async getLowerDoorLock(){
    return values.lower_door_lock
  }
  public async setLowerDoorLock(value:number){
    values.lower_door_lock = value
    return await BLEService._this.getLowerDoorLock()
  }

  public async getTopDoorLock(){
    return values.top_door_lock
  }
  public async setTopDoorLock(value:number){
    values.top_door_lock = value
    return await BLEService._this.getTopDoorLock()
  }

  public async getMagneticDeclinationAngle(){
    return values.magnetic_declination_angle
  }
  public async setMagneticDeclinationAngle(value:number){
    values.magnetic_declination_angle = value
    return await BLEService._this.getMagneticDeclinationAngle()
  }
}

export default BLEService;
