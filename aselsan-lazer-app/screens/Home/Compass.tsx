
import * as React from "react";
import { CView } from "../../components/CView";
import {CImage} from "../../components/CImage";
import {FontText} from "../../components/FontText";
import {hp, wp} from "../../functions/responsiveScreen";
import {Animated, Easing, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {randomIntFromInterval} from "../../functions/numberControl";
import {IStore} from "../../stores/InstantStore";
import Swiper from 'react-native-swiper'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import {HomeScreenTypes} from "../../constants/Config";
import {MainStore} from "../../stores/MainStore";
import {observer} from "mobx-react-lite";

const inputRange = new Array(360).fill(0).map((_:any,index:any)=>index)
const outputRange = inputRange.map((index:any)=>index+"deg")
let compass_interval:any;
function Compass({ navigation }: any) {
    const ble = IStore.ble


    const [distance,setDistance] = useState(0)
    const [azimuth,setAzimuth] = useState(0)
    const [elevation,setElevation] = useState(0)
    const [roll,setRoll] = useState(0)

    const spinValue = useState(new Animated.Value(0))[0];

    useEffect(()=>{

        if(compass_interval){
            clearInterval(compass_interval)
            compass_interval = null
        }

        getData()
        compass_interval = setInterval(()=>{
            getData()
        },3000)

        return()=>{
            if(compass_interval){
                clearInterval(compass_interval)
                compass_interval = null
            }
        }

    },[])


    function getData() {

        ble.getDistanceAndDegree().then(({distance,azimuth,elevation,roll}:any)=>{
            azimuth = randomIntFromInterval(0,360)
            setDistance(randomIntFromInterval(100,5000)/1000)
            setAzimuth(azimuth)
            setElevation(randomIntFromInterval(0,90))
            setRoll(randomIntFromInterval(0,90))

            Animated.timing(
                spinValue,
                {
                    toValue: 360-azimuth,
                    duration: 500,
                    easing: Easing.linear, // Easing is an additional import from react-native
                    useNativeDriver: true  // To make use of native driver for performance
                }
            ).start(()=>{

            })


        })
    }


    const spin = spinValue.interpolate({
        inputRange,
        outputRange
    })



  return (
      <Swiper index={MainStore.settings.home_screen_type} showsButtons loop={false} autoplay={false} >
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
                      <FontText  title={azimuth+"°"} bold size={5} />
                  </CView>
              </CView>
              <FontText padding="4" title={parseFloat(distance.toString()).toFixed(2)+" km"} bold size={6} />
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
                      <FontText  title={azimuth+"°"} bold size={5} />
                  </CView>
              </CView>
              <CView width="100%" padding="2 2 5 2" row vertical="center" horizontal="space-around">
                  <CView row center   >
                      <MaterialCommunityIcons name="arrow-expand-vertical" size={hp(3.5)} color={Colors.text} />
                      <FontText title={elevation+"°"} bold size={3} />
                  </CView>
                  <CView row center >
                      <MaterialCommunityIcons name="arrow-expand-horizontal" size={hp(3.5)} color={Colors.text} />
                      <FontText title={roll+"°"} bold size={3} />
                  </CView>

              </CView>
          </CView>
          <CView key={HomeScreenTypes.Mesafe.id} center color={"darkGray"} vertical="center"  flex={1}>

              <FontText padding="4" title={parseFloat(distance.toString()).toFixed(2)+" km"} bold size={8} />
          </CView>
      </Swiper>
  );
}
export default observer(Compass)