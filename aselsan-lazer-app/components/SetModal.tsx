import * as React from "react";

import { observer } from "mobx-react-lite";
import { IStore } from "../stores/InstantStore";
import {CView} from "./CView";
import {ActivityIndicator, TextInput, View} from "react-native";
import {hp} from "../functions/responsiveScreen";
import {CImage} from "./CImage";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";
import {FontText} from "./FontText";
import {UnitTypes} from "../constants/Config";
import {MainStore} from "../stores/MainStore";
import {Feather} from "@expo/vector-icons";
import DashedLine from "react-native-dashed-line";
import {useEffect, useState} from "react";
import {Input, Textarea} from "native-base";

export const setModalTypes = {
    Select:"select",
    Number:"number"
}

function SetModal() {
    const {
        visible,
        title="",
        description="",
        icon=require("../assets/images/cihaz2.png"),
        value,
        options,
        type,
        onChange=async (data:any)=>{}
    } = IStore.set_modal;

    const [defaultValue,setDefaultValue] = useState(null)
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        setDefaultValue(value)

    },[value])

    return (
        <Modal
            style={{ margin: 0 }}
            isVisible={visible}
            animationIn="fadeIn"
            animationOut="fadeOut"
            onBackButtonPress={() => {
                IStore.setSetModal({ visible: false });
            }}
            onBackdropPress={() => {
                IStore.setSetModal({ visible: false });
            }}
        >
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        maxHeight: hp(95),
                        backgroundColor:Colors.darkGray,
                        width: "85%",
                        borderRadius: 10,
                    }}
                >
                    {
                        icon?
                            <View
                                style={{ alignSelf: "flex-end"}}
                            >
                                <CImage imageStyle={{borderTopRightRadius:10}} source={require("../assets/images/modal/corner.png")} width={8} height={7} background>
                                    <CView style={{marginLeft:hp(2),marginBottom:hp(1)}} center flex={1}>
                                        <CImage source={icon} height={3} width={3} />
                                    </CView>
                                </CImage>
                            </View>:<View style={{height:hp(3)}}/>
                    }
                    <View style={{ padding: hp(3), paddingTop: 0 }}>
                        <CView >
                            {
                                title? <FontText title={title} size={1.8} bold position="center"  />:null
                            }
                            {
                                description?<FontText title={description} size={1.5} bold position="center"  />:null
                            }
                            <CView center width="100%" padding="2">
                                {
                                    type==setModalTypes.Select?
                                        <Select
                                            defaultValue={defaultValue}
                                            options={options}
                                            onChange={(data:any)=>{

                                                setDefaultValue(data)
                                            }}
                                        />:
                                        type==setModalTypes.Number?
                                            <Number
                                                defaultValue={defaultValue}
                                                onChange={(data:any)=>{

                                                    setDefaultValue(data)
                                                }}
                                            />:null
                                }
                            </CView>
                            <CView padding="0 0 2 0" row vertical="center" horizontal="space-around">
                                <CView flex={1} center>
                                    <FontText onPress={()=>IStore.setSetModal({visible:false})} position="center" title={"kapat"} size={2} bold padding="2" color="primary"/>
                                </CView>
                                <CView flex={1} center>
                                    {
                                        loading?
                                            <ActivityIndicator style={{padding:hp(2)}} color="#667587" size="small"  />:
                                            <FontText
                                                onPress={()=>{
                                                    setLoading(true)
                                                    onChange(defaultValue).then(()=>{
                                                        setLoading(false)
                                                        IStore.setSetModal({visible:false})
                                                    })
                                                }}
                                                position="center" title={"kaydet"} size={2} bold padding="2" color="primary"
                                            />

                                    }
                                </CView>


                            </CView>
                        </CView>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function Select({defaultValue, options,onChange}:any) {
    return(
        <CView>
            {
                Array.isArray(options)? options.map(({id,value}:any)=>(
                    <CView

                        key={id}
                        width={"100%"}
                        onPress={()=>{
                            onChange(id)
                        }}

                    >
                        <CView padding="1" width="100%" row vertical="center" horizontal="space-between">
                            <FontText flex={1} padding="1" title={value} size={1.5} bold />
                            <Feather name={defaultValue==id?"check-circle":"circle"} size={hp(2.2)} color={Colors.text} />
                        </CView>
                        <DashedLine dashLength={hp(0.6)} dashThickness={hp(0.16)} dashGap={hp(0.3)} dashColor={Colors.text}  />

                    </CView>
                )):null
            }
        </CView>
    )
}


function Number({defaultValue,onChange}:any) {
    return(
        <CView width={"100%"}>
           <TextInput
               style={{padding:hp(2), width:'100%',fontSize:hp(2),color:Colors.text, borderStyle:'dashed', borderWidth:1,borderRadius:1,borderColor:'#667587'}}
               defaultValue={defaultValue?defaultValue.toString():""}
               placeholderTextColor={Colors.text}
               onChangeText={(text)=>{
                   try {
                       onChange(parseFloat(text))
                   }catch (e) {

                   }
               }}
           />
        </CView>
    )
}

export default observer(SetModal);
