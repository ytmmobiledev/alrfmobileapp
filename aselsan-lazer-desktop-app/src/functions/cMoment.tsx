import moment from "moment";
import "moment/locale/tr";
//import {string} from "../constants/languages";

export function l_moment(date: any = moment(), format: any = "") {
  //moment.locale(string.dil??"tr")
  return moment(date, format);
}
