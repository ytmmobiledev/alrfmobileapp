import React, {useEffect} from 'react';
import Colors from "../constants/Colors";
import {string} from "../locales";


export function HelpText() {
    return(
        <div
            onClick={()=>{alert("yardım")}}
            style={{cursor:'pointer', padding:20, textDecorationLine:'underline',fontWeigh:'bold',fontSize:14}}>{string.yardimaihtiyacinvarmi}
        </div>
    )
}

export function MoreInfo() {
    return(
        <div
            onClick={()=>{}}
            style={{cursor:'pointer',textDecorationLine:'underline',fontWeigh:'bold',fontSize:14}}
        >
            <img style={{width:50,height:50}} src={require("../assets/images/dahafazla.png").default}/>
        </div>
    )
}

function Header({left=()=><div/>, title="",right=()=><div/>,}) {

  return (
    <div className="flex row" style={{ flexDirection:'space-between', alignItems:'center', color:Colors.text, width:'100%', height:60, backgroundColor:Colors.darkGray}}>
        <div className="flex-1 left" >
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
