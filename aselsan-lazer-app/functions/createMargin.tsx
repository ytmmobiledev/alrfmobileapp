import { hp } from "./responsiveScreen";
import { toParse } from "./json";

export function createMarginStyle(margin: any) {
  const marginStyle: any = {};
  try {
    let new_margin: any = margin.trim().split(" ");

    switch (new_margin.length) {
      case 1:
        marginStyle.margin = hp(toParse(new_margin[0]));
        break;
      case 2:
        marginStyle.marginVertical = hp(Number(new_margin[0]));
        marginStyle.marginHorizontal = hp(Number(new_margin[1]));
        break;
      case 4:
        marginStyle.marginLeft = hp(Number(new_margin[0]));
        marginStyle.marginRight = hp(Number(new_margin[1]));
        marginStyle.marginTop = hp(Number(new_margin[2]));
        marginStyle.marginBottom = hp(Number(new_margin[3]));
        break;
    }
  } catch (e) {}

  return marginStyle;
}
