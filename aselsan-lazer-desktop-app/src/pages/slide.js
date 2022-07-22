import React, {useEffect, useState} from "react"
import {useHistory} from "react-router-dom";
import {Col} from "antd";
import Colors from "../constants/Colors";
import {string} from "../locales";
import {MStore} from "../stores/MainStore";

const Slide = () => {
    const history = useHistory()
    const [page,setPage] = useState(1)

    useEffect(() => {
        setPage(1)
    }, []);

    const slide = [
        {
            title:"olcum",
            desc:"olcumdesc",
            icon:require("../assets/images/olcum.png").default
        },
        {
            title:"cihaziyapilandir",
            desc:"cihaziyapilandirdesc",
            icon:require("../assets/images/cihaz.png").default
        },
        /*{
            title:"aygityazilimi",
            desc:"aygityazilimidesc",
            icon:require("../assets/images/aygit.png").default
        },*/
        {
            title:"cihazbagla",
            desc:"cihazbagladesc",
            icon:require("../assets/images/bagla.png").default
        }
    ]

    const {title,desc,icon} = slide[page-1]

    return (
        <div  className="flex-1 column contain center background-img" style={{width:'100%', backgroundImage:`url(${require("../assets/images/slide-bg/bg1.png").default})`}}>
            <div  className="flex center background-img " style={{width:"50vh",height:"50vh", backgroundImage:`url(${require("../assets/images/slide-bg/bg2.png").default})`}}>
                <div className="flex row center" style={{marginLeft:'18vw', flexDirection:'space-between'}}>
                    <div style={{textAlign:'center',padding:'3vw', fontWeight:'bold',fontSize:"4vh",color:Colors.white}}>{string[title]}</div>
                   <div className="flex center" style={{padding:"4vh",borderRadius:1000,backgroundColor:Colors.primary}}>
                       <img src={icon} alt={title} style={{width:"6vh",height:"6vh"}}/>
                   </div>
                </div>
            </div>
            <div style={{width:'50%', textAlign:'center', fontWeight:'500',fontSize:"2vh",color:Colors.text}}>{string[desc]}</div>
            <div className="flex row center" style={{marginTop:"4vh",}} >
                {
                    slide.map((_,index)=>
                        <div key={index} style={{margin:10, width:"10vw",height:10,borderRadius:10,backgroundColor:page>=(index+1)?Colors.primary:Colors.lightBlack}}/>
                    )
                }
            </div>
            <div
                onClick={()=>{
                    if(page<slide.length){
                        setPage(page+1)
                    }else{

                        MStore.setFirst(false)
                        history.push("/")
                    }
                }}

                className="flex center btn" style={{marginTop:"3vh", padding:"1vh 7vh",borderRadius:15,backgroundColor:Colors.primary}}>
                <div style={{textAlign:'center',fontWeight:'500',fontSize:"2vh",color:Colors.white}}>{string["devamet"]}</div>
            </div>
        </div>
    )
}


export default Slide
