import React, {useEffect} from 'react';
import './App.css';
import Colors from "./constants/Colors";
import {useHistory} from "react-router-dom";
import { Spin } from 'antd';
import {IStore} from "./stores/InstantStore";
import {MStore} from "./stores/MainStore";


function App() {
    const history = useHistory()
    const ble = IStore.ble;

    useEffect(()=>{
        ble.setDevice(MStore.device)

        setTimeout(()=>{
            history.push("tabs")
        },3000)
    },[])

  return (
    <div className="contain" style={{backgroundColor:Colors.darkGray,justifyContent:'center',alignItems:'center'}}>
        <Spin/>
    </div>
  );
}

export default App;
