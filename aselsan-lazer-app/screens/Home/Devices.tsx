
import * as React from "react";
import { CView } from "../../components/CView";
import { useEffect, useState } from "react";
import {CImage} from "../../components/CImage";
import {FontText} from "../../components/FontText";
import {hp} from "../../functions/responsiveScreen";

export default function Devices({ navigation }: any) {

  const [page,setPage] = useState(2)

  useEffect(() => {


  }, []);


  return (
      <CView center color={"darkGray"} vertical="center" flex={1}>
        <FontText flex={1} title={"LOGO"} size={3.5} bold padding={"0 0 4 0"}/>
          <CView width="100%">
              <FontText padding="2"  title={"yakindakicihazlar"} size={2.2} bold color="primary"/>
          </CView>
          <CView flex={9} width={"100%"}>
          <CImage style={{flex:8}} resizeMode="contain" source={require("../../assets/images/devices/bg.png")}  orgWidth={"100%"} background>
            <CView flex={1} center>
              <CView onPress={()=>{}}>
                <CImage resizeMode="contain" source={require("../../assets/images/devices/button.png")} width={26} height={26}/>
              </CView>
            </CView>
          </CImage>
              <FontText flex={1} position="center" title={"cevrenizdekicihazlariaramayabaslayin"} size={2.2} bold color={"text"} />

          </CView>
        <CView height={hp(13)}/>
      </CView>
  );
}
