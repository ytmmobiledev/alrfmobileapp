//@ts-nocheck
import * as React from "react";
import { useEffect, useState } from "react";
import { CView } from "../../components/CView";
import { FontText } from "../../components/FontText";
import { hp } from "../../functions/responsiveScreen";
import { Container, Content, Spinner } from "native-base";
import { ActivityIndicator, DeviceEventEmitter } from "react-native";
import Colors from "../../constants/Colors";
import { observer } from "mobx-react-lite";
import DashedLine from "react-native-dashed-line";
import { Params } from "../../constants/Params";
import { IStore } from "../../stores/InstantStore";
import { string } from "../../locales";
import { CButton } from "../../components/CButton";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Device({ navigation }: any) {
  const ble = IStore.ble;
  const params = Params();
  const usage_params = {
    serial_no: params.serial_no,
    device_version: params.device_version,
    // temperature: params.temperature,
    // pressure: params.pressure,
    shot_counter: params.shot_counter,
    statuses: params.statuses,
  };

  const [data, setData] = useState(ble.getData());
  const [device_id, setDeviceID] = useState("loading");

  useFocusEffect(
    React.useCallback(() => {
      let listener = DeviceEventEmitter.addListener(
        "monitor",
        ({ all_data }) => {
          setData({ ...all_data });
        }
      );
      controlDevice();
      return () => {
        listener.remove();
      };
    }, [])
  );

  function reload() {
    setData({
      ...data,
      ...{
        serial_no: "",
        device_version: "",
        temperature: "",
        pressure: "",
        shot_counter: "",
        statuses: {
          odometer_activity: {
            title: "lazermesafeolceraktifligi",
            value: null,
          },
          compass_activity: {
            title: "pusulaaktifligi",
            value: null,
          },
          bluetooth_activity: {
            title: "bluetoothaktifligi",
            value: null,
          },
          odometer_error: {
            title: "lazermesafeolcerhatabilgisi",
            value: null,
          },
          compass_error: {
            title: "pusulahatabilgisi",
            value: null,
          },
          bluetooth_error: {
            title: "bluetoothhatabilgisi",
            value: null,
          },
          battery_error: {
            title: "bataryahatabilgisi",
            value: null,
          },
        },
      },
    });

    controlDevice();
  }

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
      if (param.getHex) ble.sendDataToDevice(key, param.getHex);
    }
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

  if (device_id == "loading") {
    return (
      <CView flex={1} center color="darkGray">
        <Spinner color={Colors.white} />
      </CView>
    );
  }

  return (
    <Container style={{ backgroundColor: Colors.darkGray }}>
      <CView
        padding="3 3 3 1"
        width="100%"
        row
        vertical="center"
        horizontal="space-between"
      >
        <FontText title={"cihazdurumbilgisi"} size={2.2} bold color="primary" />
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
      <Content bounces={false}>
        <CView style={{ flex: 1 }} center vertical="center" flex={1}>
          <CView padding="1" width="80%" radius={10} color="secondary">
            {Object.entries(usage_params).map(([key, { title }]) => {
              const value = data[key];

              return (
                <CView
                  key={key}
                  margin="1"
                  padding="1"
                  style={{
                    borderStyle: "dashed",
                    borderWidth: 1,
                    borderRadius: 1,
                    borderColor: "#667587",
                  }}
                >
                  <FontText padding="1" title={title} size={1.8} bold />
                  <DashedLine
                    dashLength={10}
                    dashThickness={hp(0.05)}
                    dashGap={0}
                    dashColor={"#4c5f72"}
                  />
                  <CView style={{ minHeight: hp(5) }}>
                    {value ? (
                      typeof value == "string" ? (
                        <FontText padding="1" title={value} size={1.8} bold />
                      ) : (
                        Object.values(value).map(({ title, value }, index) => (
                          <CView
                            row
                            vertical="center"
                            horizontal="space-between"
                            key={index}
                          >
                            <FontText
                              flex={2}
                              position="left"
                              padding="1"
                              title={title}
                              size={1.6}
                              bold
                            />
                            {value ? (
                              <FontText
                                flex={1}
                                position="right"
                                padding="1"
                                title={value}
                                size={1.6}
                                bold
                              />
                            ) : (
                              <ActivityIndicator
                                style={{
                                  flex: 1,
                                  height: hp(1),
                                  alignItems: "flex-end",
                                  padding: hp(1),
                                }}
                                color="#667587"
                                size="small"
                              />
                            )}
                          </CView>
                        ))
                      )
                    ) : (
                      <ActivityIndicator
                        style={{ alignSelf: "flex-start", padding: hp(1) }}
                        color="#667587"
                        size="small"
                      />
                    )}
                  </CView>
                </CView>
              );
            })}
          </CView>
        </CView>
        <CView height={hp(15)} />
      </Content>
    </Container>
  );
}

export default observer(Device);
