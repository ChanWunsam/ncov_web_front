"use strict";

import Vue from 'vue';
import axios from "axios";
import {
  Message
} from 'element-ui'

function erroeMsg(error) {
  Message({
    message: error,
    type: 'error',
    duration: 3 * 1000
  })
}



// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: "http://riwang.online:8082"
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    if (response.data.status == 0) {
      return response;
    } else {
      if (response.config.url.indexOf('info')) {
        return response;
      } else {
        erroeMsg(response.data.desc)
      }
      return response;
    }
  },
  function (error) {
    erroeMsg(error)
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;