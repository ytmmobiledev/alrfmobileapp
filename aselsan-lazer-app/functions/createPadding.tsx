import { hp } from "./responsiveScreen";
import { toParse } from "./json";

export function createPaddingStyle(padding: any) {
  const paddingStyle: any = {};

  if (!padding) return paddingStyle;

  try {
    let new_padding: any = padding.trim().split(" ");

    switch (new_padding.length) {
      case 1:
        paddingStyle.padding = hp(toParse(new_padding[0]));
        break;
      case 2:
        paddingStyle.paddingVertical = hp(Number(new_padding[0]));
        paddingStyle.paddingHorizontal = hp(Number(new_padding[1]));
        break;
      case 4:
        paddingStyle.paddingLeft = hp(Number(new_padding[0]));
        paddingStyle.paddingRight = hp(Number(new_padding[1]));
        paddingStyle.paddingTop = hp(Number(new_padding[2]));
        paddingStyle.paddingBottom = hp(Number(new_padding[3]));
        break;
    }
  } catch (e) {}

  return paddingStyle;
}
