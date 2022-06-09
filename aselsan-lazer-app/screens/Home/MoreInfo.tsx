//@ts-nocheck
import * as React from "react";
import { CView } from "../../components/CView";
import { useEffect, useState } from "react";
import {CImage} from "../../components/CImage";
import {FontText} from "../../components/FontText";
import {hp} from "../../functions/responsiveScreen";
import {Content} from "native-base";
import {Slider, Switch} from "react-native-elements";
import Colors from "../../constants/Colors";
import {SafeAreaView} from "react-native-safe-area-context";
import {AntDesign, Feather, MaterialIcons} from "@expo/vector-icons";
import DashedLine from 'react-native-dashed-line';
import {IStore} from "../../stores/InstantStore";
import {observer} from "mobx-react-lite";
import {contacts, findType, HomeScreenTypes, sss} from "../../constants/Config";
import {MainStore} from "../../stores/MainStore";
import {activateKeepAwake, deactivateKeepAwake} from "expo-keep-awake";
import Accordion from 'react-native-collapsible/Accordion';
import {ScrollView} from "react-native";



const HomeScreenType = observer(()=>{
    const {home_screen_type} = MainStore.settings

    return(
        <CView>
            <FontText title={"olcumonceligi"} size={2} bold position="center"  />
            <FontText padding="0.5 0" title={"olcumonceligidesc"} size={1.5} position="center"  />
            <CView center width="100%" padding="2">
                {
                    Object.values(HomeScreenTypes).map(({id,value}:any)=>(
                        <CView
                            width={"100%"} key={id}
                            onPress={()=>{
                                MainStore.setSettings({...MainStore.settings, home_screen_type:id})
                            }}
                        >
                            <CView padding="1" width="100%" row vertical="center" horizontal="space-between">
                                <FontText flex={1} padding="1" title={value} size={1.5} bold />
                                <Feather name={home_screen_type==id?"check-circle":"circle"} size={hp(2.2)} color={Colors.text} />
                            </CView>
                            <CView width={"100%"}>
                                <DashedLine dashLength={hp(0.6)} dashThickness={hp(0.16)} dashGap={hp(0.3)} dashColor={Colors.text}  />
                            </CView>
                        </CView>
                    ))
                }
            </CView>
            <FontText onPress={()=>IStore.setCustomModal({visible:false})} position="center" title={"kapat"} size={2} bold padding="2 2 4 2" color="primary"/>

        </CView>
    )
})


const Manuel = ()=>{
    const [page,setPage] = useState(1)
    const [active,setActive] = useState(0)
    return(
        <CView>
            <CView width={"100%"} padding="0 0 0 2" row vertical="center" horizontal="space-around" >
                <FontText padding="1" onPress={()=> {setPage(1);setActive(0)}} title={"uygulama"} size={1.8} bold color={page==1?"primary":"text"}/>
                <FontText padding="1" onPress={()=>{setPage(2);setActive(0)}} title={"cihaz"} size={1.8} bold color={page==2?"primary":"text"}/>
            </CView>
            {
                page==1?
                    <CView>
                        <Accordion
                            activeSections={[active]}
                            sections={sss.Application}
                            renderHeader={({title},index)=>
                                <CView padding="1.3">
                                    <CView padding="0 0 0 01" row vertical="center" horizontal="space-between"   width="100%" ><FontText title={title} size={1.6} bold color={"white"}/><AntDesign name={active==index?"up":"down"} size={hp(2)} color={Colors.text} /></CView>
                                    <DashedLine dashLength={hp(0.6)} dashThickness={hp(0.16)} dashGap={hp(0.3)} dashColor={Colors.text}  />
                                </CView>
                            }
                            renderContent={({content},index)=><CView padding="1.3 1.3 0 2" width="100%" ><FontText title={content} size={1.5} color={"white"}/></CView>}
                            onChange={([index])=>{
                                setActive(index)
                            }}
                        />
                    </CView>:
                    <CView>
                        <Accordion
                            activeSections={[active]}
                            sections={sss.DEVICE}
                            renderHeader={({title},index)=>
                                <CView padding="1.3">
                                    <CView padding="0 0 0 01" row vertical="center" horizontal="space-between"   width="100%" ><FontText title={title} size={1.6} bold color={"white"}/><AntDesign name={active==index?"up":"down"} size={hp(2)} color={Colors.text} /></CView>
                                    <DashedLine dashLength={hp(0.6)} dashThickness={hp(0.16)} dashGap={hp(0.3)} dashColor={Colors.text}  />
                                </CView>
                            }
                            renderContent={({content},index)=><CView padding="1.3 1.3 0 2" width="100%" ><FontText title={content} size={1.5} color={"white"}/></CView>}
                            onChange={([index])=>{
                                setActive(index)
                            }}
                        />
                    </CView>
            }
            <FontText onPress={()=>IStore.setCustomModal({visible:false})} position="center" title={"kapat"} size={2} bold padding="2 2 4 2" color="primary"/>

        </CView>
    )
}


const Contact = ()=>{

    return(
        <CView>
            <FontText padding="1" title={"bizeulasin"} size={2} bold color="primary"/>

            <CView padding="1 0">
                {
                    Object.values(contacts).map(({title,value,onPress}:any,index:number)=>
                        <CView key={index} onPress={()=>{onPress(value.replace(/ /g, ''))}}>
                           <FontText padding="1" title={""} size={1.7}>
                               <FontText title={title} size={1.7} color="white"/>
                               <FontText title={": "} size={1.7} color="white"/>
                               <FontText title={value} size={1.7} color="white"/>
                           </FontText>
                        </CView>
                    )
                }
            </CView>
            <FontText onPress={()=>IStore.setCustomModal({visible:false})} position="center" title={"kapat"} size={2} bold padding="2 2 4 2" color="primary"/>

        </CView>
    )
}



