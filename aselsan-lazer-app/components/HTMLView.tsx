import * as React from "react";
import RenderHtml from "react-native-render-html";
import { hp, wp } from "../functions/responsiveScreen";

function HTMLView({ text }: any) {
  if (!text) return null;
  return (
    <RenderHtml
      tagsStyles={{
        p: { margin: 0, padding: 0, fontSize: hp(1.6) },
        strong: {
          fontFamily: "comfortaa-bold",
        },
        h1: {
          fontSize: hp(2.1),
        },
        h2: {
          fontSize: hp(2),
        },
        h3: {
          fontSize: hp(1.9),
        },
        h4: {
          fontSize: hp(1.7),
        },
        h5: {
          fontSize: hp(1.6),
        },
        h6: {
          fontSize: hp(1.5),
        },
      }}
      contentWidth={wp(100)}
      source={{ html: `<div style="font-family: comfortaa">${text}</div>` }}
      systemFonts={["comfortaa", "comfortaa-bold"]}
    />
  );
}

export default HTMLView;
