import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import Colors from "../constants/Colors";
import {Spin} from "antd";
import {IStore} from "../stores/InstantStore";

const Loading=()=>{

    if(!IStore.loading)
        return(null)

    return(
        <div style={{display:'flex', width:'100%',height:'100vh', zIndex:9999, flex:1,position:'absolute',top:0,left:0,justifyContent:'center',alignItems:'center'}}>
            <div className="center" style={{ border:`4px solid ${Colors.primary}`, width:80,height:80, backgroundColor:Colors.darkGray,borderRadius:1000}}>
                <Spin size="large" style={{ display:'flex'}}/>
            </div>
        </div>
    )



}


export default observer(Loading);
