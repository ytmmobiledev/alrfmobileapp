import React, {useEffect} from 'react';
import Colors from "../constants/Colors";
import {string} from "../locales";
import {LeftOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";


export function HelpText() {
    return(
        <div
            onClick={()=>{alert("yardım")}}
            style={{cursor:'pointer', padding:20, textDecorationLine:'underline',fontWeigh:'bold',fontSize:14}}>{string.yardimaihtiyacinvarmi}
        </div>
    )
}

export function MoreInfoButton({close=false}) {
    const history = useHistory()

    if(close){
        return (
            <div>
                <img style={{marginTop:15,width:70,height:75}} src={require("../assets/images/secili-dahafazla.png").default}/>
            </div>
        )
    }
    return(
        <div
            onClick={()=>{
                history.push("more-info")
            }}
            style={{cursor:'pointer'}}
        >
            <img style={{width:50,height:50}} src={require("../assets/images/dahafazla.png").default}/>
        </div>
    )
}

function Header({onBack, left=()=><div/>, title="",right=()=><div/>,}) {

  return (
    <div className="flex row" style={{ flexDirection:'space-between', alignItems:'center', color:Colors.text, width:'100%', height:60, backgroundColor:Colors.darkGray}}>
        <div className="flex-1 left" >
            {
                onBack?
                    <div onClick={onBack} style={{padding:20,cursor:'pointer'}}>
                        <LeftOutlined  style={{fontSize:25,color:Colors.text}} />
                    </div>:null
            }
            {left()}
        </div>
        <div className="flex-1 center" style={{fontSize:18,fontWeight:"bold"}}>{title}</div>
        <div className="flex-1 right"  >
            {right()}
        </div>
    </div>
  );
}

export default Header;
