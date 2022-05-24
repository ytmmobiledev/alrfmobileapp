import * as React from "react";
import { TouchableOpacity, View, FlatList } from "react-native";
import Modal from "react-native-modal";
import { useRef, useState } from "react";
import { hp } from "../../functions/responsiveScreen";
import Colors from "../../constants/Colors";
import { shadow } from "../../functions/globalStyles";
import { FontText } from "../FontText";
import { Entypo } from "@expo/vector-icons";
import { CView } from "../CView";
import { Spinner } from "native-base";

function Select({
  value: defaultValue,
  onValueChange = () => {},
  data = [],
  children = <View />,
}: any) {
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const flatlist: any = useRef(null);

  function onClose() {
    setVisible(false);
    setTimeout(() => {
      setShow(false);
    }, 1000);
  }

  return (
    <CView
      onPress={() => {
        setVisible(true);
      }}
    >
      <Modal
        onBackdropPress={onClose}
        onBackButtonPress={onClose}
        onSwipeComplete={onClose}
        isVisible={visible}
        swipeDirection={["down"]}
        propagateSwipe
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
        onModalShow={() => {
          try {
            const index = data.findIndex((e: any) => e.value == defaultValue);

            if (index + 1) {
              setTimeout(() => {
                flatlist.current.scrollToIndex({
                  animated: false,
                  index: index,
                });
                setShow(true);
              }, 1000);
            } else {
              setShow(true);
            }
          } catch (e) {
            setShow(true);
          }
        }}
      >
        <View
          style={{
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
            onPress={onClose}
            style={{
              marginTop: hp(1),
              marginBottom: hp(2),
              alignSelf: "center",
              height: hp(0.5),
              backgroundColor: Colors.gray + "aa",
              borderRadius: 5,
              width: "70%",
            }}
          />
        </View>
        <View
          style={{
            width: "100%",
            maxHeight: hp(50),
            zIndex: 1000,
            backgroundColor: Colors.white,
          }}
        >
          {!show ? (
            <Spinner style={{ alignSelf: "center" }} color={Colors.primary} />
          ) : null}
          <FlatList
            ref={flatlist}
            keyExtractor={(_: any, i: number) => i.toString()}
            style={{
              opacity: show ? 1 : 0,
            }}
            data={data}
            renderItem={({ item: { label, value }, index }: any) => {
              return (
                <TouchableOpacity
                  disabled={!show}
                  key={index}
                  onPress={() => {
                    onValueChange(value);
                    onClose();
                  }}
                  style={{
                    ...shadow,
                    paddingLeft: hp(1),
                    paddingBottom: hp(1),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      padding: hp(0.5),
                      backgroundColor:
                        defaultValue == value ? Colors.gray + "30" : "white",
                      borderRadius: 10,
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <FontText
                      bold
                      padding="0.5"
                      title={label}
                      size={2}
                      color={"black"}
                    />
                    {defaultValue == value ? (
                      <Entypo name="check" size={hp(2.5)} color={Colors.gray} />
                    ) : null}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
      {children}
    </CView>
  );
}

export default Select;
