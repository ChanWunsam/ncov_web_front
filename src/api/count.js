import Vue from 'vue'
import qs from "query-string"
import {
  Message
} from 'element-ui'
var request = Vue.axios

function errorMsg(error) {
  Message({
    message: error,
    type: 'error',
    duration: 3 * 500
  })
}

// function Msg(error) {
//   Message({
//     message: error,
//     type: 'error',
//     duration: 3 * 500
//   })
// }

function promisePost(url, params) {
  return new Promise(function (resolve, reject) {
    request.post(url, params).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        errorMsg(res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      errorMsg(err)
      reject(err)
    })
  })
}

function getCount(params) {
  return new Promise(function (resolve, reject) {
    request.post(
      "/api/info/getCount", 
      qs.stringify(params)
    ).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } 
      else if(res.data.status === 602) {
        reject(res.data) // 无查询结果特殊处理
      } 
      else {
        errorMsg(res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      errorMsg(err)
      reject(err)
    })
  })
}
function getCase(params) {
  return promisePost(
    "/api/info/getPat",
    qs.stringify(params)
  )
}

//insert count

function insertCount(params) {
  return promisePost(
    "/api/count/insert", 
    qs.stringify(params)
  )
}


function insertCases(params) {
  // 这里不返回stringify
  return promisePost(
    "/api/sample/insert", 
    params
  )
}

function modifyCount(param) {
  return promisePost(
    "/api/count/update", 
    qs.stringify(param)
  )
}


function modifyCase(param) {
  return promisePost(
    "/api/sample/update",
    qs.stringify(param)
  )
}

function deleteCase(id) {
  return promisePost(
    "/api/sample/delete", 
    qs.stringify({ patId: id })
  )
}

function deleteCount(id) {
  return promisePost(
    "/api/count/delete",
    qs.stringify({ countId: id })
  )
}

/**
 * 提供浏览器刷新滚动条不动的功能
 */
function trim(strValue) {    
  return strValue.replace(/^s*|s*$/g,"");    
}

function setCookie(sName,sValue) {    
  document.cookie = sName + "=" + escape(sValue);    
}  

function getCookie(sName) {
  var aCookie = document.cookie.split(";");    
  for(var i = 0; i < aCookie.length; i++) {    
    var aCrumb = aCookie[i].split("=");    
    if(sName === trim(aCrumb[0])) {    
      return unescape(aCrumb[1]);    
    }    
  }    
　return null;    
}
    
function scrollback() {    
  if(getCookie("scroll") !== null) {
    document.body.scrollTop = getCookie("scroll")
  }    
}    

export {
  getCount,
  getCase,
  insertCount,
  insertCases,
  modifyCount,
  modifyCase,
  deleteCase,
  deleteCount,
  setCookie,
  scrollback
}