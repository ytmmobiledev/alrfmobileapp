import Toast from "react-native-toast-message";
import { string } from "../locales";

export function success(text1: string = string.basarili, text2: string = "") {
  Toast.show({
    text1,
    ...(text2 ? { text2 } : {}),
    type: "success",
  });
}

export function error(text1: string = string.hata, text2: string = "") {
  Toast.show({
    text1,
    ...(text2 ? { text2 } : {}),
    type: "error",
  });
}


export function info(text1: string, text2: string = "") {
  Toast.show({
    text1,
    ...(text2 ? { text2 } : {}),
    type: "info",
  });
}
