import { Buffer } from "buffer";



export function HexToBase64(data:any) {
  return Buffer.from(data, "hex").toString("base64")
}


export function Base64ToHex(data:any) {
  return Buffer.from(data, 'base64')
}