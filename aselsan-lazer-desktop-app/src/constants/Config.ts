import {string} from "../locales";
const shell = require('electron').shell;

export const contacts={
  Phone:{
    title:"telefon",
    value:"+0850 360 10 30",
    onPress:(phone:any)=>{
      shell.openExternal(`tel:${phone}`)
    }
  },
  Email:{
    title:"email",
    value:"aselsan@hs02.kep.tr",
    onPress:(email:any)=>{
      shell.openExternal(`mailto:${email}`)
    }
  },
  WebSite:{
    title:"website",
    value:"www.aselsan.com.tr",
    onPress:(web:any)=>{
      shell.openExternal(`https://${web}`)
    }
  },
  Address:{
    title:"adres",
    value:"P.K.1, 06200, Yenimahalle | Ankara, Türkiye",
    onPress:(address:any)=>{
      shell.openExternal(`http://maps.google.com/?q=1200 ${address}`)
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

export const DistanceUnitTypes = {
  Metre: {
    id: 0,
    value: "metre",
    symbol:"m",
    toFeet:((f:number)=>parseFloat((f * 3.281).toString())),
  },
  Feet: {
    id: 1,
    value: "feet",
    symbol:"ft",
    toMeter:((f:number)=>parseFloat((f / 3.281).toString()))
  }
};

export const AngleUnitTypes = {
  Derece: {
    id: 0,
    value: "derece",
    symbol:"°",
  },
  Milyem6000: {
    id: 1,
    value: "6000 Milyem",
    symbol:"m/",
    toDegree:((m:number)=>m*(360/6000))
  },
  Milyem6300: {
    id: 2,
    value: "6300 Milyem",
    symbol:"m/",
    toDegree:((m:number)=>m*(360/6300))

  },
  Milyem6400: {
    id: 3,
    value: "6400 Milyem",
    symbol:"m/",
    toDegree:((m:number)=>m*(360/6400))
  }

};

export const OdometerActivityTypes = {
  Kapali: {
    id: "0",
    value: "kapali",
  },
  Acik: {
    id: "1",
    value: "acik",
  }
};

export const CompassActivityTypes = {
  Kapali: {
    id: "0",
    value: "kapali",
  },
  Acik: {
    id: "1",
    value: "acik",
  }
};

export const BluetoothActivityTypes = {
  Kapali: {
    id: "0",
    value: "kapali",
  },
  Acik: {
    id: "1",
    value: "acik",
  }
};

export const OdometerErrorTypes = {
  BilgiYok: {
    id: "00",
    value: "bilgiyok",
  },
  NA: {
    id: "01",
    value: "N/A",
  },
  HataYok: {
    id: "10",
    value: "hatayok",
  },
  HataVar: {
    id: "11",
    value: "hatavar",
  }
};

export const CompassErrorTypes = {
  BilgiYok: {
    id: "00",
    value: "bilgiyok",
  },
  NA: {
    id: "01",
    value: "N/A",
  },
  HataYok: {
    id: "10",
    value: "hatayok",
  },
  HataVar: {
    id: "11",
    value: "hatavar",
  },
};

export const BluetoothErrorTypes = {
  BilgiYok: {
    id: "00",
    value: "bilgiyok",
  },
  NA: {
    id: "01",
    value: "N/A",
  },
  HataVar: {
    id: "10",
    value: "hatavar",
  },
  HataYok: {
    id: "11",
    value: "hatayok",
  }
};

export const BatteryErrorTypes = {
  BilgiYok: {
    id: "00",
    value: "bilgiyok",
  },
  NA: {
    id: "01",
    value: "N/A",
  },
  PilGucuIyi: {
    id: "10",
    value: "pilgucuiyi",
  },
  PilGucuZayif: {
    id: "11",
    value: "pilgucuzayif",
  }
};

export const ArticleMode = {
  Kapali: {
    id: 0,
    value: "kapali",
  },
  Acik: {
    id: 1,
    value: "acik",
  },
  Otomatik: {
    id: 2,
    value: "otomatik",
  }
};


export const Language = {
  Turkce: {
    id: 0,
    value: "turkce",
  },
  Ingilizce: {
    id: 1,
    value: "ingilizce",
  }
};


export const NightVisionMode = {
  Kapali: {
    id: 0,
    value: "kapali",
  },
  Acik: {
    id: 1,
    value: "acik",
  }
};


export const DeviceSleepTime = {
  t0: {
    id: 0,
    value: "sonsuz",
  },
  t20: {
    id: 1,
    value: "20 "+string.saniye,
  },
  t30: {
    id: 2,
    value: "30 "+string.saniye,
  },
  t60: {
    id: 3,
    value: "1 "+string.dakika,
  },
  t120: {
    id: 4,
    value: "2 "+string.dakika,
  },
  t300: {
    id: 5,
    value: "5 "+string.dakika,
  },
  t600: {
    id: 6,
    value: "10 "+string.dakika,
  }
};


export const BluetoothSleepTime = {
  t0: {
    id: 0,
    value: "sonsuz",
  },
  t20: {
    id: 1,
    value: "20 "+string.saniye,
  },
  t30: {
    id: 2,
    value: "30 "+string.saniye,
  },
  t60: {
    id: 3,
    value: "1 "+string.dakika,
  },
  t120: {
    id: 4,
    value: "2 "+string.dakika,
  },
  t300: {
    id: 5,
    value: "5 "+string.dakika,
  },
  t600: {
    id: 6,
    value: "10 "+string.dakika,
  }
};

export function findType(data: any, id: any, key = "value") {
  let res: any = " ";
  try {
    res = Object.values(data).find((e: any) => e.id == id);
    if (key) res = res[key];
  } catch (e) {}
  return res;
}
