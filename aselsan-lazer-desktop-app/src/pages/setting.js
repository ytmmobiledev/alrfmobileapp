import React, {useEffect, useState} from "react"
import Colors from "../constants/Colors";
import {string} from "../locales";
import Header, {HelpText, MoreInfoButton} from "../componenets/Header";
import {IStore} from "../stores/InstantStore";
import {Params} from "../constants/Params";
import {InputNumber, Spin} from "antd";
import {ReloadOutlined,RightOutlined} from "@ant-design/icons";
import {observer} from "mobx-react-lite";
import BLEService from "../services/BLEService";
import {useHistory} from "react-router-dom";


const Setting = () => {
    const history = useHistory()
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
    const [device,setDevice] = useState("loading")

    useEffect(()=>{
        BLEService.event.on("monitor",_setData)
        controlDevice()


        return()=>{
            BLEService.event.removeListener("monitor",_setData)
        }
    },[])

    function _setData({all_data}) {
        setData({...all_data})
    }


    function reload() {
        setData({
            ...data,
            ...{
                distance_unit: "",
                article_mode:"",
                language:"",
                angle_unit_type:"",
                night_vision_mode:"",
                device_sleep_time:null,
                bluetooth_sleep_time:null,
                bottom_door_lock:0,
                top_door_lock:0,
                magnetic_declination_angle:0
            }
        })

        controlDevice()
    }

    async function controlDevice() {
        const device = ble.getDevice()
        setDevice(device)

        if(device){
            getValues()
        }
    }

    function getValues() {

        for(let [key,param] of Object.entries(usage_params)){
            if(param.getHex)
                ble.sendDataToDevice(key,param.getHex).then(()=>{})
        }
    }


    if(!device){
        return (
            <div className="column contain center">
                <div style={{ fontSize:20,color:Colors.text,fontWeight:'bold'}}>{string["101"]}</div>
                <div
                    onClick={()=>{
                        history.push("select-device")
                    }}

                    style={{margin:10, padding:"10px 15px", backgroundColor:Colors.primary,borderRadius:10, fontSize:16,color:Colors.text,fontWeight:'bold'}}>{string.simdibaglan}</div>
            </div>

        )
    }

    if(device=="loading"){
        return null
    }



    return (
        <div className="center contain column">

            <div className="center" style={{width:'100%'}}>
                <Header
                    left={()=><HelpText/>}
                    right={()=><MoreInfoButton/>}
                />
            </div>

            <div className="flex row"  style={{width:'50%', flexDirection:'space-between', alignItems:'center',fontSize:25,fontWeight:'bold',color:Colors.primary}}>
                <div className="flex-1"></div>
                <div className="flex-3 center" style={{textAlign:'center'}}>
                    {string.ayarlar}
                </div>
                <div  className="flex-1" style={{justifyContent:'flex-end'}}>
                    <div style={{padding:20}} onClick={reload}>
                        <ReloadOutlined style={{fontSize:20,color:Colors.text}}/>
                    </div>
                </div>
            </div>
            <div  className="flex column scroll" style={{width:"100%" ,height:"100vh"}} >

                <div  style={{alignSelf:'center', padding:20,margin:20,borderRadius:10, width:'50%'}}>
                    {
                        Object.entries(usage_params).map(([key,{title,setHex=()=>{},options,type,numberParams={}}],index)=>{
                            const value = data[key]

                            return (
                                <div
                                    key={index} className="flex row" style={{zIndex:999, alignItems:'center',justifyContent:'space-between',padding:12,margin:"15px 0px",borderRadius:15,backgroundColor:Colors.secondary}}
                                    onClick={()=>{

                                        if(value){

                                            IStore.setSetModal({
                                                visible:true,
                                                title,
                                                value:value?.id??value,
                                                type,
                                                numberParams,
                                                options:options?Object.values(options):null,
                                                onChange:async (id)=>{
                                                    await ble.sendDataToDevice(key,setHex(id))
                                                    return true;
                                                }
                                            })
                                        }
                                    }}
                                >
                                    <div style={{fontSize:18,fontWeight:'bold',color:Colors.text}}>
                                        {string[title]}
                                    </div>
                                    <div className="flex row center" >
                                        {
                                            value?
                                                <div style={{display:'flex',flex:2,textAlign:'left',color:Colors.text,padding:10,fontSize:16,fontWeight:'bold'}} >{value?.value?(string[value?.value]??value?.value):(numberParams?.fixed?(value/(Math.pow(10,numberParams?.fixed))):value) +""+ (numberParams?.unit?(" "+numberParams?.unit):"")}</div> :
                                                <div style={{display:'flex',flex:2,textAlign:'left',padding:10}} ><Spin/></div>
                                        }
                                        <RightOutlined style={{fontSize:20,color:Colors.text}} />
                                    </div>
                                </div>
                            )
                        })
                    }
                    <div style={{height:100}}/>
                </div>

            </div>

        </div>
    )
}


export default observer(Setting)