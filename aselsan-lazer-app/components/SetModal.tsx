//@ts-nocheck
import * as React from "react";

import { observer } from "mobx-react-lite";
import { IStore } from "../stores/InstantStore";
import { CView } from "./CView";
import { ActivityIndicator, TextInput, View } from "react-native";
import { hp } from "../functions/responsiveScreen";
import { CImage } from "./CImage";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";
import { FontText } from "./FontText";
import { Feather } from "@expo/vector-icons";
import DashedLine from "react-native-dashed-line";
import { useEffect, useState } from "react";
import MaskInput, { createNumberMask } from "react-native-mask-input";
import { error } from "../functions/toast";
import { l_moment } from "../functions/cMoment";

export const setModalTypes = {
  Select: "select",
  Number: "number",
};

function SetModal() {
  const {
    visible,
    title = "",
    description = "",
    icon = require("../assets/images/cihaz2.png"),
    value,
    options,
    type,
    numberParams = {},
    onChange = async (data: any) => {},
  } = IStore.set_modal;

  const [defaultValue, setDefaultValue]: any = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type == setModalTypes.Number) {
      let value1 = value.substr(0, value.length - numberParams?.fixed);
      let value2 = value.substr(numberParams?.fixed * -1);
      setDefaultValue([value1, value2]);
    } else {
      setDefaultValue(value);
    }
  }, [value]);

  return (
    <Modal
      style={{ margin: 0 }}
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackButtonPress={() => {
        IStore.setSetModal({ visible: false });
      }}
      onBackdropPress={() => {
        IStore.setSetModal({ visible: false });
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            maxHeight: hp(95),
            backgroundColor: Colors.darkGray,
            width: "85%",
            borderRadius: 10,
          }}
        >
          {icon ? (
            <View style={{ alignSelf: "flex-end" }}>
              <CImage
                imageStyle={{ borderTopRightRadius: 10 }}
                source={require("../assets/images/modal/corner.png")}
                width={8}
                height={7}
                background
              >
                <CView
                  style={{ marginLeft: hp(2), marginBottom: hp(1) }}
                  center
                  flex={1}
                >
                  <CImage source={icon} height={3} width={3} />
                </CView>
              </CImage>
            </View>
          ) : (
            <View style={{ height: hp(3) }} />
          )}
          <View style={{ padding: hp(3), paddingTop: 0 }}>
            <CView>
              {title ? (
                <FontText title={title} size={1.8} bold position="center" />
              ) : null}
              {description ? (
                <FontText
                  title={description}
                  size={1.5}
                  bold
                  position="center"
                />
              ) : null}
              <CView center width="100%" padding="2">
                {type == setModalTypes.Select ? (
                  <Select
                    defaultValue={defaultValue}
                    options={options}
                    onChange={(data: any) => {
                      setDefaultValue(data);
                    }}
                  />
                ) : type == setModalTypes.Number ? (
                  <Number
                    numberParams={numberParams}
                    defaultValue={defaultValue}
                    onChange={(data: any) => {
                      setDefaultValue(data);
                    }}
                  />
                ) : null}
              </CView>
              <CView
                padding="0 0 2 0"
                row
                vertical="center"
                horizontal="space-around"
              >
                <CView flex={1} center>
                  <FontText
                    onPress={() => IStore.setSetModal({ visible: false })}
                    position="center"
                    title={"kapat"}
                    size={2}
                    bold
                    padding="2"
                    color="primary"
                  />
                </CView>
                <CView flex={1} center>
                  {loading ? (
                    <ActivityIndicator
                      style={{ padding: hp(2) }}
                      color="#667587"
                      size="small"
                    />
                  ) : (
                    <FontText
                      onPress={() => {
                        let value: any = defaultValue;

                        if (type == setModalTypes.Number) {
                          let { fixed, min, max, unit = "" } = numberParams;

                          value = parseInt(
                            parseInt(defaultValue[0] ? defaultValue[0] : "0") +
                              "" +
                              (fixed
                                ? parseInt(
                                    defaultValue[1] ? defaultValue[1] : 0
                                  )
                                : "")
                          );

                          if (
                            isNaN(value) ||
                            !/^-?\d+$/.test(value.toString())
                          ) {
                            error("Geçersiz Veri");
                            return;
                          }
                          if (min != undefined && value < min) {
                            if (fixed) {
                              min = min / Math.pow(10, fixed);
                            }
                            error("Minimum " + min + " " + unit);
                            return;
                          }
                          if (max != undefined && value > max) {
                            if (fixed) {
                              max = max / Math.pow(10, fixed);
                            }
                            error("Maximum " + max + " " + unit);
                            return;
                          }
                        }

                        setLoading(true);
                        onChange(value).then(() => {
                          setLoading(false);
                          IStore.setSetModal({ visible: false });
                        });
                      }}
                      position="center"
                      title={"kaydet"}
                      size={2}
                      bold
                      padding="2"
                      color="primary"
                    />
                  )}
                </CView>
              </CView>
            </CView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Select({ defaultValue, options, onChange }: any) {
  return (
    <CView>
      {Array.isArray(options)
        ? options.map(({ id, value }: any) => (
            <CView
              key={id}
              width={"100%"}
              onPress={() => {
                onChange(id);
              }}
            >
              <CView
                padding="1"
                width="100%"
                row
                vertical="center"
                horizontal="space-between"
              >
                <FontText flex={1} padding="1" title={value} size={1.5} bold />
                <Feather
                  name={defaultValue == id ? "check-circle" : "circle"}
                  size={hp(2.2)}
                  color={Colors.text}
                />
              </CView>
              <DashedLine
                dashLength={hp(0.6)}
                dashThickness={hp(0.16)}
                dashGap={hp(0.3)}
                dashColor={Colors.text}
              />
            </CView>
          ))
        : null}
    </CView>
  );
}

function Number({ defaultValue = [], onChange, numberParams = {} }: any) {
  const { fixed = 0, min = 0, max = 0, unit = "" } = numberParams;

  let value1: any = defaultValue[0];
  let value2: any = defaultValue[1];

  return (
    <CView width={"100%"}>
      <CView
        row
        vertical="center"
        horizontal="space-between"
        style={{
          borderStyle: "dashed",
          borderWidth: 1,
          borderRadius: 1,
          borderColor: "#667587",
        }}
      >
        <CView flex={1} row center>
          <TextInput
            keyboardType="decimal-pad"
            style={{
              flex: 1,
              textAlign: fixed ? "right" : "center",
              padding: hp(2),
              paddingRight: 0,
              fontSize: hp(2),
              color: Colors.text,
            }}
            defaultValue={value1}
            placeholderTextColor={Colors.text}
            onChangeText={(value: any) => {
              onChange([value, value2]);
            }}
          />

          {fixed ? <FontText padding="0 1" title={","} size={2} bold /> : null}
          {fixed ? (
            <TextInput
              maxLength={fixed}
              keyboardType="decimal-pad"
              style={{
                flex: 1,
                textAlign: "left",
                padding: hp(2),
                paddingLeft: 0,
                fontSize: hp(2),
                color: Colors.text,
              }}
              defaultValue={value2}
              placeholderTextColor={Colors.text}
              onChangeText={(value: any) => {
                onChange([value1, value]);
              }}
            />
          ) : null}
        </CView>
        <FontText padding="0 1" title={unit} size={1.4} bold />
      </CView>
    </CView>
  );
}

export default observer(SetModal);
