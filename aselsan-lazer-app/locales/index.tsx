import { tr } from "./tr";
import { en } from "./en";
import moment from "moment";
import "moment/locale/tr";
import { MainStore } from "../stores/MainStore";
import * as Localization from "expo-localization";

const algoritm: any = function () {
  let deviceLocale = Localization.locale;
  try {
    deviceLocale = deviceLocale.split("-")[0];
  } catch (e) {}

  if (deviceLocale.toLowerCase().search("tr") !== -1) {
    moment.locale("tr");
    return tr;
  } else {
    moment.locale("en");
    return en;
  }
};

export type LangType = keyof typeof tr;

export let string: typeof tr | any = new algoritm();
