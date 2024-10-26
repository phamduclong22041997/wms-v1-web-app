import { Injectable } from '@angular/core';
import { enc, mode, pad, AES } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EDService {
  constructor() { }
  
  getSalt() {
    return {
      key: window.localStorage.getItem("_token"),
      iv: window.localStorage.getItem("appid")
    }
  }
  encryptSalt() {
    let salt = this.getSalt();
    return enc.Base64.stringify(enc.Utf8.parse(JSON.stringify(salt)));
  }
  decryptSalt(salt:string) {
    let parsedWordArray = enc.Base64.parse(salt);
    let parsedStr = parsedWordArray.toString(enc.Utf8);
    return JSON.parse(parsedStr);
  }
  encrypt(value: any) {
    let salt = this.getSalt();

    let key = enc.Hex.parse(salt['key']);

    let iv = enc.Hex.parse(salt['iv']);
    let encrypted = AES.encrypt(enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: mode.CBC,
        padding: pad.Pkcs7
      });

    return encrypted.toString();
  }

  decrypt(salt: any, value: any) {
    let key = enc.Hex.parse(salt['key']);

    let iv = enc.Hex.parse(salt['iv']);
    let decrypted = AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: mode.CBC,
      padding: pad.Pkcs7
    });

    return decrypted.toString(enc.Utf8);
  }
}