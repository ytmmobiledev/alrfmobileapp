import * as React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import Colors from "../constants/Colors";
import { hp, wp } from "../functions/responsiveScreen";
import { AntDesign, Entypo } from "@expo/vector-icons";

import { observer } from "mobx-react-lite";
import { IStore } from "../stores/InstantStore";
import { FontText } from "./FontText";
import { Container } from "native-base";

function DescriptionModal() {
  const { visible, title, desc } = IStore.desc_modal;
  return (
    <Modal
      style={{ margin: 0 }}
      isVisible={visible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackButtonPress={() => {
        IStore.setDescModal({ ...IStore.desc_modal, visible: false });
      }}
      onBackdropPress={() => {
        IStore.setDescModal({ ...IStore.desc_modal, visible: false });
      }}
    >
      <Container
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            maxHeight: hp(70),
            backgroundColor: Colors.white,
            width: "85%",
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              IStore.setDescModal({ ...IStore.desc_modal, visible: false });
            }}
            style={{ alignSelf: "flex-end", padding: hp(2), paddingBottom: 0 }}
          >
            <AntDesign
              name="closecircleo"
              size={hp(2.5)}
              color={"black"}
            />
          </TouchableOpacity>
          <ScrollView style={{ padding: hp(3), paddingTop: 0 }}>
            <FontText
              position="center"
              title={title}
              size={2}
              color={"black"}
              bold
              padding="1"
            />
            <FontText
              position="center"
              title={desc}
              size={1.8}
              color={"black"}
            />
          </ScrollView>
        </View>
      </Container>
    </Modal>
  );
}

export default observer(DescriptionModal);
