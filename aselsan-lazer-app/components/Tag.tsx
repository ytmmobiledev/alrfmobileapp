import * as React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { LangType, string } from "../locales";
import { hp } from "../functions/responsiveScreen";
import Colors from "../constants/Colors";
import { FontText } from "./FontText";
import { shadow } from "../functions/globalStyles";
import { Spinner } from "native-base";

interface PropsType {
  title: LangType | string;
  style?: StyleProp<ViewStyle>;
  color: string;
  backgroundColor?: string;
  onPress?: any;
  active?: boolean;
  size?: number;
  loading?: boolean;
  [key: string]: any;
}

export function Tag(props: PropsType) {
  let text_color = props.color ?? Colors.black;
  let bg_color = props.backgroundColor ?? Colors.white;

  if (props.active) {
    let copy = text_color;
    text_color = bg_color;
    bg_color = copy;
  }

  return (
    <TouchableOpacity
      disabled={!props.onPress}
      {...(props.onPress ? { onPress: props.onPress } : {})}
      style={[
        {
          backgroundColor: bg_color,
          borderRadius: 5,
          paddingVertical: hp(0.7),
          paddingHorizontal: hp(1.6),
          margin: hp(0.8),
          ...shadow,
        },
        props.style,
      ]}
    >
      {props.loading ? (
        <Spinner color={Colors.primary} />
      ) : (
        <FontText
          title={props["title"]}
          size={props.size ?? 1.7}
          colorHex={text_color}
          position="center"
          bold
        />
      )}
    </TouchableOpacity>
  );
}
