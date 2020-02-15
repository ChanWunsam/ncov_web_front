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

function promisePost(url, param) {
  return new Promise(function (resolve, reject) {
    axios({
      method: 'post',
      url: url,
      data: param
    }).then(res => {
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
      "/api/mark/info/getCount", 
      params
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
    "/api/mark/info/getPat",
    params
  )
}

//insert count

function insertCount(params) {
  return promisePost(
    "/api/mark/count/insert", 
    params
  )
}


function insertCases(params) {
  // 这里不返回stringify
  return promisePost(
    "/api/mark/sample/insert", 
    params
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

export {
  getCount,
  getCase,
  insertCount,
  insertCases,
  modifyCount,
  modifyCase,
  deleteCase,
  deleteCount
}