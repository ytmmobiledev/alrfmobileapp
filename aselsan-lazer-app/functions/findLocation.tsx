import {angleConversion, distanceConversion} from "./Conversions";
import {AngleUnitTypes, DistanceUnitTypes} from "../constants/Config";

const R = 6378160 //Radius of the Earth

export function findLocation(lat1:number,lon1:number,distance:number,azimuth:number,elevation:number,angle_unit:any,distance_unit:any) {
  distance = distanceConversion(distance,distance_unit,DistanceUnitTypes.Metre.id).distance
  azimuth = angleConversion(azimuth,angle_unit,AngleUnitTypes.Derece.id).angle
  elevation = angleConversion(elevation,angle_unit,AngleUnitTypes.Derece.id).angle


  const H = ( Math.sqrt( Math.pow(R,2) + Math.pow(distance,2) - 2*R*distance*Math.cos((elevation+90)*(Math.PI/180)) ) ) //Hedefin Dünyanın merkezine olan uzaklığı
  const y_distance = H-R //Hedefin yerden yüksekliği

  const distance_angle = Math.acos((Math.pow(H,2) + Math.pow(R,2) - Math.pow(distance,2)) / (2*H*R))*(180/Math.PI) // Hedef ile cihaz arasındaki mesafenin Dünya merkezindeki açısı
  const x_distance = ((2*Math.PI*R)*distance_angle)/360 //Dünya merkezindeki açıdan yatay mesafe hesaplanması


  const brng = azimuth*(Math.PI/180) //Azimut Açısının radyan dönüşümü
  lat1 = lat1*(Math.PI/180)
  lon1 = lon1*(Math.PI/180)

  let lat2  = Math.asin( Math.sin(lat1)*Math.cos(x_distance/R) + Math.cos(lat1)*Math.sin(x_distance/R)*Math.cos(brng))
  let lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(x_distance/R)*Math.cos(lat1), Math.cos(x_distance/R)-Math.sin(lat1)*Math.sin(lat2))

  lat2 = lat2*(180/Math.PI)
  lon2 = lon2*(180/Math.PI)
  //console.warn(lat2,lon2,distance,azimuth,elevation)

  return {
    y_distance:distanceConversion(y_distance,DistanceUnitTypes.Metre.id,distance_unit).distance,
    //x_distance:distanceConversion(x_distance,DistanceUnitTypes.Metre.id,distance_unit).distance,
    x_distance:distanceConversion(distance,DistanceUnitTypes.Metre.id,distance_unit).distance,
    latitude:lat2,
    longitude:lon2
  }
}

