import React, {useEffect, useRef, useState} from "react"
import GoogleMapReact from 'google-map-react';
import {IStore} from "../stores/InstantStore";
import {Spin} from "antd";
import Colors from "../constants/Colors";
import {findLocation} from "../functions/findLocation";

let target_interval = null

let _compass = false
let old_heading = 0;
let _location = {}


const LaserMeter = () => {
    const ble = IStore.ble
    const map = useRef()

    const [location, setLocation] = useState(null);
    const [target, setTarget] = useState(null);
    const [heading,setHeading] = useState(old_heading)
    const [compass,setCompass] = useState(_compass)

    useEffect(()=>{
        try {

            navigator.geolocation.watchPosition(({coords})=>{
                _location={
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
                setLocation(_location);
            },(e)=>{
                console.warn(e)
            });
        }catch (e) {
        }


        if(target_interval){
            clearInterval(target_interval)
            target_interval=null
        }

        target_interval = setInterval(()=>{
            findTarget()
        },1500)


        return()=>{
            if(target_interval){
                clearInterval(target_interval)
                target_interval=null
            }
        }
    },[])

    function findTarget() {

        ble.getDistanceAndDegree().then(({distance,azimuth,elevation,roll})=>{
            if(!_location?.latitude)
                return;

            const target_location = findLocation(_location.latitude,_location.longitude,distance,azimuth,elevation)
            setTarget({...target_location,height:target_location.y_distance,distance:target_location.x_distance,azimuth,elevation,roll})

            setTimeout(()=>{
                try {
                    map.current.panTo([{lat:target_location.latitude,lng:target_location.longitude},{lat: _location.latitude, lng: _location.longitude}])
                    console.warn("girdi")
                }catch (e) {
                    console.warn(e)
                }
            },1000)
        })
    }

    const Marker = ({my }) => {
        if(my){
            return(
                <div className="center" style={{width:30,height:30,backgroundColor:Colors.primary,borderRadius:100}}>
                    <div style={{width:15,height:15,backgroundColor:Colors.white,borderRadius:100}}>
                    </div>
                </div>
            )
        }
        return(
            <div>
                <img src={require("../assets/images/placeholder.png").default} style={{width:30,height:30}} />
            </div>
        )
    };

    if (!location )
        return (
            <div className="contain center">
                <Spin/>
            </div>
        );



    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyAJ_6n7wqqK8sIk0LV6IqO3OuukpMIbQMM" }}
                defaultCenter={{
                    lat: location.latitude,
                    lng: location.longitude,
                }}

                defaultZoom={11}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map:_map }) => {
                    map.current = _map;
                }}
            >
                <Marker
                    lat={location.latitude}
                    lng={location.longitude}
                    my
                />
                {
                    target?
                        <Marker
                            lat={target.latitude}
                            lng={target.longitude}
                        />:null
                }
            </GoogleMapReact>

        </div>
    )
}


export default LaserMeter