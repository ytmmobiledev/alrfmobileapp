import React, {useEffect, useState} from "react"
import Colors from "../constants/Colors";
import {string} from "../locales";
import Header, {HelpText, MoreInfo} from "../componenets/Header";
import {IStore} from "../stores/InstantStore";
import {Params} from "../constants/Params";
import {Spin} from "antd";
import {MStore} from "../stores/MainStore";
import {observer} from "mobx-react-lite";

let info_interval = null

const Device = () => {

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

    useEffect(()=>{
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
    },[])



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
            <div className="column contain center">
                <div style={{ fontSize:20,color:Colors.text,fontWeight:'bold'}}>{string["101"]}</div>
                <div
                    onClick={()=>MStore.setDevice({id:"test"})}

                    style={{margin:10, padding:"10px 15px", backgroundColor:Colors.primary,borderRadius:10, fontSize:16,color:Colors.text,fontWeight:'bold'}}>{string.simdibaglan}</div>
            </div>

        )
    }

    if(device_id=="loading"){
        return (
            <div className="contain center">
                <Spin/>
            </div>
        )
    }


    return (
        <div className="center contain column">

            <div className="center" style={{width:'100%'}}>
                <Header
                    left={()=><HelpText/>}
                    right={()=><MoreInfo/>}
                />
            </div>
            <div  className="flex column scroll" style={{width:"100%" ,height:"100vh"}} >
                <div className="center" style={{fontSize:25,fontWeight:'bold',color:Colors.primary}}>
                    {string.cihazdurumbilgisi}
                </div>
                <div  style={{alignSelf:'center', padding:20,margin:20,borderRadius:10, backgroundColor:Colors.secondary, width:'50%'}}>
                    {
                        Object.values(data).map(({title,value},index)=>{
                            return (
                                <div key={index}  style={{margin:5,marginBottom:20,padding:5, borderStyle:'dashed', borderWidth:1,borderRadius:1,borderColor:'#667587'}}>
                                    <div style={{color:Colors.text,padding:10,fontSize:16,fontWeight:'bold'}}>{string[title]}</div>
                                    <hr style={{borderColor:"#4c5f72"}}/>
                                    <div>
                                        {
                                            value?
                                                typeof value == "string"?
                                                    <div style={{color:Colors.text,padding:10,fontSize:16,fontWeight:'bold'}}>{value}</div> :
                                                    Object.values(value).map(({title,value},index)=>(
                                                        <div key={index} className="flex row"  style={{justifyContent:'space-between',alignItems:'center'}}>
                                                            <div style={{display:'flex',flex:2,textAlign:'left',color:Colors.text,padding:10,fontSize:16,fontWeight:'bold'}} >{string[title]}</div>
                                                            <div style={{display:'flex',flex:1,textAlign:'left',color:Colors.text,padding:10,fontSize:14,fontWeight:'bold'}} >{string[value]??value}</div>
                                                        </div>
                                                    ))
                                                :
                                                <Spin/>
                                        }
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


export default observer(Device)