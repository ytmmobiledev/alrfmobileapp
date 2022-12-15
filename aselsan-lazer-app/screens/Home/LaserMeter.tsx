//@ts-nocheck

import * as React from "react";
import { CView } from "../../components/CView";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  Callout,
} from "react-native-maps";
import { hp, wp } from "../../functions/responsiveScreen";
import { Container, Spinner } from "native-base";
import Colors from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { IStore } from "../../stores/InstantStore";
import { findLocation } from "../../functions/findLocation";
import { FontText } from "../../components/FontText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Observer, observer } from "mobx-react-lite";
import { info, success } from "../../functions/toast";
import {
  Animated,
  DeviceEventEmitter,
  Easing,
  Text,
  Share,
} from "react-native";
import { Params } from "../../constants/Params";
import { distanceConversion } from "../../functions/Conversions";
import { CImage } from "../../components/CImage";
import Swiper from "react-native-swiper";
import { DistanceUnitTypes } from "../../constants/Config";
import { string } from "../../locales";
import DashedLine from "react-native-dashed-line";
import { MainStore } from "../../stores/MainStore";
import * as Clipboard from "expo-clipboard";
//@ts-ignore
const utmObj = require("utm-latlng");

let _compass: boolean = false;
let old_heading = 0;
let _location: any = {};

