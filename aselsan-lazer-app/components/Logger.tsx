import * as React from "react";

import { observer } from "mobx-react-lite";
import { IStore } from "../stores/InstantStore";
import {FlatList, StatusBar, TouchableOpacity, View} from "react-native";
import {hp} from "../functions/responsiveScreen";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";
import {useEffect, useState} from "react";
import {FontText} from "./FontText";
import {CView} from "./CView";
import {l_moment} from "../functions/cMoment";

function Logger() {
    const [visible,setVisible] = useState(false)

    useEffect(()=>{

    },[])


    const data = IStore.logger;
    return (
        <CView style={{paddingTop:StatusBar.currentHeight}}>
            <CView center onPress={()=>{setVisible(true)}}  padding="2" color="primary">
                <FontText title={"Logları Görüntüle"} color="white" size={1.5} />
            </CView>
            <Modal
                style={{ margin: 0 }}
                isVisible={visible}
                animationIn="fadeIn"
                animationOut="fadeOut"
                onBackButtonPress={() => {
                    setVisible(false)
                }}
                onBackdropPress={() => {
                    setVisible(false)
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
                            padding:15,
                            height: hp(95),
                            backgroundColor:Colors.darkGray,
                            width: "85%",
                            borderRadius: 10,
                        }}
                    >
                        <CView style={{alignSelf:'flex-end'}} padding="2" onPress={()=>{setVisible(false)}}>
                            <FontText title={"X"} size={2.5} color="white" />
                        </CView>
                        <FlatList
                            inverted
                            data={[...data].reverse()}
                            keyExtractor={(_,index)=>index.toString()}
                            renderItem={({item:{type,date,data,key,res}})=>{
                                if(Array.isArray(data)){
                                    data = "["+data.map((e:any)=>e.toString(16).toUpperCase())+"]"
                                }
                                return(
                                    <CView margin="0.1 0" padding="1" colorHex={res.includes("error")?"#B71C1C55":type=="send"?"#388E3C55":type=="receive"?"#FDD83555":"transparent"}>
                                        <CView row vertical="center" horizontal="space-between">
                                            <FontText title={type} size={2} color="white" />
                                            <FontText title={l_moment(date).format("HH:mm:ss")} size={1.7} color="white" />
                                        </CView>
                                        <FontText title={key} size={2} color="white" />
                                        <FontText title={res} size={1.7} color="white" />
                                        <FontText padding="0 0 1 0" title={JSON.stringify(data)} size={1.7} color="white" />
                                    </CView>
                                )
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </CView>
    );
}

export default observer(Logger);
