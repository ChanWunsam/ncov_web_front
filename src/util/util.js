import Vue from 'vue'
// import qs from "query-string"
import {
  Message
} from 'element-ui'
var request = Vue.axios

function message(type, msg) {
  Message({
    type: type,
    message: msg,
    showClose: true,
    duration: 1500
  })
}

function promisePost(url, param) {
  return new Promise(function (resolve, reject) {
    request.post(
      url, 
      param
    ).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        message("error", res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      message("error", err)
      reject(err)
    })
  })
}

function getNextLoc(param) {
  return promisePost(
    "/api/mark/info/getNextLoc",
    {
      locId: param.locId
    }
  )
}

function insertLoc(param) {
  return promisePost(
    "/api/mark/region/insert",
    {
      partnerId: param.partnerId,
      level: param.level,
      name: param.name
    }
  )
}

function getCount(param) {
  return promisePost(
    "/api/mark/info/getCount", 
    {
      locId: param.locId,
      date: param.date
    }
  )
}

function getCase(param) {
  return promisePost(
    "/api/mark/info/getPat",
    {
      locId: param.locId,
      date: param.date
    }
  )
}

//insert count

function insertCount(param) {
  return promisePost(
    "/api/mark/count/insert", 
    {
      countRegionId: param.countRegionId,
      countDate: param.countDate,
      countConfirm: param.countConfirm,
      countRecover: param.countRecover,
      countDead: param.countDead,
      countSourceUrl: param.countSourceUrl,
      countSourceText: param.countSourceText,
    }
  )
}


function insertCases(param) {
  return promisePost(
    "/api/mark/sample/insert", 
    {
      sampleRegionId: param.sampleRegionId,
      sampleSex: param.sampleSex,
      sampleAge: param.sampleAge,
      sampleType: param.sampleType,
      sampleDate: param.sampleDate,
      sampleConfirmTime: param.sampleConfirmTime,
      sampleSourceUrl: param.sampleSourceUrl,
      sampleSourceText: param.sampleSourceText,
      sampleCustomTag: param.sampleCustomTag,
    }
  )
}

function modifyCount(param) {
  return promisePost(
    "/api/mark/count/update", 
    {
      id: param.id,
      countRegionId: param.countRegionId,
      countDate: param.countDate,
      countConfirm: param.countConfirm,
      countRecover: param.countRecover,
      countDead: param.countDead,
      countSourceUrl: param.countSourceUrl,
      countSourceText: param.countSourceText,
    }
  )
}


function modifyCase(param) {
  return promisePost(
    "/api/mark/sample/update",
    {
      id: param.id,
      sampleRegionId: param.sampleRegionId,
      sampleSex: param.sampleSex,
      sampleAge: param.sampleAge,
      sampleType: param.sampleType,
      sampleDate: param.sampleDate,
      sampleConfirmTime: param.sampleConfirmTime,
      sampleSourceUrl: param.sampleSourceUrl,
      sampleSourceText: param.sampleSourceText,
      sampleCustomTag: param.sampleCustomTag,
    }
  )
}

function deleteCase(param) {
  return promisePost(
    "/api/mark/sample/delete", 
    { 
      patId: param.patId
    }
  )
}

function deleteCount(param) {
  return promisePost(
    "/api/mark/count/delete",
    { 
      countId: param.countId
    }
  )
}

function register(param) {
  return promisePost(
    "/api/mark/user/register", 
    {
      phone: param.phone,
      password: param.password
    }
  )
}

function login(param) {
  return promisePost(
    "/api/mark/user/login", 
    {
      phone: param.phone,
      password: param.password
    }
  )
}

function getUserInfo(param) {
  return promisePost(
    "/api/mark/user/info",
    { 
      phone: param.phone 
    }
  )
}

function updateUserInfo(param) {
  return promisePost(
    "/api/mark/user/update",
    {
      phone: param.phone,
      region_id: param.region_id
    }
  )
}

function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + escape(cvalue) + ";";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return unescape(c.substring(name.length, c.length));
  }
  return "";
}

/**
 * 提供浏览器刷新滚动条不动的功能
 */

function setLS(sName,sValue) {    
  localStorage.setItem(sName, escape(sValue));
}  

function getLS(sName) {
  return unescape(localStorage.getItem(sName));
}
    
function scrollback() {    
  var scroll = getLS("scroll")
  if(scroll !== null) {
    window.document.documentElement.scrollTop = Number(scroll)
    // window.document.body.scrollTop = Number(scroll)
  }    
}    

function deepCopyArr(arr) {
  return JSON.parse(JSON.stringify(arr));
}

function debounce(func, delay = 1000, immediate = false){
  var timer = null;
  return function(){
    var context = this;
    var args = arguments;
    if(timer) clearTimeout(timer);
    if(immediate){
      var doNow = !timer;
      timer = setTimeout(function(){
        timer = null;
      }, delay);
      if(doNow){
        func.apply(context,args);
      }
    }else{
      timer = setTimeout(function(){
        func.apply(context,args);
      }, delay);
    }
  }
}


function isEmpty(value) {
  if ((!value || (Array.isArray(value) && value.length === 0)) && value !== 0) { // value == 0 也不是 empty
    return true;
  } else {
    return false;
  }
}

export {
  message,
  insertLoc,
  getNextLoc,
  getCount,
  getCase,
  insertCount,
  insertCases,
  modifyCount,
  modifyCase,
  deleteCase,
  deleteCount,
  register,
  login,
  getUserInfo,
  updateUserInfo,
  setCookie,
  getCookie,
  getLS,
  setLS,
  scrollback,
  deepCopyArr,
  debounce,
  isEmpty,
}