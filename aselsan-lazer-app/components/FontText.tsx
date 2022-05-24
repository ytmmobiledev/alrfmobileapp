import * as React from "react";
import { Text, StyleProp, ViewStyle } from "react-native";
import { createPaddingStyle } from "../functions/createPadding";
import { createMarginStyle } from "../functions/createMargin";
import { hp } from "../functions/responsiveScreen";
import { string } from "../locales";
import { LangType } from "../locales";
import Colors from "../constants/Colors";

export type ColorProps = keyof typeof Colors;

interface PropsType {
  title: LangType | string;
  size: number;
  color?: ColorProps;
  colorHex?: string;
  numberOfLines?: number;
  position?: "left" | "right" | "center";
  style?:
    | StyleProp<ViewStyle>
    | { textDecorationLine?: string; [key: string]: any };
  bold?: boolean;
  underline?: boolean;
  light?: boolean;
  flex?: number;
  padding?: string;
  margin?: string;
  onPress?: any;
  children?: any;
  [key: string]: any;
}

export const FontTypes = {
  Comfortaa: {
    Light: "comfortaa-light",
    Normal: "comfortaa",
    Bold: "comfortaa-bold",
  },
};

export function FontText(props: PropsType) {
  return (
    <Text
      {...(props.onPress ? { onPress: props.onPress } : {})}
      {...(props.numberOfLines ? { numberOfLines: props.numberOfLines } : {})}
      style={[
        props.style,
        createPaddingStyle(props.padding),
        createMarginStyle(props.margin),
        {
          fontFamily: props.bold
            ? FontTypes.Comfortaa.Bold
            : props.light
            ? FontTypes.Comfortaa.Light
            : FontTypes.Comfortaa.Normal,
          fontSize: hp(props.size),
          color: props.colorHex ?? Colors[props.color ?? "text"],
          ...(props.position ? { textAlign: props.position } : {}),
          ...(props.underline ? { textDecorationLine: "underline" } : {}),
          ...(props.flex ? { flex: props.flex } : {}),
        },
      ]}
    >
      {props.children
        ? props.children
        : props["title"]
        ? string[props.title] ?? props.title
        : ""}
    </Text>
  );
}