function MoreInfo({ navigation }: any) {

    const {home_screen_type,auto_result,lock_screen} = MainStore.settings



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.darkGray }}>

            <CView  width={"100%"} row vertical="center" horizontal="space-between">
                <CView padding="3" onPress={()=>{navigation.pop()}}>
                    <MaterialIcons name="arrow-back-ios" size={hp(3)} color={Colors.text} />

                </CView>
                <CImage width={10} height={11.6}  resizeMode={"stretch"} source={require("../../assets/images/secili-dahafazla.png")} />
            </CView>
            <Content>
                <CView vertical="center" >

                    <FontText title={"LOGO"} size={3.5} bold />
                    <CView padding="2"  width="100%">
                        <FontText title={"dahafazla"} size={2.2} bold color="primary"/>
                    </CView>

                    <CView
                        onPress={()=>{
                            IStore.setCustomModal({
                                visible:true,
                                icon:require("../../assets/images/modal/oncelik.png"),
                                children:()=><HomeScreenType/>
                            })

                        }}
                        row vertical="center" horizontal="space-between"
                        color="secondary" padding="1.8 2.2" width="80%" radius={8}>
                        <FontText title={"olcumonceligi"} size={1.8} bold color={"text"}/>
                        <CView row center>
                            <FontText title={findType(HomeScreenTypes,home_screen_type)} size={1.4} color={"text"}/>
                            <MaterialIcons name="navigate-next" size={hp(3)} color={Colors.text} />
                        </CView>
                    </CView>
                    {
                        /*
                        <CView padding="1 1 3 1" width="80%" row vertical="center" horizontal="space-between">
                        <FontText flex={1} padding="1" title={"sonuclariotomatikal"} size={1.8} bold/>
                        <Switch
                            value={auto_result}
                            color={Colors.primary}
                            onValueChange={(auto_result)=>{
                                MainStore.setSettings({auto_result})
                            }}
                        />
                    </CView>
                    <CView width={"80%"}>
                        <DashedLine dashLength={hp(0.6)} dashThickness={hp(0.16)} dashGap={hp(0.3)} dashColor={Colors.text}  />
                    </CView>
                        */
                    }
                    <CView padding="1 1 3 1" width="80%" row vertical="center" horizontal="space-between">
                        <FontText flex={1} padding="1" title={"ekranklidiniengelle"} size={1.8} bold />
                        <Switch
                            value={lock_screen}
                            color={Colors.primary}
                            onValueChange={(lock_screen)=>{
                                MainStore.setSettings({lock_screen})
                                if(lock_screen){
                                    activateKeepAwake();
                                }else{
                                    deactivateKeepAwake()
                                }
                            }}
                        />
                    </CView>
                    <CView width={"80%"}>
                        <DashedLine dashLength={hp(0.6)} dashThickness={hp(0.16)} dashGap={hp(0.3)} dashColor={Colors.text}  />
                    </CView>
                    <CView
                        margin="0 0 4 3" color="secondary" row vertical="center" horizontal="space-between" padding="1.8 2.2" width="80%" radius={8}
                        onPress={()=>{
                           navigation.navigate("ConnectDevice")
                        }}
                    >
                        <FontText title={"cihazabaglan"} size={1.8} bold color={"text"}/>
                        <MaterialIcons name="navigate-next" size={hp(3)} color={Colors.text} />
                    </CView>
                    {
                        /*<CView
                        margin="0 0 0 3" color="secondary" row vertical="center" horizontal="space-between" padding="1.8 2.2" width="80%" radius={8}
                        onPress={()=>{
                            IStore.setCustomModal({
                                visible:true,
                                icon:require("../../assets/images/modal/soru.png"),
                                children:()=><Manuel/>
                            })
                        }}
                    >
                        <FontText title={"manuel"} size={1.8} bold color={"text"}/>
                        <MaterialIcons name="navigate-next" size={hp(3)} color={Colors.text} />
                    </CView>*/
                    }
                    <CView
                        margin="0 0 0 6" color="secondary" row vertical="center" horizontal="space-between" padding="1.8 2.2" width="80%" radius={8}
                        onPress={()=>{
                            IStore.setCustomModal({
                                visible:true,
                                icon:require("../../assets/images/modal/iletisim.png"),
                                children:()=><Contact/>
                            })
                        }}
                    >
                        <FontText title={"hakkinda"} size={1.8} bold color={"text"}/>
                        <MaterialIcons name="navigate-next" size={hp(3)} color={Colors.text} />
                    </CView>
                </CView>
                <CView height={hp(20)}  width={"100%"}>
                    <CImage style={{flex:1}} resizeMode="stretch" source={require("../../assets/images/more/bg.png")}  orgWidth={"100%"} background>
                        <CView flex={1} center>
                            <FontText title={"App-Versiyon 1.2.5"} size={1.6} bold  style={{opacity:.7}} />
                        </CView>
                    </CImage>

                </CView>
            </Content>


        </SafeAreaView>
    );
}
export default observer(MoreInfo)