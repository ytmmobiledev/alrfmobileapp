import CryptoES from 'crypto-es';

const key = "cyberistanbul"

//Şifreleme
export function encryption(data:string) {
  const encrypted = CryptoES.AES.encrypt(data, key);
  return encrypted.toString();
}

//Şifre Çözme
export function decryption(encrypted:string) {
  const decrypted = CryptoES.AES.decrypt(encrypted, key);
  return decrypted.toString(CryptoES.enc.Utf8)
}