
import * as React from "react";
import { CView } from "../../components/CView";
import {useEffect, useRef, useState} from "react";
import * as Location from "expo-location";
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from "react-native-maps";
import {hp, wp} from "../../functions/responsiveScreen";
import {Container, Spinner} from "native-base";
import Colors from "../../constants/Colors";
import {SafeAreaView} from "react-native-safe-area-context";
import {IStore} from "../../stores/InstantStore";
import {Animated, Easing} from "react-native";
import {findLocation} from "../../functions/findLocation";
import {FontText} from "../../components/FontText";
import {Entypo, MaterialCommunityIcons} from "@expo/vector-icons";


let target_interval:any = null

let _compass:boolean = false
let old_heading = 0;
let _location:any = {}

export default function LaserMeter({ navigation }: any) {

    const ble = IStore.ble
    const map:any = useRef()



    const [location, setLocation]: any = useState(null);
    const [target, setTarget]: any = useState(null);
    const [heading,setHeading] = useState(old_heading)
    const [compass,setCompass] = useState(_compass)


    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Konum Eişimine İzin Vermelisiniz");
                return;
            }

            getCompass()

            await Location.watchPositionAsync({ accuracy: Location.Accuracy.Highest, timeInterval: 10000, distanceInterval: 1 }, ({coords}) => {
                _location={
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
                setLocation(_location);
            });
        })();
    }, []);


    useEffect(()=>{
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




    async function getCompass() {

        Location.watchHeadingAsync(({trueHeading})=>{
            trueHeading = parseInt(trueHeading.toString())
            if(trueHeading-old_heading < -10 || trueHeading-old_heading > 10){
                old_heading=trueHeading;
                setHeading(trueHeading)


                if(_compass){
                    try {
                        map.current.animateCamera({
                            center:{..._location},
                            pitch:90,
                            heading:trueHeading
                        });
                    }catch (e) {

                    }
                }
            }
        })
    }

    function findTarget() {
        ble.getDistanceAndDegree().then(({distance,azimuth,elevation,roll}:any)=>{
            if(!_location?.latitude)
                return;

            const target_location = findLocation(_location.latitude,_location.longitude,distance,azimuth,elevation)
            setTarget({...target_location,height:target_location.y_distance,distance:target_location.x_distance,azimuth,elevation,roll})

            setTimeout(()=>{
                try {
                    if(!_compass){
                        map.current.fitToCoordinates([{latitude:target_location.latitude,longitude:target_location.longitude},{latitude: _location.latitude, longitude: _location.longitude}],{edgePadding: { top: hp(10), right: hp(3), bottom: hp(20), left: hp(3) },animated:true})

                    }
                }catch (e) {}
            },1000)
        })
    }

    if (!location )
        return (
            <CView center>
                <SafeAreaView/>
                <Spinner color={Colors.primary} />
            </CView>
        );



    return (
        <Container>

            <SafeAreaView edges={['top']} style={{backgroundColor:Colors.darkGray}} />
            <CView flex={10}>
                <MapView
                    scrollEnabled={false}
                    //rotateEnabled={false}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    showsScale={true}
                    ref={map}
                    customMapStyle={require("../../assets/styles/googleMap.json")}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={location}
                    style={{
                        backgroundColor: "#fff",
                        alignItems: "center",
                        justifyContent: "center",
                        flex:1
                    }}

                >
                    {
                        location?
                            <Marker
                                anchor={{x: 0.5, y: 0.5}}
                                centerOffset={{x: 0.5, y: 0.5}}
                                icon={require("../../assets/images/radar.png")}
                                coordinate={location}
                                style ={{
                                    transform: [
                                        {
                                            rotate: (heading && !compass)?heading+"deg":"0deg",
                                        }
                                    ],


                                }}
                            />:null
                    }
                    {
                        target?.latitude?
                            <Marker
                                coordinate={{
                                    latitude:target.latitude,
                                    longitude:target.longitude,
                                }}
                            />:null
                    }

                    {
                        location && target?.latitude?
                            <Polyline
                                coordinates={[
                                    location,
                                    target
                                ]}
                                lineCap="butt"
                                strokeColor={Colors.lightGray}
                                strokeWidth={2}
                                lineDashPattern={[1]}
                            />:null
                    }

                </MapView>
                <CView style={{flex:1, position:'absolute',bottom:hp(2),right:hp(2),zIndex:9999}}>
                    <CView
                        colorHex="#ffffffaa" radius={100} padding="1"
                        onPress={()=>{
                            setCompass(!compass)
                            _compass = !compass
                            try {
                                if(_compass){
                                    map.current.animateCamera({
                                        center:{..._location},
                                        heading: heading,
                                        pitch: 90,
                                    });
                                }else{
                                    map.current.fitToCoordinates([{latitude:target.latitude,longitude:target.longitude},{latitude: location.latitude, longitude: location.longitude}],{edgePadding: { top: hp(10), right: hp(3), bottom: hp(20), left: hp(3) },animated:true})
                                }


                            }catch (e) {

                            }
                        }}
                    >
                        <MaterialCommunityIcons name={compass?"compass-off-outline":"compass-outline"} size={hp(4)} color={Colors.primary} />
                    </CView>
                </CView>
            </CView>
            <CView style={{flex:2}} color="darkGray" center padding="0 0 0 8">
                {
                    target?.distance?
                        <CView row vertical="center" horizontal="space-around">
                            <CView padding="3 0" flex={1}>
                                <FontText position="center" title={"yukseklik"} size={1.8} color="primary" bold/>
                                <FontText position="center" title={target.height+" km"} size={2.2} color="white" bold />
                            </CView>
                            <CView padding="3 0" flex={1}>
                                <FontText position="center" title={"mesafe2"} size={1.8} color="primary" bold/>
                                <FontText position="center" title={target.distance+" km"} size={2.2} color="white" bold />
                            </CView>
                        </CView>:
                        <Spinner color={Colors.white} />
                }
            </CView>
            <SafeAreaView edges={['bottom']} style={{backgroundColor:Colors.darkGray}} />

        </Container>

    );
}
