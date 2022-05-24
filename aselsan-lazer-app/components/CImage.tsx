import * as React from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ImageResizeMode,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Image as LImage } from "react-native-elements";
import Colors from "../constants/Colors";
import { hp, wp } from "../functions/responsiveScreen";
import AutoHeightImage from "react-native-auto-height-image";

interface PropsType {
  source: any;
  width?: number;
  orgWidth?: any;
  height?: number;
  orgHeight?: any;
  background?: boolean;
  autoHeight?: boolean;
  style?: StyleProp<ImageStyle> | object;
  imageStyle?: StyleProp<ImageStyle> | object;
  children?: any;
  resizeMode?: ImageResizeMode;
  [key: string]: any;
}

export function CImage(props: PropsType) {
  if (props.autoHeight) {
    return (
      <LImage
        {...(props.resizeMode ? { resizeMode: props.resizeMode } : {})}
        style={[
          props.style,
          {
            width: wp(props.width),
            minHeight: hp(20),
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        source={props.source}
        PlaceholderContent={<ActivityIndicator color={Colors.white} />}
        blurRadius={10}
      >
        <AutoHeightImage
          animated={true}
          resizeMode="cover"
          width={wp(props.width)}
          source={props.source}
          style={props.style ? props.style : {}}
        />
      </LImage>
    );
  } else if (props.source["uri"] || (props.source["uri"] && props.background)) {
    if (props.log) console.warn("1");
    return (
      <LImage
        {...(props.resizeMode ? { resizeMode: props.resizeMode } : {})}
        style={[
          props.style,
          {
            width: props.orgWidth ? props.orgWidth : hp(props.width),
            height: props.orgHeight ? props.orgHeight : hp(props.height),
          },
        ]}
        source={props.source}
        PlaceholderContent={<ActivityIndicator color={Colors.white} />}
      >
        {props.children}
      </LImage>
    );
  } else if (props.background) {
    if (props.log) console.warn("2");
    return (
      <ImageBackground
        imageStyle={props.imageStyle}
        {...(props.resizeMode ? { resizeMode: props.resizeMode } : {})}
        style={[
          props.style,
          {
            ...(props.orgWidth || props.width)?{width: props.orgWidth ? props.orgWidth : hp(props.width)}:{},
            ...(props.orgHeight || props.height)?{height: props.orgHeight ? props.orgHeight : hp(props.height)}:{},
          },
        ]}
        source={props.source}
      >
        {props.children}
      </ImageBackground>
    );
  }

  return (
    <Image
      {...(props.resizeMode ? { resizeMode: props.resizeMode } : {})}
      style={[
        {
          width: props.orgWidth ? props.orgWidth : hp(props.width),
          height: props.orgHeight ? props.orgHeight : hp(props.height),
        },
        props.style,
      ]}
      source={props.source}
    />
  );
}
