//@ts-nocheck
import * as React from "react";
import { CView } from "../components/CView";
import {hp} from "../functions/responsiveScreen";
import {Container, Content, Spinner} from "native-base";
import Colors from "../constants/Colors";
import {Params} from "../constants/Params";
import {useEffect, useState} from "react";
import {IStore} from "../stores/InstantStore";
import {error, success} from "../functions/toast";
import {string} from "../locales";
import {FontText} from "../components/FontText";
import {CButton} from "../components/CButton";
import {MainStore} from "../stores/MainStore";
import BLEService from "../services/BLEService";
import {ActivityIndicator} from "react-native";


function ConnectDevice({ navigation }: any) {
    const ble = IStore.ble;

    const [is_bluetooth,setIsBluetooth] = useState(true)
    const [devices,setDevices] = useState([])
    const [loadingConnect,setLoadingConnect] = useState(false)

    useEffect(()=>{
        getDevice()

        return()=>{
            ble.stopScanDevices()
        }
    },[])


    function getDevice() {
        setIsBluetooth(true)
        ble.scanDevices().then((scannedDevice)=>{
            devices.push(scannedDevice)
            setDevices([...devices])
        }).catch((e)=>{
            console.warn(e.message)
            if(e.errorCode=="102")
                setIsBluetooth(false)
            else
                error()
        })
    }

    function connectDevice(device) {


        setLoadingConnect(device.id)
        device.connect({autoConnect:true,timeout:15000})
            .then((device)=>{
                return  device.discoverAllServicesAndCharacteristics()
            })
            .then((device)=>{

                setLoadingConnect(false)
                MainStore.setDevice(device)
                ble.setDevice(device)
                success()
                navigation.pop()

            })
            .catch((e)=>{
                setLoadingConnect(false)
                error(e.message)
            })
    }

    if(!is_bluetooth){
        return (
            <CView flex={1} center color="darkGray">
                <FontText position="center" padding="2" title={"102"} size={2} />
                <CButton
                    title="tekrardene"
                    onPress={()=>{
                        getDevice()
                    }}

                />
            </CView>
        )
    }

    if(!Array.isArray(devices) || !devices.length){
        return (
            <CView flex={1} center color="darkGray">
                <Spinner color={Colors.white} />
            </CView>
        )
    }

    return (
        <Container style={{backgroundColor:Colors.darkGray}} >
            <CView row vertical={"center"} horizontal="flex-start" padding="0 2">
                <Spinner color={Colors.gray} size="small"/>
            </CView>
            <Content>
                {
                    devices.map((device,index)=>{
                        return(
                            <CView
                                key={index}
                                {
                                    ...!loadingConnect?{
                                        onPress:()=>{
                                            connectDevice(device)
                                        }
                                    }:{}
                                }
                                row width="100%" vertical="center" horizontal="space-between" padding="2"
                            >
                                <FontText title={device.name??device.id} size={1.8} />
                                {
                                    device.id==loadingConnect?
                                        <ActivityIndicator color={Colors.text} />:null
                                }
                            </CView>

                        )
                    })
                }
            </Content>
        </Container>
    );
}


export default ConnectDevice