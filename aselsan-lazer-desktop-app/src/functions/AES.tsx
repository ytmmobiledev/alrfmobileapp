// @ts-ignore
import aesjs from "aes-js";
import { randomBytes } from "crypto";

export const productId = [0x41, 0x4c, 0x52, 0x46];
export const key = [
  0xa4, 0x71, 0x64, 0xda, 0xce, 0x18, 0xe0, 0x1a, 0xab, 0xfe, 0x45, 0x62, 0xa4,
  0xd8, 0xd5, 0x55,
];

export const createIV = () => {
  return randomBytes(16);
};

export const encrypt = (data: number[], iv: Uint8Array): Uint8Array => {
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  return aesCbc.encrypt(data);
};

export const decrypt = (data: number[], iv: Uint8Array): Uint8Array => {
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  return aesCbc.decrypt(data);
};
