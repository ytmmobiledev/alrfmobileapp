//@ts-nocheck
import * as React from "react";
import {useEffect, useState} from "react";
import {CView} from "../../components/CView";
import {FontText} from "../../components/FontText";
import {hp} from "../../functions/responsiveScreen";
import {Container, Content, Spinner} from "native-base";
import Colors from "../../constants/Colors";
import {observer} from "mobx-react-lite";
import {findType} from "../../constants/Config";
import {MaterialIcons} from "@expo/vector-icons";
import {IStore} from "../../stores/InstantStore";
import {Params} from "../../constants/Params";
import {ActivityIndicator, DeviceEventEmitter} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {CButton} from "../../components/CButton";

function Settings({ navigation }: any) {
    const ble = IStore.ble;
    const params = Params()
    const usage_params = {
        distance_unit : params.distance_unit,
        article_mode : params.article_mode,
        language : params.language,
        angle_unit_type : params.angle_unit_type,
        night_vision_mode : params.night_vision_mode,
        device_sleep_time : params.device_sleep_time,
        bluetooth_sleep_time : params.bluetooth_sleep_time,
        bottom_door_lock : params.bottom_door_lock,
        top_door_lock : params.top_door_lock,
        magnetic_declination_angle : params.magnetic_declination_angle
    }


    const [data,setData] = useState(ble.getData())
    const [device_id,setDeviceID] = useState("loading")


    useFocusEffect(
        React.useCallback(() => {
            let listener = DeviceEventEmitter.addListener("monitor",({all_data})=>{
                setData({...all_data})
            })
            controlDevice()
            return()=>{
                listener.remove()
            }

        }, [])
    );


    async function controlDevice() {
        const device_id = ble.getDeviceID()
        setDeviceID(device_id)

        if(device_id){
            await getValues()
        }else{
            navigation.navigate("ConnectDevice")
        }

    }

    async function getValues() {
        for(let [key,param] of Object.entries(usage_params)){
            if(param.getHex)
                await ble.sendDataToDevice(key,param.getHex)
        }
    }

    if(!device_id){
        return (
            <CView flex={1} center color="darkGray">
                <FontText position="center" padding="2" title={"101"} size={2} />
                <CButton
                    title="simdibaglan"
                    onPress={()=>{
                        navigation.navigate("ConnectDevice")
                    }}

                />
            </CView>
        )
    }

    return (
        <Container style={{backgroundColor:Colors.darkGray}} >
            <Content bounces={false}>
                <CView style={{flex:1}}  center  vertical="center" flex={1}>
                    <FontText flex={1} title={"LOGO"} size={3.5} bold padding={"0 0 4 0"}/>

                    <CView padding="3"  width="100%" row vertical="center" horizontal="space-between">
                        <FontText title={"ayarlar"} size={2.2} bold color="primary"/>

                    </CView>
                    <CView padding="0.5" width="90%" radius={10} >
                        {
                            Object.entries(usage_params).map(([key,{title,setHex=(id:number)=>{},options,type,numberParams={}}]:any,index:number)=>{
                                const value = data[key]

                                return (
                                    <CView
                                        key={index} row vertical="center" horizontal="space-between" padding="1"  margin="1 0" radius={10} color="secondary"
                                        onPress={()=>{
                                            if(value){
                                                
                                                IStore.setSetModal({
                                                    visible:true,
                                                    title,
                                                    value:value?.id??value,
                                                    type,
                                                    numberParams,
                                                    options:options?Object.values(options):null,
                                                    onChange:async (id:number)=>{
                                                        await ble.sendDataToDevice(key,setHex(id))
                                                        return true;
                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        <FontText title={title} size={1.7} bold/>
                                        <CView row center>
                                            {
                                                value?
                                                    <FontText padding="1" title={value?.value?? (numberParams?.fixed?(value/(numberParams?.fixed*10)):value) +""+ (numberParams?.unit?(" "+numberParams?.unit):"")}  size={1.7} />:
                                                    <ActivityIndicator style={{alignSelf:'flex-start',padding:hp(1)}} color="#667587" size="small"  />
                                            }
                                            <MaterialIcons name="navigate-next" size={hp(4)} color={Colors.text} />
                                        </CView>
                                    </CView>
                                )
                            })
                        }
                    </CView>

                    <CView height={hp(13)}/>
                </CView>
            </Content>
        </Container>
    );
}




export default observer(Settings)