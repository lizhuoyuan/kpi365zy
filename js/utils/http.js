/**
 * Http
 * Created by Jeepeng on 2015/9/10.
 */

'use strict';

import config from '../config'

/**
 * 检查状态码
 * @param response
 * @returns {*}
 */
const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new Error(response.statusText || `statusCode: ${response.status}`);
    error.response = response;
    throw error;
  }
};

const parseJSON = (response) => {
  try {
    return response.json();
  } catch(err) {
    throw err;
  }
};

/**
 * object转成url后的查询字符串
 * @param obj
 * @returns {string}
 */
const toQueryString = (obj = {}) => {
  let items = [];
  Object.keys(obj).forEach(key => {
    items.push(`${key}=${encodeURIComponent(obj[key])}`);
  });
  return '?' + items.join('&');
};

export default {

  request(url, options) {
    console.log(url);
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(data => data)
      .catch(err => err);
  },

  get(url = '', data = {}) {
   // data = {...data, x_version: config.app.js.version};  // 加入当前js版本号
    url += toQueryString(data);
    let options = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 20000
    };
    return this.request(url, options)
  },

  post(url = '', data = {}) {
    console.log(data);
    //data = {...data, x_version: config.app.js.version};  // 加入当前js版本号
    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 20000,
      body: JSON.stringify(data)
    };

    return this.request(url, options);
  },

  requestService(serviceName, data) {
    return this.post(`${config.webapi.service}${serviceName}/`, data)
      .then(json => {
        if(json instanceof Error){
          throw json
        } else if(json.code === "OK"){
          return Promise.resolve(json.datas.data);
        } else {
          throw new Error(json.msg);
        }
      })
      .catch(err => Promise.reject(err));
  }

}