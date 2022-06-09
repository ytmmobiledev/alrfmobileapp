
import * as React from "react";
import {activateKeepAwake, deactivateKeepAwake, useKeepAwake} from "expo-keep-awake";
import { CView } from "../../components/CView";
import { useEffect, useState } from "react";
import {CImage} from "../../components/CImage";
import {FontText} from "../../components/FontText";
import {hp} from "../../functions/responsiveScreen";
import {MainStore} from "../../stores/MainStore";
import {observer} from "mobx-react-lite";
import {Params} from "../../constants/Params";

function Measure({ navigation }: any) {
    useKeepAwake();


    useEffect(() => {

        if(MainStore.settings?.lock_screen){
            activateKeepAwake();
        }else{
            deactivateKeepAwake()
        }
    }, []);




    return (
        <CView center color={"darkGray"} vertical="center"  flex={1}>
            <FontText flex={1} title={"LOGO"} size={3.5} bold padding={"0 0 4 0"}/>
            <CView flex={9} width={"100%"}>
                <CImage style={{flex:8}} resizeMode="contain" source={require("../../assets/images/measure/bg.png")}  orgWidth={"100%"} background>
                    <CView flex={1} center>
                        <CView onPress={()=>{navigation.navigate("Compass")}}>
                            <CImage resizeMode="contain" source={require("../../assets/images/measure/button.png")} width={26} height={26}/>
                        </CView>
                    </CView>
                </CImage>
                <CView flex={1}  width={"100%"} center >
                    <FontText position="center" title={"olcumyap"} size={2.2} bold color={"text"} />
                    <FontText position="center" title={"olcumyapdesc"} size={1.5}  color={"text"}/>
                </CView>
            </CView>
            <CView height={hp(13)}/>
        </CView>
    );
}
export default observer(Measure)