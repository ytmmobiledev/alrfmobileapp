import {string} from "../locales";
import {Linking} from "react-native";

export const contacts={
  Phone:{
    title:"telefon",
    value:"+0850 360 10 30",
    onPress:(phone:any)=>{
      Linking.openURL(`tel:${phone}`)
    }
  },
  Email:{
    title:"email",
    value:"aselsan@hs02.kep.tr",
    onPress:(email:any)=>{
      Linking.openURL(`mailto:${email}`)
    }
  },
  WebSite:{
    title:"website",
    value:"www.aselsan.com.tr",
    onPress:(web:any)=>{
      Linking.openURL(`https://${web}`)
    }
  },
  Address:{
    title:"adres",
    value:"P.K.1, 06200, Yenimahalle | Ankara, Türkiye",
    onPress:(address:any)=>{
      Linking.openURL(`http://maps.google.com/?q=1200 ${address}`)
    }
  }
}

export const sss = string.dil=="tr"?{
  Application:[
    {
      title:"Uygulama Soru 1",
      content:"Cevap 1"
    },
    {
      title:"Uygulama Soru 2",
      content:"Cevap 2"
    },
    {
      title:"Uygulama Soru 3",
      content:"Cevap 3"
    }
  ],
  DEVICE:[
    {
      title:"Cihaz Soru 1",
      content:"Cevap 1"
    },
    {
      title:"Cihaz Soru 2",
      content:"Cevap 2"
    },
    {
      title:"Cihaz Soru 3",
      content:"Cevap 3"
    }
  ]
}:{
  Application:[
    {
      title:"Application Ask 1",
      content:"Answer 1"
    },
    {
      title:"Application Ask 2",
      content:"Answer 2"
    },
    {
      title:"Application Ask 3",
      content:"Answer 3"
    }
  ],
  DEVICE:[
    {
      title:"Device Ask 1",
      content:"Answer 1"
    },
    {
      title:"Device Ask 2",
      content:"Answer 2"
    },
    {
      title:"Device Ask 3",
      content:"Answer 3"
    }
  ]
}

export const HomeScreenTypes = {
  MesafeVePusula: {
    id: 0,
    value: "mesafevepusula",
  },
  Pusula: {
    id: 1,
    value: "pusula",
  },
  Mesafe: {
    id: 2,
    value: "mesafe",
  }
};

export const UnitTypes = {
  Metre: {
    id: 1,
    value: "metre",
  },
  Yard: {
    id: 2,
    value: "yard",
  }
};

export const AngleUnitTypes = {
  Derece: {
    id: 1,
    value: "derece",
  },
  Milyem6000: {
    id: 2,
    value: "6000 Milyem",
  },
  Milyem6300: {
    id: 2,
    value: "63000 Milyem",
  },
  Milyem6400: {
    id: 2,
    value: "64000 Milyem",
  }

};

export const OdometerActivityTypes = {
  Kapali: {
    id: 0,
    value: "kapali",
  },
  Acik: {
    id: 1,
    value: "acik",
  }
};

export const CompassActivityTypes = {
  Kapali: {
    id: 0,
    value: "kapali",
  },
  Acik: {
    id: 1,
    value: "acik",
  }
};

export const BluetoothActivityTypes = {
  Kapali: {
    id: 0,
    value: "kapali",
  },
  Acik: {
    id: 1,
    value: "acik",
  }
};

export const OdometerErrorTypes = {
  BilgiYok: {
    id: 1,
    value: "bilgiyok",
  },
  NA: {
    id: 2,
    value: "N/A",
  },
  HataVar: {
    id: 3,
    value: "hatavar",
  },
  HataYok: {
    id: 4,
    value: "hatayok",
  }
};

export const CompassErrorTypes = {
  BilgiYok: {
    id: 1,
    value: "bilgiyok",
  },
  NA: {
    id: 2,
    value: "N/A",
  },
  HataVar: {
    id: 3,
    value: "hatavar",
  },
  HataYok: {
    id: 4,
    value: "hatayok",
  }
};

export const BluetoothErrorTypes = {
  BilgiYok: {
    id: 1,
    value: "bilgiyok",
  },
  NA: {
    id: 2,
    value: "N/A",
  },
  HataVar: {
    id: 3,
    value: "hatavar",
  },
  HataYok: {
    id: 4,
    value: "hatayok",
  }
};

export const BatteryErrorTypes = {
  BilgiYok: {
    id: 1,
    value: "bilgiyok",
  },
  NA: {
    id: 2,
    value: "N/A",
  },
  PilGucuIyi: {
    id: 3,
    value: "pilgucuiyi",
  },
  PilGucuZayif: {
    id: 4,
    value: "pilgucuzayif",
  }
};

export const ArticleMode = {
  Kapali: {
    id: 1,
    value: "kapali",
  },
  Acik: {
    id: 2,
    value: "acik",
  },
  Otomatik: {
    id: 3,
    value: "otomatik",
  }
};


export const Language = {
  Turkce: {
    id: 1,
    value: "turkce",
  },
  Ingilizce: {
    id: 2,
    value: "ingilizce",
  }
};


export const NightVisionMode = {
  Kapali: {
    id: 1,
    value: "kapali",
  },
  Acik: {
    id: 2,
    value: "acik",
  }
};


export const DeviceSleepTime = {
  "0": {
    id: 0,
    value: "sonsuz",
  },
  "20": {
    id: 1,
    value: "20 "+string.saniye,
  },
  "30": {
    id: 2,
    value: "30 "+string.saniye,
  },
  "60": {
    id: 3,
    value: "1 "+string.dakika,
  },
  "120": {
    id: 4,
    value: "2 "+string.dakika,
  },
  "300": {
    id: 5,
    value: "5 "+string.dakika,
  },
  "600": {
    id: 6,
    value: "10 "+string.dakika,
  }
};


export const BluetoothSleepTime = {
  "0": {
    id: 0,
    value: "sonsuz",
  },
  "20": {
    id: 1,
    value: "20 "+string.saniye,
  },
  "30": {
    id: 2,
    value: "30 "+string.saniye,
  },
  "60": {
    id: 3,
    value: "1 "+string.dakika,
  },
  "120": {
    id: 4,
    value: "2 "+string.dakika,
  },
  "300": {
    id: 5,
    value: "5 "+string.dakika,
  },
  "600": {
    id: 6,
    value: "10 "+string.dakika,
  }
};

export function findType(data: any, id: number, key = "value") {
  let res: any = " ";
  try {
    res = Object.values(data).find((e: any) => e.id == id);
    if (key) res = res[key];
  } catch (e) {}
  return res;
}
