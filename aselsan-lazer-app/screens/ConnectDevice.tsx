//@ts-nocheck
import * as React from "react";
import {useEffect, useState} from "react";
import {CView} from "../components/CView";
import {Container, Content, Spinner} from "native-base";
import Colors from "../constants/Colors";
import {IStore} from "../stores/InstantStore";
import {error, info, success} from "../functions/toast";
import {FontText} from "../components/FontText";
import {CButton} from "../components/CButton";
import BLEService from "../services/BLEService";
import {ActivityIndicator, TouchableOpacity, View} from "react-native";
import {l_moment} from "../functions/cMoment";
import * as Location from "expo-location";
import {hp} from "../functions/responsiveScreen";
import {useFocusEffect} from "@react-navigation/native";
let _devices = []

let device_interval = null;

function ConnectDevice({ navigation }: any) {

    const [is_bluetooth,setIsBluetooth] = useState(true)
    const [devices,setDevices] = useState([])
    const [loadingConnect,setLoadingConnect] = useState(false)


    useFocusEffect(
        React.useCallback(() => {
            locationPermission().then()

            return()=>{
                stopScan()
            }
        }, [])
    );

    async function locationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert("Konum Eişimine İzin Vermelisiniz");
            return;
        }

        stopScan()

        getDevice()

        device_interval = setInterval(()=>{
            getDevice()
        },5000)
    }

    function stopScan() {
        if(device_interval){
            clearInterval(device_interval)
            device_interval=null
        }
        try {
            BLEService.bleManager.stopDeviceScan()
        }catch (e) {}
    }


    function getDevice() {
        setIsBluetooth(true)
        BLEService.bleManager.startDeviceScan( null,null,async (e:any, scannedDevice:any)=>{

            if(e) {

                if(e.errorCode=="102"){
                    setIsBluetooth(false)
                }else if(e.errorCode=="600"){
                   return
                } else{
                    error(e.message)
                }

                stopScan()
            }else{

                if(!scannedDevice.name || !scannedDevice.name.includes("ALRF"))
                    return null

                for(const {id} of _devices){
                    if(id==scannedDevice.id)
                        return;
                }

                _devices.push(scannedDevice)
                setDevices([..._devices])

            }
        });


    }

    async function connectDevice(device) {

        setLoadingConnect(device.id)
        device.connect({autoConnect:true,timeout:15000})
            .then((device)=>{
                return  device.discoverAllServicesAndCharacteristics()
            })
            .then(async (device)=>{
                setLoadingConnect(false)

                const ble = IStore.ble;

                ble.stopListener()
                ble.setDeviceID(device.id)
                ble.startListener()

                IStore.setLogger({type:"device", key:"", data:device.id+" "+device.name, date:l_moment(), res:"device connected",})

                success()
                navigation.pop()
            })
            .catch((e)=>{
                setLoadingConnect(false)
                error(e.message)
            })
    }

    function getServicesAndCharacteristics(device) {
        return new Promise((resolve, reject) => {
            device.services().then(services => {
                const characteristics = []

                services.forEach((service, i) => {
                    service.characteristics().then(c => {
                        characteristics.push(c)

                        if (i === services.length - 1) {
                            const temp = characteristics.reduce(
                                (acc, current) => {
                                    return [...acc, ...current]
                                },
                                []
                            )
                            const dialog = temp.find(
                                characteristic =>
                                    characteristic.isWritableWithoutResponse
                            )
                            if (!dialog) {
                                reject('No writable characteristic')
                            }

                            resolve(dialog)
                        }
                    })
                })
            })
        })
    }



    if(!is_bluetooth){
        return (
            <CView flex={1} center color="darkGray">

                <FontText position="center" padding="2" title={"102"} size={2} />
                <CButton
                    title="tekrardene"
                    onPress={()=>{
                        locationPermission()
                    }}

                />
            </CView>
        )
    }

    if(!Array.isArray(devices) || !devices.length){
        return (
            <CView flex={1}  center color="darkGray">
                <TouchableOpacity activeOpacity={1} onLongPress={()=>{
                    const ble = IStore.ble;
                    ble.setDeviceID("test")
                    success()
                    navigation.pop()
                }}>
                    <Spinner color={Colors.white} />
                </TouchableOpacity>

            </CView>
        )
    }

    return (
        <Container  style={{backgroundColor:Colors.darkGray}}>

            <CView row vertical={"center"} horizontal="flex-start" padding="0 2">
                <Spinner color={Colors.gray} size="small"/>
            </CView>

            <Content>
                {
                    devices.map((device,index)=>{

                        return(
                            <CView
                                style={{alignSelf:'center'}}
                                key={index}
                                center
                                onPress={()=>{
                                    connectDevice(device)
                                }}
                                margin="1"
                                padding="1 2"
                                radius={10}
                                color="primary"
                            >

                                <FontText title={device.name??device.id} size={2.6} bold />

                                {
                                    device.id==loadingConnect?
                                        <ActivityIndicator color={Colors.text} />:null
                                }
                            </CView>

                        )
                    })
                }
                <CView height={hp(5)}/>
            </Content>

        </Container>
    );
}


export default ConnectDevice