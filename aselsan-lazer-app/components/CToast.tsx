import * as React from "react";
import Toast, { BaseToast } from "react-native-toast-message";
import { hp } from "../functions/responsiveScreen";

export default function CToast() {
  return (
    <Toast
      onPress={() => Toast.hide()}
      config={{
        success: (props) => (
          <BaseToast
            {...props}
            style={{ borderColor: "#31a54a", borderLeftColor: "#31a54a" }}
            text1Style={{ color: "black", fontSize: hp(1.8) }}
            text2Style={{ color: "black", fontSize: hp(1.6) }}
            text1NumberOfLines={0}
            text2NumberOfLines={0}
          />
        ),
        info: (props) => (
          <BaseToast
            {...props}
            style={{ borderColor: "#4383b5", borderLeftColor: "#4383b5" }}
            text1Style={{ color: "black", fontSize: hp(1.8) }}
            text2Style={{ color: "black", fontSize: hp(1.6) }}
            text1NumberOfLines={0}
            text2NumberOfLines={0}
          />
        ),
        warn: (props) => (
          <BaseToast
            {...props}
            style={{ borderColor: "#ce853d", borderLeftColor: "#ce853d" }}
            text1Style={{ color: "black", fontSize: hp(1.8) }}
            text2Style={{ color: "black", fontSize: hp(1.6) }}
            text1NumberOfLines={0}
            text2NumberOfLines={0}
          />
        ),
        error: (props) => (
          <BaseToast
            {...props}
            style={{ borderColor: "#cd2e2e", borderLeftColor: "#cd2e2e" }}
            text1Style={{ color: "black", fontSize: hp(1.8) }}
            text2Style={{ color: "black", fontSize: hp(1.6) }}
            text1NumberOfLines={0}
            text2NumberOfLines={0}
          />
        ),
      }}
    />
  );
}
