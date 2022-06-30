
import * as React from "react";
import {useEffect, useState} from "react";
import {IStore} from "../stores/InstantStore";
import {MStore} from "../stores/MainStore";
import Colors from "../constants/Colors";
import {AngleUnitTypes, HomeScreenTypes} from "../constants/Config";
import {observer} from "mobx-react-lite";
import {Params} from "../constants/Params";
import {info} from "../functions/toast";
import {angleConversion, distanceConversion} from "../functions/Conversions";
import BLEService from "../services/BLEService";
import {useHistory} from "react-router-dom";
import Header from "../componenets/Header";
import {string} from "../locales";
import {ColumnHeightOutlined, ColumnWidthOutlined,ReloadOutlined} from "@ant-design/icons";
import { Swiper, SwiperSlide ,useSwiper} from 'swiper/react/swiper-react'
import { Navigation } from "swiper";


let _auto = false

function Compass({ navigation }) {
    const history = useHistory()
    const ble = IStore.ble
    const param = Params()

    const [distance,setDistance] = useState([])
    const [distance_unit,setDistanceUnit] = useState("--")
    const [angle_unit,setAngleUnit] = useState("--")
    const [azimuth,setAzimuth] = useState(0)
    const [elevation,setElevation] = useState(0)
    const [roll,setRoll] = useState(0)
    const [auto,setAuto] = useState(_auto)
    const [spinValue,setSpinValue] = useState(0)


    useEffect(()=>{

        _auto=false
        BLEService.event.on("distance_and_compass",_setData)
        controlDevice()



        return()=>{
            try {
                if(auto){
                    _auto=false
                    setAuto(false)
                }
            }catch (e) {

            }
            BLEService.event.removeListener("distance_and_compass",_setData)
        }
    },[])



    function _setData({distance,distance_unit,angle_unit,azimuth,elevation,roll}) {
        setDistance(distance)
        setDistanceUnit(distanceConversion(0,distance_unit,distance_unit).unit)
        setAngleUnit(angleConversion(0,angle_unit,angle_unit).unit)
        setAzimuth(azimuth)
        setElevation(elevation)
        setRoll(roll)

        setSpinValue(360-angleConversion(azimuth,angle_unit,AngleUnitTypes.Derece.id).angle)

        if(_auto){
            setTimeout(()=>{
                controlDevice()
            },2500)
        }
    }


    function controlDevice() {

        const device = ble.getDevice()

        if(device){
            getData()
        }else{
            history.push("select-device")
        }
    }

    async function getData() {
        if(!_auto)
            info("Atış Yapılıyor...")
        await ble.sendDataToDevice("distance_and_compass",param.distance_and_compass.getHex)

    }




    function DistanceView({distance,distance_unit,row=true}) {

        let len = distance.length

        return <div className={`flex ${row?'row':'column'}`} style={{width:'80%',alignItems:'center',justifyContent:'space-around'}}>
            {
                distance.map((val,index)=><div className="flex" key={index} style={{padding:"10px 0",textAlign:'center',color:Colors.text,fontWeight:'bold',fontSize:`${row?(len==3?4:len==2?5:len==1?6:0):6}vw`}}>{parseFloat(val.toString()).toFixed(2)+" "+distance_unit}</div>)
            }
        </div>

    }

  return (
      <div className="contain column">
          <div className="center" style={{width:'100%'}}>
              <Header
                  title={string.olcum2}
                  onBack={()=>{
                      history.goBack()
                  }}
              />
          </div>

          <div className="flex-1" style={{padding:20}}>
              <Swiper initialSlide={MStore.settings.home_screen_type}  navigation={true} modules={[Navigation]} style={{display:'flex',flex:1}}>
                  <SwiperSlide >
                      <div className={" flex-1 column"} style={{height:'100%', alignItems:'center'}} >
                          <div className="flex-3 center">
                              <div style={{position:'absolute', fontSize:'6vh',fontWeight:'bold',color:Colors.text}}>{azimuth+" "+angle_unit}</div>
                              <img src={require("../assets/images/compass.png").default} style={{height:'40vh',transform: `rotate(${spinValue}deg)`,transitionDuration:'1000ms'}}   />
                          </div>
                          <div className="flex-2 row  center" style={{width:'80%',alignItems:'center',justifyContent:'space-around'}}>
                              <div>
                                  <ColumnHeightOutlined style={{fontSize:'4vw',color:Colors.text}}/>
                                  <span style={{textAlign:'center',fontWeight:'bold',fontSize:'4vw',color:Colors.text}}>{elevation+""+angle_unit}</span>
                              </div>
                              <div>
                                  <ColumnWidthOutlined style={{fontSize:'4vw',color:Colors.text}}/>
                                  <span style={{textAlign:'center',fontWeight:'bold',fontSize:'4vw',color:Colors.text}}>{roll+""+angle_unit}</span>
                              </div>

                          </div>
                          <div className="flex-2  center" style={{width:'100%'}}>
                              <DistanceView distance={distance} distance_unit={distance_unit}/>
                          </div>

                          <div className="flex row  center" style={{ width:'50%',alignItems:'center',justifyContent:'space-around'}}>
                              <div
                                  onClick={()=>{
                                      if(!auto)
                                          controlDevice()
                                      _auto=!_auto
                                      setAuto(!auto)
                                  }}
                                  className="flex-1 center column"
                              >
                                  <ReloadOutlined style={{backgroundColor:Colors[auto?"green":"red"],fontSize:"3.5vh",color:Colors.white,padding:13,borderRadius:100}}/>
                                  <div style={{padding:2, fontSize:"1.3vh",color:Colors.white}}>
                                      {string.otomatikatis}
                                  </div>
                              </div>
                              {
                                  !auto?
                                      <div className="flex-1 center column" onClick={controlDevice} >
                                          <div className="flex center" style={{backgroundColor:Colors.primary,width:"6.5vh",height:"6.5vh",color:Colors.white,borderRadius:100}}>
                                              <img src={require("../assets/images/measure.png").default} style={{width:"3vh",height:"3vh"}}/>
                                          </div>
                                          <div style={{padding:2, fontSize:"1.3vh",color:Colors.white}}>
                                              {string.atisyap}
                                          </div>
                                      </div>:<div className="flex-1"/>
                              }

                          </div>
                      </div>
                  </SwiperSlide>
                  <SwiperSlide  >
                      <div className={" flex-1 column"} style={{height:'100%',alignItems:'center'}} >
                          <div className="flex-3 center">
                              <div style={{position:'absolute', fontSize:'6vh',fontWeight:'bold',color:Colors.text}}>{azimuth+" "+angle_unit}</div>
                              <img src={require("../assets/images/compass.png").default} style={{height:'40vh',transform: `rotate(${spinValue}deg)`,transitionDuration:'1000ms'}}   />
                          </div>
                          <div className="flex-2 row  center" style={{width:'80%',alignItems:'center',justifyContent:'space-around'}}>
                              <div>
                                  <ColumnHeightOutlined style={{fontSize:'4vw',color:Colors.text}}/>
                                  <span style={{textAlign:'center',fontWeight:'bold',fontSize:'4vw',color:Colors.text}}>{elevation+""+angle_unit}</span>
                              </div>
                              <div>
                                  <ColumnWidthOutlined style={{fontSize:'4vw',color:Colors.text}}/>
                                  <span style={{textAlign:'center',fontWeight:'bold',fontSize:'4vw',color:Colors.text}}>{roll+""+angle_unit}</span>
                              </div>

                          </div>

                          <div className="flex row  center" style={{ width:'50%',alignItems:'center',justifyContent:'space-around'}}>
                              <div
                                  onClick={()=>{
                                      if(!auto)
                                          controlDevice()
                                      _auto=!_auto
                                      setAuto(!auto)
                                  }}
                                  className="flex-1 center column"
                              >
                                  <ReloadOutlined style={{backgroundColor:Colors[auto?"green":"red"],fontSize:"3.5vh",color:Colors.white,padding:13,borderRadius:100}}/>
                                  <div style={{padding:2, fontSize:"1.3vh",color:Colors.white}}>
                                      {string.otomatikatis}
                                  </div>
                              </div>
                              {
                                  !auto?
                                      <div className="flex-1 center column" onClick={controlDevice} >
                                          <div className="flex center" style={{backgroundColor:Colors.primary,width:"6.5vh",height:"6.5vh",color:Colors.white,borderRadius:100}}>
                                              <img src={require("../assets/images/measure.png").default} style={{width:"3vh",height:"3vh"}}/>
                                          </div>
                                          <div style={{padding:2, fontSize:"1.3vh",color:Colors.white}}>
                                              {string.atisyap}
                                          </div>
                                      </div>:<div className="flex-1"/>
                              }

                          </div>
                      </div>
                  </SwiperSlide>
                  <SwiperSlide >
                      <div className={" flex-1 column"} style={{height:'100%', alignItems:'center'}} >

                          <div className="flex-2  center" style={{width:'100%'}}>
                              <DistanceView distance={distance} distance_unit={distance_unit} row={false}/>
                          </div>

                          <div className="flex row  center" style={{ width:'50%',alignItems:'center',justifyContent:'space-around'}}>
                              <div
                                  onClick={()=>{
                                      if(!auto)
                                          controlDevice()
                                      _auto=!_auto
                                      setAuto(!auto)
                                  }}
                                  className="flex-1 center column"
                              >
                                  <ReloadOutlined style={{backgroundColor:Colors[auto?"green":"red"],fontSize:"3.5vh",color:Colors.white,padding:13,borderRadius:100}}/>
                                  <div style={{padding:2, fontSize:"1.3vh",color:Colors.white}}>
                                      {string.otomatikatis}
                                  </div>
                              </div>
                              {
                                  !auto?
                                      <div className="flex-1 center column" onClick={controlDevice} >
                                          <div className="flex center" style={{backgroundColor:Colors.primary,width:"6.5vh",height:"6.5vh",color:Colors.white,borderRadius:100}}>
                                              <img src={require("../assets/images/measure.png").default} style={{width:"3vh",height:"3vh"}}/>
                                          </div>
                                          <div style={{padding:2, fontSize:"1.3vh",color:Colors.white}}>
                                              {string.atisyap}
                                          </div>
                                      </div>:<div className="flex-1"/>
                              }

                          </div>
                      </div>
                  </SwiperSlide>
              </Swiper>
          </div>

      </div>
  );
}
export default observer(Compass)