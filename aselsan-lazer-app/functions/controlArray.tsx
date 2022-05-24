import { FontText } from "../components/FontText";
import Colors from "../constants/Colors";
import { Spinner } from "native-base";
import * as React from "react";
import { FlatList, View } from "react-native";
import { hp, wp } from "./responsiveScreen";

export function listArray(
  data: any,
  element: any,
  {
    header = <View />,
    horizontal,
    bottomHeight,
    disableFlat,
    numColumns,
    disableError = false,
    onReflesh = () => {},
  }: {
    header?: any;
    horizontal?: boolean;
    bottomHeight?: number;
    disableFlat?: boolean;
    numColumns?: number;
    disableError?: boolean;
    onReflesh?: any;
  } = {}
) {
  try {
    if (Array.isArray(data) && data.length) {
      if (disableFlat) {
        return data.map((e: any, i: number) => element(e, i));
      }

      return (
        <View style={{ flex: 1 }}>
          <FlatList
            ListHeaderComponent={header}
            refreshing={false}
            onRefresh={onReflesh}
            //onRefresh={onReflesh}
            {...(numColumns
              ? {
                  numColumns,
                  contentContainerStyle: {
                    justifyContent: "center",
                    alignItems: "center",
                  },
                }
              : {})}
            style={{ flex: 1 }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            horizontal={horizontal}
            keyExtractor={(_: any, i: number) => i.toString()}
            data={data}
            renderItem={({ item: e, index }: any) => element(e, index)}
            ListFooterComponent={
              !!bottomHeight ? <View style={{ height: bottomHeight }} /> : null
            }
          />
        </View>
      );
    }
  } catch (e) {}
  if (!Array.isArray(data)) {
    return (
      <View
        style={{
          width: wp(80),
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <Spinner color={Colors.primary} />
      </View>
    );
  }

  if (disableError) return null;

  return (
    <FontText
      style={{ width: wp(80), alignSelf: "center" }}
      position="center"
      bold
      title={"gosterilecekicerikbulunamadi"}
      size={1.8}
      color={"black"}
    />
  );
}
