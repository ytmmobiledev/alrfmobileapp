import {
  widthPercentageToDP as _wp,
  heightPercentageToDP as _hp,
} from "react-native-responsive-screen";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export function wp(val: any) {
  if (!val) val = 0;
  if (width > height) return _wp(val);

  return _wp(val);
}

export function hp(val: any) {
  if (!val) val = 0;
  if (width > height) return _hp(val);

  return _hp(val);
}
