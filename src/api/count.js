import Vue from 'vue'
import qs from "query-string"
import {
  Message
} from 'element-ui'
var request = Vue.axios

function erroeMsg(error) {
  Message({
    message: error,
    type: 'error',
    duration: 3 * 1000
  })
}

function Msg(error) {
  Message({
    message: error,
    // type: 'error',
    duration: 3 * 1000
  })
}

function getCount(params) {

  return new Promise(function (resolve, reject) {
    request.post("/api/info/getCount", qs.stringify(params)).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        Msg(res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      erroeMsg(err)
      reject(err)
    })
  })
}

function getCase(params) {
  
  return new Promise(function(resolve, reject) {
    request.post("/api/info/getPat", qs.stringify(params)).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        Msg(res.data.desc)
        reject(res.data)
      }
    })
  }).catch(err => {
    erroeMsg(err)
    reject(err)
  })
}

//insert count

function insertCount(params) {

  return new Promise(function (resolve, reject) {
    request.post("/api/count/insert", qs.stringify(params)).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        Msg(res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      erroeMsg(err)
      reject(err)
    })
  })
}


function insertCases(params) {

  return new Promise(function (resolve, reject) {
    request.post("/api/sample/insert", params).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        Msg(res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      erroeMsg(err)
      reject(err)
    })
  })
}

function modifyCount(param) {

  return new Promise(function (resolve, reject) {
    request.post("/api/count/update", param).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        Msg(res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      erroeMsg(err)
      reject(err)
    })
  })
}


function modifyCase(param) {

  return new Promise(
    request.post("/api/sample/update", param).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        Msg(res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      erroeMsg(err)
      reject(err)
    })
  )
}

function deleteCase(id) {
  return new Promise(function (resolve, reject) {
    request.post("/api/sample/delete", qs.stringify({ patId: id })).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        Msg(res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      erroeMsg(err)
      reject(err)
    })
  })
}

function deleteCount(id) {
  return new Promise(function (resolve, reject) {
    request.post("/api/count/delete", qs.stringify({ countId: id })).then(res => {
      if (res.data.status == 0) {
        resolve(res.data)
      } else {
        Msg(res.data.desc)
        reject(res.data)
      }
    }).catch(err => {
      erroeMsg(err)
      reject(err)
    })
  })
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