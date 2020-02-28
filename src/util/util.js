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
    param
  )
}

function getCount(param) {
  return promisePost(
    "/api/mark/info/getCount", 
    param
  )
}

function getCase(param) {
  return promisePost(
    "/api/mark/info/getPat",
    param
  )
}

//insert count

function insertCount(param) {
  return promisePost(
    "/api/mark/count/insert", 
    param
  )
}


function insertCases(param) {
  // 这里不返回stringify
  return promisePost(
    "/api/mark/sample/insert", 
    param
  )
}

function modifyCount(param) {
  return promisePost(
    "/api/mark/count/update", 
    param
  )
}


function modifyCase(param) {
  return promisePost(
    "/api/mark/sample/update",
    param
  )
}

function deleteCase(id) {
  return promisePost(
    "/api/mark/sample/delete", 
    { patId: id }
  )
}

function deleteCount(id) {
  return promisePost(
    "/api/mark/count/delete",
    { countId: id }
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

function register(param) {
  return promisePost(
    "/api/mark/user/register", 
    param
  )
}

function login(param) {
  return promisePost(
    "/api/mark/user/login", 
    param
  )
}
function deepCopyArr(arr) {
  return JSON.parse(JSON.stringify(arr));
}

export {
  message,
  getNextLoc,
  getCount,
  getCase,
  insertCount,
  insertCases,
  modifyCount,
  modifyCase,
  deleteCase,
  deleteCount,
  setCookie,
  getCookie,
  getLS,
  setLS,
  scrollback,
  register,
  login,
  deepCopyArr
}