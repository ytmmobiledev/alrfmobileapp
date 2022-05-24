//@ts-nocheck

import React, { useState } from "react";
import { View, Button, Platform, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontText } from "./FontText";
import Colors from "../constants/Colors";
import { l_moment } from "../functions/cMoment";
import { string } from "../locales";

const DatePicker = ({
  mode = "date",
  onConfirm = (date:any) => {},
  minuteInterval = 1,
  style = {},
  defaultValue,
}: any) => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <View>
      <View
        style={{
          ...style,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setVisible(true);
          }}
        >
          <FontText
            position="center"
            title={
              selected
                ? l_moment(selected).format(
                    mode == "date"
                      ? "DD MM YYYY"
                      : mode == "datetime"
                      ? "DD MM YYYY HH:mm"
                      : "HH:mm"
                  )
                : defaultValue
                ? defaultValue.format(
                    mode == "date"
                      ? "DD MM YYYY"
                      : mode == "datetime"
                      ? "DD MM YYYY HH:mm"
                      : "HH:mm"
                  )
                : mode == "date" || mode == "datetime"
                ? "tarihsec"
                : "saatsec"
            }
            size={2}
            color={"gray"}
            bold
          />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        {...(selected
          ? { date: selected }
          : defaultValue
          ? { date: defaultValue.toDate() }
          : {})}
        confirmTextIOS={"Seç"}
        cancelTextIOS={"İptal"}
        isVisible={visible}
        mode={mode}
        onConfirm={(date: any) => {
          setSelected(date);
          onConfirm(date);
          setVisible(false);
        }}
        minuteInterval={minuteInterval}
        locale={string.dil == "tr" ? "tr_TR" : "en_EN"}
        is24Hour
        onCancel={() => {
          setVisible(false);
        }}
      />
    </View>
  );
};

export default DatePicker;
