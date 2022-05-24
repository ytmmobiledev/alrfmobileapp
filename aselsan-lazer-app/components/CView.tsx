import * as React from "react";
import {
  Text,
  StyleProp,
  ViewStyle,
  View,
  TouchableOpacity,
} from "react-native";
import { createPaddingStyle } from "../functions/createPadding";
import { createMarginStyle } from "../functions/createMargin";
import Colors from "../constants/Colors";
import { shadow } from "../functions/globalStyles";

export type ColorProps = keyof typeof Colors;

interface PropsType {
  height?: any;
  width?: any;
  radius?: number;
  center?: boolean;
  horizontal?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around";
  vertical?: "center" | "flex-start" | "flex-end";
  row?: boolean;
  wrap?: boolean;
  flex?: number;
  color?: ColorProps;
  shadow?: boolean;
  colorHex?: string;
  style?:
    | StyleProp<ViewStyle>
    | { textDecorationLine?: string; [key: string]: any };
  padding?: string;
  margin?: string;
  onPress?: any;
  children?: any;
  [key: string]: any;
}
const defaultProps: object = {
  row: false,
};

function RenderView(props: any) {
  if (props.onPress) {
    return <TouchableOpacity {...props} />;
  } else {
    return <View {...props} />;
  }
}

export function CView(props: PropsType) {
  props = { ...defaultProps, ...props };

  return (
    <RenderView
      {...(props.onPress ? { onPress: props.onPress } : {})}
      style={[
        props.style,
        createPaddingStyle(props.padding),
        createMarginStyle(props.margin),
        {
          ...(props.shadow ? shadow : {}),
          ...(props.flex ? { flex: props.flex } : {}),
          ...(props.width ? { width: props.width } : {}),
          ...(props.height ? { height: props.height } : {}),
          ...(props.radius ? { borderRadius: props.radius } : {}),
          ...(props.row ? { flexDirection: "row" } : {}),
          ...(props.wrap ? { flexDirection: "row", flexWrap: "wrap" } : {}),
          ...(props.horizontal ? { justifyContent: props.horizontal } : {}),
          ...(props.vertical ? { alignItems: props.vertical } : {}),
          ...(props.center
            ? { alignItems: "center", justifyContent: "center" }
            : {}),
          backgroundColor:
            props.colorHex ?? Colors[props.color ?? "transparent"],
        },
      ]}
    >
      {props.children ? props.children : null}
    </RenderView>
  );
}