function LaserMeter({ navigation }: any) {
  const ble = IStore.ble;
  const param = Params();

  const map: any = useRef();
  const swiper: any = useRef();

  const [location, setLocation]: any = useState(null);
  const [targets, setTargets]: any = useState(null);
  const [select_target, setSelectTarget]: any = useState(0);
  const [heading, setHeading] = useState(old_heading);
  const [compass, setCompass] = useState(_compass);
  const [distance_unit, setDistanceUnit]: any = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert(string["konumizni"]);
        return;
      }

      getCompass();
      await getLocation();
    })();
  }, []);

  async function getLocation() {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      timeInterval: 10000,
      distanceInterval: 1,
    });
    _location = {
      ...coords,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setLocation(_location);
  }

  useFocusEffect(
    React.useCallback(() => {
      let listener = DeviceEventEmitter.addListener(
        "distance_and_compass",
        ({
          distance,
          distance_unit,
          angle_unit,
          azimuth,
          elevation,
          roll,
        }: any) => {
          setLoading(false);
          if (!_location?.latitude) return;

          const target_locations = [];

          for (const val of distance) {
            let target = findLocation(
              _location.latitude,
              _location.longitude,
              val,
              azimuth,
              elevation,
              angle_unit,
              distance_unit
            );
            target_locations.push({
              ...target,
              height: target.y_distance,
              distance: target.x_distance,
            });
          }

          setTargets([...target_locations]);

          setDistanceUnit({
            unit: distanceConversion(distance, distance_unit, distance_unit)
              .unit,
            id: distance_unit,
          });

          setTimeout(() => {
            try {
              if (!_compass) {
                map.current.fitToCoordinates(
                  [
                    ...target_locations.map(({ latitude, longitude }) => ({
                      latitude,
                      longitude,
                    })),
                    {
                      latitude: _location.latitude,
                      longitude: _location.longitude,
                    },
                  ],
                  {
                    edgePadding: {
                      top: hp(10),
                      right: hp(3),
                      bottom: hp(20),
                      left: hp(3),
                    },
                    animated: true,
                  }
                );
              }
            } catch (e) {}
          }, 1000);
        }
      );

      return () => {
        listener.remove();
      };
    }, [])
  );

  function controlDevice() {
    setTargets([]);
    const device_id = ble.getDeviceID();

    if (device_id) {
      findTarget();
    } else {
      navigation.navigate("ConnectDevice");
    }
  }

  async function getCompass() {
    Location.watchHeadingAsync(({ trueHeading }) => {
      trueHeading = parseInt(trueHeading.toString());
      if (trueHeading - old_heading < -10 || trueHeading - old_heading > 10) {
        old_heading = trueHeading;
        setHeading(trueHeading);

        if (_compass) {
          try {
            map.current.animateCamera({
              center: { ..._location },
              pitch: 90,
              heading: trueHeading,
            });
          } catch (e) {}
        }
      }
    });
  }

  async function findTarget() {
    info(string["atisyapiliyor"]);
    setLoading(true);
    await getLocation();
    ble.sendDataToDevice(
      "distance_and_compass",
      param.distance_and_compass.getHex
    );
  }

  function ConvertDDToDMS(D) {
    return [
      0 | D,
      "D ",
      0 | (((D = (D < 0 ? -D : D) + 1e-4) % 1) * 60),
      "' ",
      0 | (((D * 60) % 1) * 60),
      '"',
    ].join("");
  }

  if (!location)
    return (
      <CView center>
        <SafeAreaView />
        <Spinner color={Colors.primary} />
      </CView>
    );

  const target_len = Array.isArray(targets) ? targets.length : 0;

  const utm = new utmObj();

  return (
    <Container>
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: Colors.darkGray }}
      />
      <CView flex={1}>
        <MapView
          //scrollEnabled={false}
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
            flex: 1,
          }}
        >
          {location ? (
            <Marker
              anchor={{ x: 0.5, y: 0.5 }}
              centerOffset={{ x: 0.5, y: 0.5 }}
              icon={require("../../assets/images/radar.png")}
              coordinate={location}
              style={{
                transform: [
                  {
                    rotate: heading && !compass ? heading + "deg" : "0deg",
                  },
                ],
              }}
            />
          ) : null}
          {target_len
            ? targets.map(({ latitude, longitude }: any, index: number) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude,
                    longitude,
                  }}
                  onPress={() => {
                    try {
                      swiper.current.scrollBy(index - select_target);
                    } catch (e) {}

                    setSelectTarget(index);
                  }}
                >
                  <CView center flex={1}>
                    <CImage
                      background
                      style={{ justifyContent: "center", alignItems: "center" }}
                      source={
                        target_len > 1
                          ? require("../../assets/images/placeholder-full.png")
                          : require("../../assets/images/placeholder.png")
                      }
                      orgHeight={30}
                      orgWidth={30}
                      resizeMode="stretch"
                    >
                      {target_len > 1 ? (
                        <Text
                          style={{
                            bottom: 5,
                            fontSize: 15,
                            color: Colors.white,
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </Text>
                      ) : null}
                    </CImage>
                  </CView>
                </Marker>
              ))
            : null}

          {location && target_len
            ? targets.map(({ latitude, longitude }: any, index: number) => (
                <Polyline
                  key={index}
                  coordinates={[location, { latitude, longitude }]}
                  lineCap="butt"
                  strokeColor={Colors.lightGray}
                  strokeWidth={2}
                  lineDashPattern={[1]}
                />
              ))
            : null}
        </MapView>

        <CView
          vertical={"flex-end"}
          style={{
            flex: 1,
            position: "absolute",
            bottom: hp(1),
            right: hp(1),
            zIndex: 9999,
          }}
        >
          <CView
            width={hp(6)}
            height={hp(6)}
            colorHex="#ffffffaa"
            radius={100}
            padding="1"
            onPress={() => {
              setCompass(!compass);
              _compass = !compass;
              try {
                if (_compass) {
                  map.current.animateCamera({
                    center: { ..._location },
                    heading: heading,
                    pitch: 90,
                  });
                } else {
                  map.current.fitToCoordinates(
                    [
                      ...targets.map(({ latitude, longitude }) => ({
                        latitude,
                        longitude,
                      })),
                      {
                        latitude: location.latitude,
                        longitude: location.longitude,
                      },
                    ],
                    {
                      edgePadding: {
                        top: hp(10),
                        right: hp(3),
                        bottom: hp(20),
                        left: hp(3),
                      },
                      animated: true,
                    }
                  );
                }
              } catch (e) {}
            }}
          >
            <MaterialCommunityIcons
              name={compass ? "compass-off-outline" : "compass-outline"}
              size={hp(4)}
              color={Colors.primary}
            />
          </CView>
        </CView>
      </CView>
      <CView style={{ flex: 1 }} color="darkGray" center padding="0 0 0 10">
        {loading ? (
          <Spinner color={Colors.white} />
        ) : target_len ? (
          <CView flex={1}>
            <CView row center>
              {target_len > 1 ? (
                targets.map((_: any, index: number) => (
                  <CView
                    onPress={() => {
                      try {
                        swiper.current.scrollBy(index - select_target);
                      } catch (e) {}

                      setSelectTarget(index);
                    }}
                    style={{ zIndex: 999 }}
                    padding="2"
                    key={index}
                    flex={1}
                    row
                    center
                  >
                    <FontText
                      underline
                      title={string.mesafe2 + " " + (index + 1)}
                      size={select_target == index ? 2 : 1.7}
                      bold
                      color={select_target == index ? "white" : "text"}
                    />
                  </CView>
                ))
              ) : (
                <CView height={hp(5)} />
              )}
            </CView>
            <Swiper
              ref={swiper}
              showsPagination={false}
              loop={false}
              autoplay={false}
              onIndexChanged={(index) => {
                try {
                  let target = targets[index];
                  map.current.animateCamera(
                    {
                      center: {
                        latitude: target.latitude,
                        longitude: target.longitude,
                      },
                      pitch: 0,
                    },
                    { duration: 500 }
                  );
                  setSelectTarget(index);
                } catch (e) {}
              }}
            >
              {target_len ? (
                targets.map((target: any, index: number) => (
                  <CView key={index} flex={1} center>
                    <CView
                      flex={1}
                      width={"90%"}
                      margin="1 2"
                      padding="2"
                      style={{ alignSelf: "center", borderRadius: 20 }}
                      colorHex={Colors.primary + "20"}
                    >
                      <CView row vertical="center" horizontal="space-around">
                        <CView center>
                          <CImage
                            source={require("../../assets/images/distance.png")}
                            width={4}
                            height={4}
                          />
                          <CView row center>
                            <FontText
                              position="center"
                              title={
                                parseFloat(target.distance).toFixed(2) +
                                distance_unit.unit
                              }
                              size={1.8}
                              color="white"
                              bold
                            />
                          </CView>
                          <FontText
                            position="center"
                            title={string.mesafe2 + "\n"}
                            size={1.4}
                            color="primary"
                            bold
                          />
                        </CView>
                        <CView center>
                          <CImage
                            source={require("../../assets/images/target.png")}
                            width={4}
                            height={4}
                          />
                          <CView row center>
                            <FontText
                              position="center"
                              title={
                                "±" +
                                parseFloat(
                                  distanceConversion(
                                    location.accuracy,
                                    DistanceUnitTypes.Metre.id,
                                    distance_unit.id
                                  ).distance
                                ).toFixed(2) +
                                distance_unit.unit
                              }
                              size={1.8}
                              color="white"
                              bold
                            />
                          </CView>
                          <FontText
                            position="center"
                            title={"konumdogrulugu"}
                            size={1.4}
                            color="primary"
                            bold
                          />
                        </CView>
                        <CView center>
                          <CImage
                            source={require("../../assets/images/height.png")}
                            width={4}
                            height={4}
                          />
                          <CView row center>
                            <FontText
                              position="center"
                              title={
                                parseFloat(
                                  target.height + location.altitude ?? 0
                                ).toFixed(2) + distance_unit.unit
                              }
                              size={1.8}
                              color="white"
                              bold
                            />
                            {location.altitudeAccuracy ? (
                              <FontText
                                position="center"
                                title={
                                  " ±" +
                                  parseInt(
                                    distanceConversion(
                                      location.altitudeAccuracy,
                                      DistanceUnitTypes.Metre.id,
                                      distance_unit.id
                                    ).distance
                                  )
                                }
                                size={1.5}
                                color="white"
                                bold
                              />
                            ) : null}
                          </CView>
                          <FontText
                            position="center"
                            title={string.yukseklik + "\n"}
                            size={1.4}
                            color="primary"
                            bold
                          />
                        </CView>
                      </CView>
                    </CView>

                    <CView
                      width="90%"
                      vertical="center"
                      horizontal="center"
                      margin="0 0 1 0"
                    >
                      <CView
                        onPress={controlDevice}
                        padding="1 2"
                        radius={20}
                        row
                        center
                        color="primary"
                      >
                        <FontText
                          position="center"
                          title={"atisyap"}
                          size={1.8}
                          color="white"
                          bold
                        />
                        <CImage
                          source={require("../../assets/images/measure.png")}
                          resizeMode="contain"
                          width={2.5}
                          height={2.5}
                        />
                      </CView>
                    </CView>

                    <CView
                      flex={1}
                      width="90%"
                      margin="0 0 0 0"
                      padding="0 0 0 3.2"
                      row
                      vertical="center"
                      horizontal="space-around"
                    >
                      <CView
                        flex={1}
                        center
                        onPress={() => {
                          IStore.setCustomModal({
                            visible: true,
                            children: () => (
                              <Observer
                                render={() => (
                                  <CView center>
                                    {location?.latitude &&
                                    location?.longitude ? (
                                      <CView center>
                                        <FontText
                                          padding="0 0 0 2"
                                          position="center"
                                          title={"KONUMUM"}
                                          underline
                                          size={2}
                                          color="white"
                                          bold
                                        />
                                        <FontText
                                          position="center"
                                          title={
                                            MainStore.hedefkonumgosterimtipi ==
                                            "utm"
                                              ? utm.convertLatLngToUtm(
                                                  location.latitude,
                                                  location.longitude,
                                                  3
                                                ).Easting +
                                                " " +
                                                string["saga"]
                                              : ConvertDDToDMS(
                                                  location.latitude
                                                ) + " N"
                                          }
                                          size={1.8}
                                          color="white"
                                          bold
                                        />
                                        <FontText
                                          position="center"
                                          title={
                                            MainStore.hedefkonumgosterimtipi ==
                                            "utm"
                                              ? utm.convertLatLngToUtm(
                                                  location.latitude,
                                                  location.longitude,
                                                  3
                                                ).Northing +
                                                " " +
                                                string["yukariya"]
                                              : ConvertDDToDMS(
                                                  location.longitude
                                                ) + " E"
                                          }
                                          size={1.8}
                                          color="white"
                                          bold
                                        />
                                      </CView>
                                    ) : null}
                                  </CView>
                                )}
                              />
                            ),
                          });
                        }}
                      >
                        <CView
                          center
                          width={hp(3)}
                          height={hp(3)}
                          radius={100}
                          color="primary"
                        >
                          <CView
                            width={hp(2.5)}
                            height={hp(2.5)}
                            radius={100}
                            color="primary"
                            style={{
                              borderWidth: 1.5,
                              borderColor: Colors.white,
                            }}
                          />
                        </CView>
                        <CView center>
                          <FontText
                            title={"Konumumu Gör"}
                            position="center"
                            size={1.6}
                            color="white"
                            bold
                          />
                        </CView>
                      </CView>
                      <CView flex={1.5} height={10} horizontal="center">
                        <FontText title={"test"} size={2} />

                        <DashedLine
                          dashLength={hp(0.6)}
                          dashThickness={hp(0.16)}
                          dashGap={hp(0.3)}
                          dashColor={Colors.text}
                        />
                      </CView>
                      <CView flex={1} center>
                        <CImage
                          source={require("../../assets/images/placeholder.png")}
                          width={3}
                          height={3}
                        />
                        {target?.latitude && target?.longitude ? (
                          <CView center>
                            <FontText
                              position="center"
                              title={
                                MainStore.hedefkonumgosterimtipi == "utm"
                                  ? utm.convertLatLngToUtm(
                                      target.latitude,
                                      target.longitude,
                                      3
                                    ).Easting +
                                    " " +
                                    string["saga"]
                                  : ConvertDDToDMS(target.latitude) + " N"
                              }
                              size={1.6}
                              color="white"
                              bold
                            />
                            <FontText
                              position="center"
                              title={
                                MainStore.hedefkonumgosterimtipi == "utm"
                                  ? utm.convertLatLngToUtm(
                                      target.latitude,
                                      target.longitude,
                                      3
                                    ).Northing +
                                    " " +
                                    string["yukariya"]
                                  : ConvertDDToDMS(target.longitude) + " E"
                              }
                              size={1.6}
                              color="white"
                              bold
                            />
                            <CView
                              onPress={() => {
                                let txt =
                                  MainStore.hedefkonumgosterimtipi == "utm"
                                    ? utm.convertLatLngToUtm(
                                        target.latitude,
                                        target.longitude,
                                        3
                                      ).Easting +
                                      " " +
                                      string["saga"]
                                    : ConvertDDToDMS(target.latitude) + " N";

                                txt += "\n";

                                txt +=
                                  MainStore.hedefkonumgosterimtipi == "utm"
                                    ? utm.convertLatLngToUtm(
                                        target.latitude,
                                        target.longitude,
                                        3
                                      ).Northing +
                                      " " +
                                      string["yukariya"]
                                    : ConvertDDToDMS(target.longitude) + " E";

                                Clipboard.setStringAsync(txt);

                                /*Share.share({
                                message: txt,
                              });*/

                                success(string["hedefkonumkopyalandi"]);
                              }}
                              margin="0 0 1 0"
                              padding="1 2"
                              radius={20}
                              row
                              center
                              color="primary"
                            >
                              <FontText
                                position="center"
                                title={"paylas"}
                                size={1.8}
                                color="white"
                                bold
                                margin="0 1 0 0"
                              />
                              <CImage
                                source={require("../../assets/images/share.png")}
                                resizeMode="contain"
                                width={1.8}
                                height={1.8}
                              />
                            </CView>
                          </CView>
                        ) : null}
                      </CView>
                    </CView>

                    {/*<CView center flex={target?.distance?1:0}>
                                                    {
                                                        target?.distance?
                                                            <CView center flex={1}>
                                                                <CView center flex={1}>
                                                                    <FontText position="center" title={"yukseklik"} size={1.8} color="primary" bold/>
                                                                    <FontText position="center" title={parseFloat(target.height).toFixed(2)+distance_unit} size={2.2} color="white" bold />
                                                                </CView>
                                                                <CView center flex={1}>
                                                                    <FontText position="center" title={"mesafe2"} size={1.8} color="primary" bold/>
                                                                    <FontText position="center" title={parseFloat(target.distance).toFixed(2)+distance_unit} size={2.2} color="white" bold />
                                                                </CView>

                                                            </CView>
                                                            : null
                                                    }
                                                </CView>
                                                <CView center flex={1}>
                                                    {
                                                        target?.latitude && target?.longitude?
                                                            <CView flex={1} center>
                                                                <FontText position="center" title={ConvertDDToDMS(target.latitude)+" N"} size={1.7} color="white" bold />
                                                                <FontText position="center" title={ConvertDDToDMS(target.longitude)+" E"} size={1.7} color="white" bold />
                                                            </CView>:null
                                                    }


                                                </CView>*/}
                  </CView>
                ))
              ) : (
                <CView />
              )}
            </Swiper>
          </CView>
        ) : null}
        {!target_len && !loading && (
          <CView
            width="90%"
            vertical="center"
            horizontal="center"
            margin="0 0 1 0"
          >
            <CView
              onPress={controlDevice}
              padding="1 2"
              radius={20}
              row
              center
              color="primary"
            >
              <FontText
                position="center"
                title={"atisyap"}
                size={1.8}
                color="white"
                bold
              />
              <CImage
                source={require("../../assets/images/measure.png")}
                resizeMode="contain"
                width={2.5}
                height={2.5}
              />
            </CView>
          </CView>
        )}
      </CView>
      <SafeAreaView
        edges={["bottom"]}
        style={{ backgroundColor: Colors.darkGray }}
      />
    </Container>
  );
}

export default observer(LaserMeter);
