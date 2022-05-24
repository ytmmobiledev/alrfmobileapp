const R = 6378.1 //Radius of the Earth

export function findLocation(lat1:number,lon1:number,distance:number,azimuth:number,elevation:number) {

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

  return {
    y_distance:parseFloat((y_distance).toString()).toFixed(3),
    x_distance:parseFloat(x_distance.toString()).toFixed(3),
    latitude:lat2,
    longitude:lon2
  }
}

