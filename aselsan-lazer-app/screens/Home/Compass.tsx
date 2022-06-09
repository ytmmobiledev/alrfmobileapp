
import * as React from "react";
import { CView } from "../../components/CView";
import {CImage} from "../../components/CImage";
import {FontText} from "../../components/FontText";
import {hp, wp} from "../../functions/responsiveScreen";
import {Animated, DeviceEventEmitter, Easing, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {IStore} from "../../stores/InstantStore";
import Swiper from 'react-native-swiper'
import { MaterialCommunityIcons,Feather } from '@expo/vector-icons';
import Colors from "../../constants/Colors";
import {AngleUnitTypes, HomeScreenTypes} from "../../constants/Config";
import {MainStore} from "../../stores/MainStore";
import {observer} from "mobx-react-lite";
import {useFocusEffect} from "@react-navigation/native";
import {Params} from "../../constants/Params";
import {info} from "../../functions/toast";
import {angleConversion, distanceConversion} from "../../functions/Conversions";
import {string} from "../../locales";


const inputRange = new Array(360).fill(0).map((_:any,index:any)=>index)
const outputRange = inputRange.map((index:any)=>index+"deg")

let _auto = false

function Compass({ navigation }: any) {
    const ble = IStore.ble
    const param = Params()

    const [distance,setDistance] = useState([])
    const [distance_unit,setDistanceUnit] = useState("--")
    const [angle_unit,setAngleUnit] = useState("--")
    const [azimuth,setAzimuth] = useState(0)
    const [elevation,setElevation] = useState(0)
    const [roll,setRoll] = useState(0)
    const [auto,setAuto] = useState(_auto)

    const spinValue = useState(new Animated.Value(0))[0];

    useFocusEffect(
        React.useCallback(() => {
            _auto=false
            let listener = DeviceEventEmitter.addListener("distance_and_compass",({distance,distance_unit,angle_unit,azimuth,elevation,roll}:any)=>{


                setDistance(distance)
                setDistanceUnit(distanceConversion(0,distance_unit,distance_unit).unit)
                setAngleUnit(angleConversion(0,angle_unit,angle_unit).unit)
                setAzimuth(azimuth)
                setElevation(elevation)
                setRoll(roll)


                Animated.timing(
                    spinValue,
                    {
                        toValue: 360-angleConversion(azimuth,angle_unit,AngleUnitTypes.Derece.id).angle,
                        duration: 1000,
                        easing: Easing.linear, // Easing is an additional import from react-native
                        useNativeDriver: true  // To make use of native driver for performance
                    }
                ).start(()=>{
                    if(_auto){
                        setTimeout(()=>{
                            controlDevice()
                        },1500)
                    }
                })
            })
            controlDevice()
            return()=>{
                try {
                    if(auto){
                        _auto=false
                        setAuto(false)
                    }
                }catch (e) {

                }
                listener.remove()
            }

        }, [])
    );


    function controlDevice() {

        const device_id = ble.getDeviceID()

        if(device_id){

            getData()
        }else{
            navigation.navigate("ConnectDevice")
        }
    }

    async function getData() {
        if(!_auto)
            info("Atış Yapılıyor...")
        await ble.sendDataToDevice("distance_and_compass",param.distance_and_compass.getHex)

    }


    const spin = spinValue.interpolate({
        inputRange,
        outputRange
    })


    function DistanceView({distance,distance_unit,row=true}:any) {
        return <CView style={{width:'80%'}} row={row} vertical="center" horizontal="space-around">
            {
                distance.map((val:any,index:number)=>
                    <CView  key={index} padding="4 0" center>
                        <FontText position="center" title={parseFloat(val.toString()).toFixed(2)+" "+distance_unit} bold size={6/(row?(distance.length*0.8):1)} />
                        {
                            distance.length>1?
                                <FontText bold title={string.mesafe2+" "+(index+1)} size={row?1.5:2.5} color="lightPrimary"/>:null
                        }
                    </CView>
                )
            }
        </CView>

    }

  return (
      <CView flex={1} color="darkGray">

          <Swiper paginationStyle={{bottom:-hp(6)}} index={MainStore.settings.home_screen_type} showsButtons loop={false} autoplay={false} >
              <CView key={HomeScreenTypes.MesafeVePusula.id} center color={"darkGray"} vertical="center"  flex={1}>
                  <CView>
                      <Animated.View
                          style={{transform: [{rotate: spin}] }}
                      >
                          <CImage
                              background source={require("../../assets/images/compass.png")}
                              resizeMode="contain" orgWidth={wp(80)} orgHeight={wp(80)}
                          />
                      </Animated.View>

                      <CView
                          style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              justifyContent: "center",
                              alignItems: "center",
                          }}
                      >
                          <FontText position="center" title={azimuth+""+angle_unit} bold size={5} />
                      </CView>
                  </CView>
                  <CView width="100%" padding="2 2 5 1" row vertical="center" horizontal="space-around">
                      <CView row center   >
                          <MaterialCommunityIcons name="arrow-expand-vertical" size={hp(3.5)} color={Colors.text} />
                          <FontText position="center" title={elevation+""+angle_unit} bold size={3} />
                      </CView>
                      <CView row center >
                          <MaterialCommunityIcons name="arrow-expand-horizontal" size={hp(3.5)} color={Colors.text} />
                          <FontText position="center" title={roll+""+angle_unit} bold size={3} />
                      </CView>
                  </CView>
                  <DistanceView distance={distance} distance_unit={distance_unit}/>
              </CView>
              <CView key={HomeScreenTypes.Pusula.id} center color={"darkGray"} vertical="center"  flex={1}>
                  <CView>
                      <Animated.View
                          style={{transform: [{rotate: spin}] }}
                      >
                          <CImage
                              background source={require("../../assets/images/compass.png")}
                              resizeMode="contain" orgWidth={wp(80)} orgHeight={wp(80)}
                          />
                      </Animated.View>

                      <CView
                          style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              justifyContent: "center",
                              alignItems: "center",
                          }}
                      >
                          <FontText position="center" title={azimuth+""+angle_unit} bold size={5} />
                      </CView>
                  </CView>
                  <CView width="100%" padding="2 2 5 2" row vertical="center" horizontal="space-around">
                      <CView row center   >
                          <MaterialCommunityIcons name="arrow-expand-vertical" size={hp(3.5)} color={Colors.text} />
                          <FontText position="center" title={elevation+""+angle_unit} bold size={3} />
                      </CView>
                      <CView row center >
                          <MaterialCommunityIcons name="arrow-expand-horizontal" size={hp(3.5)} color={Colors.text} />
                          <FontText position="center" title={roll+""+angle_unit} bold size={3} />
                      </CView>

                  </CView>
              </CView>
              <CView key={HomeScreenTypes.Mesafe.id} center color={"darkGray"} vertical="center"  flex={1}>

                  <DistanceView distance={distance} distance_unit={distance_unit} row={false}/>
              </CView>
          </Swiper>
          <CView flex={0.2} row padding="0 2" vertical="center" horizontal="space-between">

              <CView
                  center

              >
                  <CView
                      padding="1.5"
                      onPress={()=>{
                          if(!auto)
                              controlDevice()
                          _auto=!_auto
                          setAuto(!auto)

                      }}
                      radius={100}  center color={auto?"green":"red"}
                  >
                      <Feather name="refresh-cw" size={hp(3)} color={Colors.white} />
                  </CView>
                  <FontText padding="0.3" position="center" title={"otomatikatis"} size={1.2} color="white"  bold/>

              </CView>
              {
                  !auto?
                      <CView  center >

                          <CView
                              padding="1.5"
                              onPress={controlDevice}
                              radius={100}  center color="primary"
                          >

                              <CImage source={require("../../assets/images/measure.png")} resizeMode="contain" width={3.8} height={3.8} />
                          </CView>
                          <FontText padding="0.3" position="center" title={"atisyap"} size={1.2} color="white"  bold/>

                      </CView>:<CView/>
              }
          </CView>
      </CView>
  );
}
export default observer(Compass)