import * as React from "react";
import {useEffect, useState} from "react";
import { CView } from "../components/CView";
import {CImage} from "../components/CImage";
import {hp, wp} from "../functions/responsiveScreen";
import {FontText} from "../components/FontText";
import {CButton} from "../components/CButton";
import {goPage} from "../functions/goPage";

export default function Slide({navigation}:any) {
    const [page,setPage] = useState(1)

  useEffect(() => {
      setPage(1)
  }, []);

    const slide = [
        {
            title:"olcum",
            desc:"olcumdesc",
            icon:require("../assets/images/olcum.png")
        },
        {
            title:"cihaziyapilandir",
            desc:"cihaziyapilandirdesc",
            icon:require("../assets/images/cihaz.png")
        },
        /*{
            title:"aygityazilimi",
            desc:"aygityazilimidesc",
            icon:require("../assets/images/aygit.png")
        },*/
        {
            title:"cihazbagla",
            desc:"cihazbagladesc",
            icon:require("../assets/images/bagla.png")
        }
    ]

    const {title,desc,icon} = slide[page-1]

  return (
    <CView flex={1} center color="darkGray">
      <CImage  resizeMode="contain" source={require("../assets/images/slide-bg/bg1.png")} orgHeight={"100%"} orgWidth={"100%"} background>
        <CView flex={1} center>
            <CImage style={{right:hp(3)}} resizeMode="contain" source={require("../assets/images/slide-bg/bg2.png")} width={38} height={38} background>
                <CView style={{left:hp(3)}} flex={1} center>
                    <CView height={hp(8)} width={hp(25)} center>
                        <FontText position="center" title={title} size={2.5} bold color="white"/>
                    </CView>
                    <CButton style={{position:'absolute',right:hp(1.5)*-1}} disabled circle icon={icon}/>
                </CView>
            </CImage>
            <CView padding="0 2"  height={hp(9)}>
                <FontText title={desc} size={2} color={"text"} position="center" bold  />
            </CView>
            <CView margin="2 10" row center>
                <CView margin="0.8" width={40} height={7} radius={100} color={page>=1?"primary":"lightBlack"}/>
                <CView margin="0.8" width={40} height={7} radius={100} color={page>=2?"primary":"lightBlack"}/>
                <CView margin="0.8" width={40} height={7} radius={100} color={page>=3?"primary":"lightBlack"}/>
            </CView>
            <CButton
                title={"devamet"} width={30}
                onPress={()=>{
                    if(page<slide.length){
                        setPage(page+1)
                    }else{
                        goPage({navigation},"Startup")
                    }
                }}
            />

        </CView>
      </CImage>
    </CView>
  );
}
