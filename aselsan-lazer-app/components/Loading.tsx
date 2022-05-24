import * as React from "react";
import { Spinner } from "native-base";
import { View, Text } from "react-native";
import Colors from "../constants/Colors";
import { hp } from "../functions/responsiveScreen";
import { observer } from "mobx-react-lite";
import { IStore } from "../stores/InstantStore";
import { CView } from "./CView";

function Loading() {
  if (!IStore.loading) return null;

  return (
    <View
      style={{
        zIndex: 99999,
        position: "absolute",
        flex: 1,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#50505050",
      }}
    >
      <CView color="white" width={hp(12)} height={hp(12)} radius={1000} center>
        <Spinner color={Colors.primary} />
      </CView>
    </View>
  );
}

export default observer(Loading);
