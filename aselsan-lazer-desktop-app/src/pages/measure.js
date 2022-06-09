import React, {useEffect} from "react"
import Colors from "../constants/Colors";
import {string} from "../locales";
import Header, {HelpText, MoreInfoButton} from "../componenets/Header";
import {useHistory} from "react-router-dom";


const Measure = () => {
    const history = useHistory()

    useEffect(()=>{
    },[])



    return (
        <div className="center contain column"  style={{paddingBottom:100}}>

           <div className="center" style={{width:'100%'}}>
               <Header
                   left={()=><HelpText/>}
                   right={()=><MoreInfoButton/>}
               />
           </div>
            <div className="center" style={{flex:1,fontSize:25,fontWeight:'bold',color:Colors.text}}>
               LOGO
           </div>
            <div  className="center background-img" style={{flex:6, width:'100%', backgroundImage:`url(${require("../assets/images/measure/bg.png").default})`}}>
                <img onClick={()=>{history.push("compass")}} src={require("../assets/images/measure/button.png").default} width={250} height={250}/>
            </div>
            <div className="flex column center" style={{flex:1,fontSize:17,fontWeight:'bold',color:Colors.text}}>
                {string.olcumyap}
                <div style={{fontSize:14,fontWeight:"normal"}}>
                    {string.olcumyapdesc}
                </div>
            </div>
        </div>
    )
}


export default Measure