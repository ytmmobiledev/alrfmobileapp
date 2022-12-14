import * as React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";
import { hp, wp } from "../functions/responsiveScreen";
import { AntDesign, Entypo } from "@expo/vector-icons";

import { observer } from "mobx-react-lite";
import { IStore } from "../stores/InstantStore";
import { CImage } from "./CImage";
import { CView } from "./CView";

function CustomModal() {
  const {
    visible,
    children,
    bottom = false,
    backgroundColor = Colors.darkGray,
    icon,
  } = IStore.custom_modal;

  if (bottom) {
    return (
      <Modal
        isVisible={visible}
        onBackButtonPress={() => {
          IStore.setCustomModal({
            ...IStore.custom_modal,
            visible: false,
          });
        }}
        onBackdropPress={() => {
          IStore.setCustomModal({
            ...IStore.custom_modal,
            visible: false,
          });
        }}
        swipeDirection={["down"]}
        propagateSwipe
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <View
          style={{
            flex: 1,
            maxHeight: hp(70),
            paddingBottom: hp("5%"),
            backgroundColor: "white",
            padding: hp(2.5),
            justifyContent: "center",
            borderTopEndRadius: 25,
            borderTopStartRadius: 25,
            borderColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              IStore.setCustomModal({
                ...IStore.custom_modal,
                visible: false,
              });
            }}
            style={{ alignSelf: "flex-end", padding: hp(2), paddingBottom: 0 }}
          >
            <AntDesign
              name="closecircleo"
              size={hp(2.5)}
              color={Colors.black}
            />
          </TouchableOpacity>

          {children ? children : null}
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      style={{ margin: 0 }}
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackButtonPress={() => {
        IStore.setCustomModal({ ...IStore.custom_modal, visible: false });
      }}
      onBackdropPress={() => {
        IStore.setCustomModal({ ...IStore.custom_modal, visible: false });
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            maxHeight: hp(95),
            backgroundColor,
            width: "85%",
            borderRadius: 10,
          }}
        >
          {icon ? (
            <View style={{ alignSelf: "flex-end" }}>
              <CImage
                imageStyle={{ borderTopRightRadius: 10 }}
                source={require("../assets/images/modal/corner.png")}
                width={8}
                height={7}
                background
              >
                <CView
                  style={{ marginLeft: hp(2), marginBottom: hp(1) }}
                  center
                  flex={1}
                >
                  <CImage source={icon} height={3} width={3} />
                </CView>
              </CImage>
            </View>
          ) : (
            <View style={{ height: hp(3) }} />
          )}
          <View style={{ padding: hp(3), paddingTop: 0 }}>
            {children ? children() : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default observer(CustomModal);
