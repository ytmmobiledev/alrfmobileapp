import React, {useEffect, useState} from "react"
import Colors from "../constants/Colors";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { styled } from "@mui/material/styles";

import {string} from "../locales";
import Measure from "./measure";
import Device from "./device";
import LaserMeter from "./laserMeter";
import {IStore} from "../stores/InstantStore";
import {observer} from "mobx-react-lite";
import Setting from "./setting";

const Tabs = () => {


    useEffect(()=>{
    },[])

    const page = IStore.tab_index

    return (
        <div style={{backgroundColor:Colors.darkGray, height: '100vh', width: '100%' }}>
            <div >
                {
                    page=="olcum"?
                        <Measure/>:
                        page=="cihaz"?
                            <Device/>:
                            page=="yapilandirici"?
                                <Setting/>:
                                page=="lazer"?
                                    <LaserMeter/>:null
                }
            </div>
            <div style={{position: 'fixed', bottom: 0, left: 0, right: 0 }}>
                <BottomNavigation
                    showLabels
                    value={page}
                    sx={{
                        p:5,
                        bgcolor: Colors.primary,
                        '& .MuiBottomNavigationAction-label': {
                            filter:"opacity(0.4)",
                            color: Colors.white,
                            fontSize: theme => theme.typography.caption,
                            transition: 'none',
                            fontWeight: 'bold',
                            lineHeight: '20px'
                        },
                        '& .Mui-selected': {
                            '& .MuiBottomNavigationAction-label': {
                                filter:"none",
                                color: Colors.white,
                                fontSize: theme => theme.typography.caption,
                                transition: 'none',
                                fontWeight: 'bold',
                                lineHeight: '20px'
                            }
                        }
                    }}

                    onChange={(event, newValue) => {
                        IStore.setTabIndex(newValue)
                    }}
                >
                    <BottomNavigationAction value={"olcum"} label={string.olcum2} icon={ <img src={require("../assets/images/goz.png").default} style={{...page=="olcum"?{}:{filter:"opacity(0.4)"}, width:30,height:30}}/>} />
                    <BottomNavigationAction value={"cihaz"} label={string.cihaz2} icon={ <img src={require("../assets/images/cihaz2.png").default} style={{...page=="cihaz"?{}:{filter:"opacity(0.4)"},width:30,height:30}}/>} />
                    <BottomNavigationAction value={"yapilandirici"} label={string.yapilandirici} icon={ <img src={require("../assets/images/yapilandirici.png").default} style={{...page=="yapilandirici"?{}:{filter:"opacity(0.4)"},width:30,height:30}}/>} />
                    <BottomNavigationAction value={"lazer"} label={string.lazermesafeolcer} icon={ <img src={require("../assets/images/lazer.png").default} style={{...page=="lazer"?{}:{filter:"opacity(0.4)"},width:30,height:30}}/>} />
                </BottomNavigation>
            </div>

        </div>
    )
}


export default observer(Tabs)