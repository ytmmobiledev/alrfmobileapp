import {AngleUnitTypes, DistanceUnitTypes, findType} from "../constants/Config";


export function distanceConversion(distance:number,unit1:any,unit2:any){
    let unit
    try {
        unit1 = findType(DistanceUnitTypes,unit1,"")
        unit2 = findType(DistanceUnitTypes,unit2,"")
        unit = unit2.symbol

        if(unit1.id == DistanceUnitTypes.Metre.id && unit2.id == DistanceUnitTypes.Feet.id){
            distance = unit1.toFeet(distance)
        }else if(unit1.id == DistanceUnitTypes.Feet.id && unit2.id == DistanceUnitTypes.Metre.id){
            distance = unit1.toMeter(distance)
        }
    }catch (e) {
        return {distance: 0,unit:""}
    }


    return {distance,unit}
}


export function angleConversion(angle:number,unit1:any,unit2:any){

    let unit
    try {
        unit1 = findType(AngleUnitTypes,unit1,"")
        unit2 = findType(AngleUnitTypes,unit2,"")
        unit = unit2.symbol

        if(unit1.id != AngleUnitTypes.Derece.id && unit2.id == AngleUnitTypes.Derece.id){
            angle = unit1.toDegree(angle)
        }

    }catch (e) {

        return {angle: 0,unit:""}
    }


    return {angle,unit}
}