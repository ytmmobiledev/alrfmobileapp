import React, {useEffect} from 'react';
import './App.css';
import Colors from "./constants/Colors";
import {useHistory} from "react-router-dom";
import { Spin } from 'antd';
import {IStore} from "./stores/InstantStore";
import {MStore} from "./stores/MainStore";
import useStayAwake from "use-stay-awake";


function App() {
    const history = useHistory()
    const device = useStayAwake();

    const ble = IStore.ble;
    useEffect(()=>{


        setTimeout(()=>{
            controlData()
        },1000)
    },[])


    function controlData() {

        if(MStore.settings.lock_screen){
            device.preventSleeping();
        }else{
            device.allowSleeping();
        }

        if(MStore.first){
            history.push("slide")
        }else{

            let device = ble.getDevice()

            if(device){
                history.push("tabs")
            }else{
                history.push("select-device")
            }

        }
    }

  return (
    <div className="contain" style={{backgroundColor:Colors.darkGray,justifyContent:'center',alignItems:'center'}}>
        <Spin/>
    </div>
  );
}

export default App;
