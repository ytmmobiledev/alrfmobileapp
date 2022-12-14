//@ts-nocheck
import * as React from "react";
import { useEffect, useState } from "react";
import { CView } from "../../components/CView";
import { FontText } from "../../components/FontText";
import { hp } from "../../functions/responsiveScreen";
import { Container, Content } from "native-base";
import Colors from "../../constants/Colors";
import { observer } from "mobx-react-lite";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { IStore } from "../../stores/InstantStore";
import { Params } from "../../constants/Params";
import { ActivityIndicator, Alert, DeviceEventEmitter } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CButton } from "../../components/CButton";
import { string } from "../../locales";
import { MainStore } from "../../stores/MainStore";
import { setModalTypes } from "../../components/SetModal";
import * as Location from "expo-location";

//@ts-ignore
const geomagnetism = require("geomagnetism");

let _location: any = {};
const delay = (delayInms: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

function Settings({ navigation }: any) {
  const ble = IStore.ble;
  const params = Params();
  const usage_params = {
    distance_unit: params.distance_unit,
    article_mode: params.article_mode,
    language: params.language,
    angle_unit_type: params.angle_unit_type,
    night_vision_mode: params.night_vision_mode,
    device_sleep_time: params.device_sleep_time,
    bluetooth_sleep_time: params.bluetooth_sleep_time,
    bottom_door_lock: params.bottom_door_lock,
    top_door_lock: params.top_door_lock,
    magnetic_declination_angle: params.magnetic_declination_angle,
  };

  const [data, setData] = useState(ble.getData());
  const [device_id, setDeviceID] = useState("loading");
  const [location, setLocation]: any = useState(null);

  function magneticAngle(coords) {
    const info = geomagnetism
      .model()
      .point([coords.latitude, coords.longitude]);

    if (info?.decl) {
      IStore.decl = Number(parseFloat(info!.decl).toFixed(1));
      ble.sendDataToDevice(
        params.magnetic_declination_angle.title,
        params.magnetic_declination_angle.getHex
      );
    }
  }
  async function getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert(string["konumizni"]);
      return {};
    }

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

    return coords;
  }

  useFocusEffect(
    React.useCallback(() => {
      let listener = DeviceEventEmitter.addListener(
        "monitor",
        ({ all_data }) => {
          setData({ ...all_data });
        }
      );
      controlDevice();
      getLocation().then((res) => {
        magneticAngle(res);
      });
      return () => {
        listener.remove();
      };
    }, [])
  );

  async function controlDevice() {
    const device_id = ble.getDeviceID();
    setDeviceID(device_id);

    if (device_id) {
      await getValues();
    } else {
      navigation.navigate("ConnectDevice");
    }
  }

  async function getValues() {
    for (let [key, param] of Object.entries(usage_params)) {
      if (param.getHex) {
        await delay(50);
        ble.sendDataToDevice(key, param.getHex);
      }
    }
  }

  function reload() {
    controlDevice();
  }

  if (!device_id) {
    return (
      <CView flex={1} center color="darkGray">
        <FontText position="center" padding="2" title={"101"} size={2} />
        <CButton
          title="simdibaglan"
          onPress={() => {
            navigation.navigate("ConnectDevice");
          }}
        />
      </CView>
    );
  }

  return (
    <Container style={{ backgroundColor: Colors.darkGray }}>
      <Content bounces={false}>
        <CView style={{ flex: 1 }} center vertical="center" flex={1}>
          <FontText
            flex={1}
            title={"LOGO"}
            size={3.5}
            bold
            padding={"0 0 4 0"}
          />

          <CView
            padding="3"
            width="100%"
            row
            vertical="center"
            horizontal="space-between"
          >
            <FontText title={"ayarlar"} size={2.2} bold color="primary" />

            <CView
              padding="1"
              onPress={() => {
                reload();
              }}
            >
              <MaterialCommunityIcons
                name="reload"
                size={hp(3)}
                color={Colors.white}
              />
            </CView>
          </CView>
          <CView padding="0.5" width="90%" radius={10}>
            {Object.entries(usage_params).map(
              (
                [
                  key,
                  {
                    title,
                    setHex = (id: number) => {},
                    options,
                    type,
                    numberParams = {},
                  },
                ]: any,
                index: number
              ) => {
                const value = data[key];

                return (
                  <CView
                    key={index}
                    row
                    vertical="center"
                    horizontal="space-between"
                    padding="1"
                    margin="1 0"
                    radius={10}
                    color="secondary"
                    onPress={() => {
                      if (value) {
                        IStore.setSetModal({
                          visible: true,
                          title,
                          value: value?.id ?? value,
                          type,
                          numberParams,
                          options: options ? Object.values(options) : null,
                          onChange: async (id: number) => {
                            if (key === "night_vision_mode" && id == 1) {
                              Alert.alert(
                                string["uyari"],
                                string["ekranparlakligi"],
                                [
                                  {
                                    text: string["hayir"],
                                    style: "cancel",
                                  },
                                  {
                                    text: string["evet"],
                                    onPress: async () => {
                                      ble.sendDataToDevice(key, setHex(id));
                                    },
                                  },
                                ],
                                {
                                  cancelable: true,
                                }
                              );
                            } else ble.sendDataToDevice(key, setHex(id));
                            return true;
                          },
                        });
                      }
                    }}
                  >
                    <FontText title={title} size={1.7} bold />
                    <CView row center>
                      {value ? (
                        <FontText
                          padding="1"
                          title={
                            value?.value ??
                            (numberParams?.fixed
                              ? value / (numberParams?.fixed * 10)
                              : value) +
                              "" +
                              (numberParams?.unit
                                ? " " + numberParams?.unit
                                : "")
                          }
                          size={1.7}
                        />
                      ) : (
                        <ActivityIndicator
                          style={{ alignSelf: "flex-start", padding: hp(1) }}
                          color="#667587"
                          size="small"
                        />
                      )}
                      <MaterialIcons
                        name="navigate-next"
                        size={hp(4)}
                        color={Colors.text}
                      />
                    </CView>
                  </CView>
                );
              }
            )}
            <CView
              row
              vertical="center"
              horizontal="space-between"
              padding="1"
              margin="1 0"
              radius={10}
              color="secondary"
              onPress={() => {
                IStore.setSetModal({
                  visible: true,
                  title: string["hedefkonumgosterimformati"],
                  value: MainStore.hedefkonumgosterimtipi,
                  type: setModalTypes.Select,
                  options: [
                    {
                      id: "utm",
                      value: string["utm"],
                    },
                    {
                      id: "latlong",
                      value: string["latlong"],
                    },
                  ],
                  onChange: async (id: "utm" | "latlong") => {
                    MainStore.hedefkonumgosterimtipi = id;
                    return true;
                  },
                });
              }}
            >
              <FontText
                title={string["hedefkonumgosterimformati"]}
                size={1.7}
                bold
              />
              <CView row center>
                <FontText
                  padding="1"
                  title={MainStore.hedefkonumgosterimtipi}
                  size={1}
                />
                <MaterialIcons
                  name="navigate-next"
                  size={hp(4)}
                  color={Colors.text}
                />
              </CView>
            </CView>
          </CView>

          <CView height={hp(13)} />
        </CView>
      </Content>
    </Container>
  );
}

export default observer(Settings);
