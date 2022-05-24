
export function toParse(data:any,key:string="") {
  let new_data=[];
  try {
    if(key)
      data = data[key]
    new_data = JSON.parse(data)

    if(!new_data)
      throw""
  }catch (e) {
    new_data=[]
  }

  return new_data;
}

export function toJSON(data:any) {
  let new_data="[]";
  try {
    new_data = JSON.stringify(data)
    if(!new_data)
      throw""
  }catch (e) {
    new_data="[]"
  }

  return new_data;
}
