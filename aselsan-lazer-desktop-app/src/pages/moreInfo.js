import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import {observer} from "mobx-react-lite";
import Header, {HelpText, MoreInfoButton} from "../componenets/Header";
import {string} from "../locales";
import Colors from "../constants/Colors";
import { RightOutlined} from "@ant-design/icons";

import {contacts, findType, HomeScreenTypes} from "../constants/Config";
import {MStore} from "../stores/MainStore";
import {Modal, Switch} from "antd";
import {IStore} from "../stores/InstantStore";
import {setModalTypes} from "../componenets/SetModal";
import useStayAwake from "use-stay-awake";


const MoreInfo = () => {
    const history = useHistory()
    const device = useStayAwake();


    const [visible,setVisible] = useState(false)

    const {home_screen_type,lock_screen} = MStore.settings

    function Contact() {
        return(
            <Modal
                bodyStyle={{padding:0, backgroundColor:Colors.darkGray}}
                centered
                closable={false}
                visible={visible}
                okText={string.kaydet}
                cancelText={string.kapat}
                onOk={()=>{setVisible(false)}}
                onCancel={()=>{setVisible(false)}}
                footer={null}
            >
                <div style={{width:'100%'}}>
                    <div
                        style={{width:'100%', display:'flex',justifyContent:'flex-end'}}
                    >
                        <div className="background-img" style={{display:'flex', width:60,height:55,backgroundImage:`url(${require("../assets/images/modal/corner.png").default})`}}  >
                            <div style={{marginLeft:20,marginBottom:10}} className="flex-1 center">
                                <img src={require("../assets/images/modal/iletisim.png").default} height={25} width={25} />
                            </div>
                        </div>
                    </div>
                    <div style={{padding:15}}>
                        <div style={{fontSize:18,fontWeight:'bold',color:Colors.primary,textAlign:'center'}} >{string["bizeulasin"]}</div>
                    </div>
                    <div className="flex center row" style={{display:'grid', width:'100%',padding:10}}>
                        {
                            Object.values(contacts).map(({title,value,onPress},index)=>
                                <div key={index} style={{cursor:'pointer', display:'flex', }} onClick={()=>{onPress(value.replace(/ /g, ''))}}>
                                    <div style={{padding:10}}>
                                        <div  style={{fontSize:18,fontWeight:'bold',color:Colors.white}}>{string[title]+": "+value}</div>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    <div className={"flex row"} style={{padding:15, width:'100%',margin:"40px 0",alignItems:'center',justifyContent:'space-around'}}>
                        <div className="flex-1 center">
                            <div
                                style={{fontSize:18,color:Colors.primary,fontWeight:'bold', padding:10}}
                                onClick={()=>{setVisible(false)}}
                            >
                                {string.kapat}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }

    return (
        <div  className="flex-1 column contain center" >
            <Contact/>
            <div className="center" style={{width:'100%'}}>
                <Header
                    onBack={()=>{
                        history.goBack()
                    }}
                    right={()=><MoreInfoButton close/>}
                />
            </div>
            <div className="flex row"  style={{fontSize:25,fontWeight:'bold',color:Colors.primary}}>
                {string.dahafazla}
            </div>
            <div className="flex-1 scroll column" style={{width:'100%',alignItems:'center'}} >

                <div
                    className="flex row" style={{ width:'50%',alignItems:'center',justifyContent:'space-between',padding:12,margin:"20px 0px",borderRadius:15,backgroundColor:Colors.secondary}}
                    onClick={()=>{
                        IStore.setSetModal({
                            visible:true,
                            title:string["olcumonceligi"],
                            value:home_screen_type,
                            type:setModalTypes.Select,
                            options:Object.values(HomeScreenTypes),
                            icon:require("../assets/images/modal/oncelik.png"),
                            onChange:async (id)=>{
                                MStore.setSettings({...MStore.settings, home_screen_type:id})
                            }
                        })
                    }}
                >
                    <div style={{fontSize:18,fontWeight:'bold',color:Colors.text}}>
                        {string["olcumonceligi"]}
                    </div>
                    <div className="flex row center" >
                        <div style={{display:'flex',flex:2,textAlign:'left',color:Colors.text,padding:10,fontSize:15}} >{string[findType(HomeScreenTypes,home_screen_type)]}</div>
                        <RightOutlined style={{fontSize:20,color:Colors.text}} />
                    </div>
                </div>
                <div
                    className="flex row" style={{ borderBottomStyle:'dashed', borderBottomWidth:3,borderRadius:2,borderColor:'#667587',  width:'50%',alignItems:'center',justifyContent:'space-between',padding:12,margin:"15px 0px"}}
                >
                    <div style={{fontSize:18,fontWeight:'bold',color:Colors.text}}>
                        {string["ekranklidiniengelle"]}
                    </div>
                    <div >
                        <Switch defaultChecked={lock_screen} onChange={(lock_screen)=>{
                            MStore.setSettings({...MStore.settings,lock_screen})
                            if(lock_screen){
                                device.preventSleeping();
                            }else{
                                device.allowSleeping();
                            }
                        }} />
                    </div>
                </div>
                <div
                    className="flex row" style={{ width:'50%',alignItems:'center',justifyContent:'space-between',padding:12,margin:"20px 0px",borderRadius:15,backgroundColor:Colors.secondary}}
                    onClick={()=>{
                        history.push("select-device")
                    }}
                >
                    <div style={{fontSize:18,fontWeight:'bold',color:Colors.text}}>
                        {string["cihazabaglan"]}
                    </div>
                    <div className="flex row center" >
                        <RightOutlined style={{fontSize:20,color:Colors.text}} />
                    </div>
                </div>
                <div
                    className="flex row" style={{ width:'50%',alignItems:'center',justifyContent:'space-between',padding:12,margin:"20px 0px",borderRadius:15,backgroundColor:Colors.secondary}}
                    onClick={()=>{
                        setVisible(true)
                    }}
                >
                    <div style={{fontSize:18,fontWeight:'bold',color:Colors.text}}>
                        {string["hakkinda"]}
                    </div>
                    <div className="flex row center" >
                        <RightOutlined style={{fontSize:20,color:Colors.text}} />
                    </div>
                </div>
            </div>

        </div>
    )
}


export default observer(MoreInfo)