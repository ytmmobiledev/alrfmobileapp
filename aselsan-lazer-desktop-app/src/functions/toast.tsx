import { notification } from "antd";
import { string } from "../locales";

export function success(text1: string = string.basarili, text2: string = "") {
  notification.success({
    message: text1,
    description:text2,
  });
}

export function error(text1: string = string.hata, text2: string = "") {
  notification.error({
    message: text1,
    description:text2,
  });
}


export function info(text1: string, text2: string = "") {
  notification.info({
    message: text1,
    description:text2,
  });
}
