//@ts-nocheck
import * as React from "react";
import {useEffect, useState} from "react";
import {CView} from "../../components/CView";
import {FontText} from "../../components/FontText";
import {hp} from "../../functions/responsiveScreen";
import {Container, Content, Spinner} from "native-base";
import {ActivityIndicator} from "react-native";
import Colors from "../../constants/Colors";
import {observer} from "mobx-react-lite";
import DashedLine from "react-native-dashed-line";
import {Params} from "../../constants/Params";
import {IStore} from "../../stores/InstantStore";
import {string} from "../../locales";
import {CButton} from "../../components/CButton";
import {useFocusEffect} from "@react-navigation/native";


let info_interval = null

function Device({ navigation }: any) {
    const ble = IStore.ble;
    const params = Params()
    const [data,setData] = useState({
        serial_no : params.serial_no,
        device_version : params.device_version,
        temperature : params.temperature,
        statuses : params.statuses,
    })
    const [small_loading,setSmallLoading] = useState(false)
    const [device_id,setDeviceID] = useState("loading")

    useFocusEffect(
        React.useCallback(() => {
            setSmallLoading(true)

            controlDevice()
            if(info_interval){
                clearInterval(info_interval)
                info_interval=null
            }

            info_interval = setInterval(()=>{
                controlDevice()
            },2000)


            return()=>{
                if(info_interval){
                    clearInterval(info_interval)
                    info_interval=null
                }
            }
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
                    <CView padding="3"  width="100%" row vertical="center" horizontal="space-between">
                        <FontText title={"cihazdurumbilgisi"} size={2.2} bold color="primary"/>
                        {
                            small_loading?
                                <ActivityIndicator color={Colors.white} />:null
                        }
                    </CView>
                    <CView padding="1" width="80%" radius={10} color="secondary">
                        {
                            Object.values(data).map(({title,value},index:number)=>{
                                return (
                                    <CView key={index} margin="1" padding="1" style={{borderStyle:'dashed', borderWidth:1,borderRadius:1,borderColor:'#667587'}}>
                                        <FontText padding="1" title={title} size={1.8} bold/>
                                        <DashedLine dashLength={10} dashThickness={hp(0.05)} dashGap={0} dashColor={"#4c5f72"}  />
                                        <CView style={{minHeight:hp(5)}}>
                                            {
                                                value?
                                                    typeof value == "string"?
                                                    <FontText padding="1" title={value} size={1.8} bold/> :
                                                        Object.values(value).map(({title,value},index)=>(
                                                            <CView row vertical="center" horizontal="space-between" key={index}>
                                                                <FontText flex={2} position="left" padding="1" title={title} size={1.6} bold/>
                                                                <FontText flex={1} position="right" padding="1" title={value} size={1.6} bold/>
                                                            </CView>
                                                        ))
                                                        :
                                                    <ActivityIndicator style={{alignSelf:'flex-start',padding:hp(1)}} color="#667587" size="small"  />
                                            }
                                        </CView>
                                    </CView>
                                )
                            })
                        }
                    </CView>

                </CView>
                <CView height={hp(15)}/>
            </Content>
        </Container>
    );
}


export default observer(Device)