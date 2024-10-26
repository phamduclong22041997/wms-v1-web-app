const CryptoJS = require("crypto-js");

let trimObjectEle = function (data: any) {
  for (let i in data) {
    if (data[i]) {
      if (typeof data[i] == "string") {
        data[i] = data[i].trim();
      }
      if (typeof data[i] == "object") {
        data[i] = trimObjectEle(data[i]);
      }
    }
  }
  return data;
}

let strSpecialReplace = function(str){
  const findreplace = {
    "&"   : '&amp;',
    '"'   : '&quot;',
    '\''  : '&apos;',
    '<'   : '&lt;',
    '>'   : '&gt;',
  }
  return str.replace(new RegExp("(" + Object.keys(findreplace).map(function(i){return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}).join("|") + ")", "g"), function(s){ return findreplace[s]});
}

let strSpecialRemove = function(str){
  const findreplace = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
  return str.replace(new RegExp("(" + findreplace.split('').map(function(i){return i.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&")}).join("|") + ")", "g"), function(s){ return ''});
}

let formatNumberFixed = function(val, fixed = 0){
  if(val){
      try{
          let ret = (Math.round(val * 100) / 100).toFixed(fixed||0);
          return parseFloat(ret);
      }
      catch(e){
          return val;
      }
  }
  return val;
}
let formatNumber = function(val, fixed = 0, thousand = '.', percent = ','){
  if(val){
      try{
          thousand = thousand || '.';
          percent = percent || ','
          let ret = (Math.round(val * 1000) / 1000).toFixed(fixed || 0);
          let r = parseFloat(ret);
          if(fixed){
              return r.toString().replace(thousand, percent).replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
          }
          return r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
      }
      catch(e){
          return val;
      }
  }
  return val;
}
let unique = (value, index, self) => {
  return self.indexOf(value) === index
}
let addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
let addMonths = (date, months) => {
  var result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

let addMinutes = (date, minutes) => {
  var result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
}

let addSeconds = (date, seconds) => {
  var result = new Date(date);
  result.setSeconds(result.getSeconds() + seconds);
  return result;
}

/* encrypt / decrypt func */
const SECRET_KEY = ""; // 32 chars
const SECRET_IV = "hMxpX@ZkSTX6erTu"; // 16 chars
const SECRET_OPTIONS = { 
    iv: CryptoJS.enc.Utf8.parse(SECRET_IV), 
    keySize: 256,
    mode: CryptoJS.mode.CBC,
    dataFormat: "Base64"
};
let getDate = (date: Date = null, type: any = null) => {
  let d = new Date();
  if (date) d = new Date(date);
  let month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hour = '' + d.getHours(),
    minute = '' + d.getMinutes();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  if (hour.length < 2)
    hour = '0' + hour;
  if (minute.length < 2)
    minute = '0' + minute;
  if (type == 1)
    return `${year}-${month}-${day}`;
  else
    return `${year}-${month}-${day} ${hour}:${minute}`;
}

let getSecretKey = (options) => {
  if (!options) {
    options = {};
  }
  if (!options.pass) {
    options.pass = getDate();
  }
  if (!options.key_template) {
    let wh = options.WarehouseCode || 'WHD'; // warehouse generate QRCode
    return `OVTEEAM#SFT#${wh}#${options.pass}`;
  }
  else {
    return `${options.key_template}${options.pass}`;
  }
}

let decrypt = (text, options: any = {}) => {
  let secretKey = getSecretKey(options);
  let key = CryptoJS.enc.Utf8.parse(secretKey);
  let secret_options = SECRET_OPTIONS;
  if (options.secret_iv) {
    secret_options.iv = CryptoJS.enc.Utf8.parse(options.secret_iv);
  }
  let data = CryptoJS.AES.decrypt(text, key, secret_options);
  let res = '';
  try {
    res = data.toString(CryptoJS.enc.Utf8);
  }
  catch {
    res = 'Descrypt error';
  }
  return res;
}

let encrypt = (text, options: any = {}) => {
  let secretKey = getSecretKey(options);
  let key = CryptoJS.enc.Utf8.parse(secretKey);
  if (key && key.length > 32) {
    return 'Secret Key invalid';
  }
  let secret_options = SECRET_OPTIONS;
  if(options.secret_iv){
    secret_options.iv = CryptoJS.enc.Utf8.parse(options.secret_iv);
  }
  let data = CryptoJS.AES.encrypt(text, key, secret_options);
  let res = data.toString();
  return res;
}

let formatPhone =  (phone) => {
  if (!phone) return phone;
  return phone.replace(/.(?=.{4})/g, 'x')
}
function getWarehouseCode() {
  return window.localStorage.getItem("_warehouse") || ""
}
function getUserRole() {
  try {
    let info =  window.localStorage.getItem("_info");
    if(info) {
    return JSON.parse(info);
    }
}catch(err) {}
  return ""
}
function getInfoUser() {
  try {
    let info = window.localStorage.getItem("_info");
    if (info) {
      return JSON.parse(info);
    }
  } catch (err) { }
  return null
}
function formatTextNumber(text) {
  return text ? text.replace(/^0+/, "") : text;
}
function formatKMName(text, ref) {
  return ref ? `[KM] ${text}` : text;
}

function formatFilterContent(text) {
  let pattern = /(\sPO)|(\sSTO)|(\sSO)|(\sTS)|(\s70)|(\s41)|(\s43)|(\s8)|(\sPA)|(\sTE)/;
  if (pattern.test(`${text}`)) {
    text = `${text}`.replace(/\s/g, ",");
  }
  let tmp = `${text}`.split(",");
  if (tmp.length > 1) {
    pattern = /^(PO|STO|SO|TS|70|41|43|8|PA|TE)/;
    let isValid = true
    let arr = tmp.filter(value => value.trim() !== "");
    for (const item of arr) {
      if (!pattern.test(item)) {
        isValid = false
        break;
      }
    }
    if (isValid == true) {
      return arr.filter((item, index) => arr.indexOf(item) === index).join(',');
    }
  }
  return `${text}`.trim();
}

const Utils = {
  formatNumber, 
  formatNumberFixed,
  trimObjectEle, 
  strSpecialReplace, 
  strSpecialRemove,
  unique,
  addSeconds,
  addMinutes,
  addDays,
  addMonths,
  decrypt,
  encrypt,
  getDate,
  formatPhone,
  getWarehouseCode,
  getUserRole,
  getInfoUser,
  formatTextNumber,
  formatKMName,
  formatFilterContent
}

export {
  Utils
}