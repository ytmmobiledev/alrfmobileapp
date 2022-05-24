import * as React from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { LangType, string } from "../locales";
import { hp } from "../functions/responsiveScreen";
import Colors from "../constants/Colors";
import { FontText } from "./FontText";

import { createPaddingStyle } from "../functions/createPadding";
import { createMarginStyle } from "../functions/createMargin";
import {CImage} from "./CImage";
import {CView} from "./CView";
export type ColorProps = keyof typeof Colors;

interface PropsType {
  title?: LangType | string;
  icon?: any;
  style?: StyleProp<ViewStyle>;
  color?: ColorProps;
  height?: any;
  width?: any;
  onPress?: any;
  size?: number;
  loading?: boolean;
  disabled?: boolean;
  circle?: boolean;
  [key: string]: any;
}

export function CButton({color,size,circle,title,icon,disabled,width,height,style={},onPress=()=>{}}: PropsType) {
  color = color ?? "primary";
  size = size ?? 1;
  width = width ? width: circle?12:null;
  height = height ? height: circle?12:7;



  return(

      <TouchableOpacity disabled={disabled} style={style} onPress={onPress}>
        <CImage resizeMode="stretch" width={size*width} height={size*height} source={circle?require("../assets/images/buttons/circle.png"):require("../assets/images/buttons/button.png")} background>
          <CView flex={1} center padding={"0 3"}>
            {
              title?
                  <FontText
                      title={title}
                      size={1.7*size}
                      color={"white"}
                      bold
                  />:
                  icon?
                      <CImage source={icon} width={size*5} height={size*5}/>
                      :null
            }
          </CView>
        </CImage>
      </TouchableOpacity>
  )


  /*return (
    <Button
      mode={"contained"}
      disabled={!!props.disabled}
      loading={!!props.loading}
      color={props.reverse ? "white" : Colors[color]}
      labelStyle={{ color: Colors.white }}
      style={[
        props.style,
        createPaddingStyle(props.padding),
        createMarginStyle(props.margin),
        {
          color: Colors[color],
          ...(props.reverse
            ? { borderColor: Colors[color], borderWidth: 1 }
            : {}),
        },
        {
          ...(props.width ? { width: props.width } : {}),
          ...(props.height ? { height: props.height } : {}),
          ...(props.radius ? { borderRadius: props.radius } : {}),
        },
      ]}
      onPress={() => {
        if (!props.loading) props.onPress?.();
      }}
    >
      <FontText
        title={props.title}
        size={1.7*size}
        color={props.reverse ? color : "white"}
        bold
      />
    </Button>
  );*/
}
