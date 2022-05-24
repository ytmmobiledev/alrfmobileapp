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
import {ActivityIndicator} from "react-native";
import {useFocusEffect} from "@react-navigation/native";
import {CButton} from "../../components/CButton";


function Settings({ navigation }: any) {
    const ble = IStore.ble
    const params = Params()
    const [data,setData] = useState({
        unit_type : params.unit_type,
        article_modes : params.article_modes,
        language : params.language,
        angle_unit_type : params.angle_unit_type,
        night_vision_mode : params.night_vision_mode,
        device_sleep_time : params.device_sleep_time,
        bluetooth_sleep_time : params.bluetooth_sleep_time,
        lower_door_lock : params.lower_door_lock,
        top_door_lock : params.top_door_lock,
        magnetic_declination_angle : params.magnetic_declination_angle,
    })
    const [small_loading,setSmallLoading] = useState(false)
    const [device_id,setDeviceID] = useState("loading")


    useFocusEffect(
        React.useCallback(() => {
            setSmallLoading(true)
            controlDevice()
        }, [])
    );


    function controlDevice() {
        const device = ble.getDevice();
        setDeviceID(device?.id)

        if(device?.id){
            getValues().then(()=>{
                setTimeout(()=>{
                    setSmallLoading(false)
                },2000)
            })
        }
    }

    async function getValues() {

        return new Promise(async (resolve, reject)=>{
            for(let [key,param] of Object.entries(data)){
                param["value"] = await param.get()
                setData({...data,[key]:param})
            }
            resolve(true)
        })
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

    if(device_id=="loading"){
        return (
            <CView flex={1} center color="darkGray">
                <Spinner color={Colors.white} />
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
                        {
                            small_loading?
                                <ActivityIndicator color={Colors.white} />:null
                        }
                    </CView>
                    <CView padding="0.5" width="90%" radius={10} >
                        {
                            Object.entries(data).map(([key,{set,title,value,options,type}],index:number)=>{
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
                                                    options:options?Object.values(options):null,
                                                    onChange:async (id)=>{

                                                        const res:any = await set(id)
                                                        if(res?.id){
                                                            let value = findType(options,res.id,"");
                                                            if(!value)
                                                                return;
                                                            data[key]["value"] = value
                                                            setData({...data})
                                                        }else{
                                                            let value =res
                                                            if(!value)
                                                                return;
                                                            data[key]["value"] = value
                                                            setData({...data})
                                                        }



                                                        return true

                                                    }
                                                })
                                            }
                                        }}
                                    >
                                        <FontText title={title} size={1.7} bold/>
                                        <CView row center>
                                            {
                                                value?
                                                    <FontText padding="1" title={value?.value??value}  size={1.7} />:
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