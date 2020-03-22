import axios from 'axios';
import { Message } from 'element-ui'
import Qs from 'qs'
import router from '../router'
import { loginOutClear } from '@/utils/index.js'

/**
 * 请求前拦截
 * 用于处理需要在请求前的操作
 */

export let isPro = true // true 正式 | false 测试环境
export const baseUrl = isPro ? 'http://fenxiaoserver.hbbclub.com/api' : 'http://192.168.100.235:8888/api' //接口235地址 
// export const baseUrl = isPro ? 'https://huitong.hbbclub.com/api' : 'http://192.168.100.194:8000/api' //王果接口
// export const baseUrl = isPro ? 'https://huitong.hbbclub.com/api' : 'http://192.168.100.199:8888/api' //小春春
export const uploadUrl = isPro ? 'http://screentest.hbbclub.com' : 'http://192.168.100.235:8002'   //上传文件公共接口

axios.defaults.baseURl = process.env.VUE_APP_API_ADMIN
axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json';
  let token = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {};
  config.headers['token'] = token ? token.token : '1682F7E9004A6363F7F906AB5BED6943'
  return config
}, (error) => {
  console.log('error')
  return Promise.reject(error)
})
/**
 * 请求响应拦截
 * 用于处理需要在请求返回后的操作
 */
axios.interceptors.response.use(response => {



  const responseCode = response.status
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  if (responseCode === 200) {

    if (response.data.code === 200) {
      return Promise.resolve(response)
    } else {
      let error_code = response.data.code;
      switch (error_code) {
        case '400':
          Message({
            type: 'error',
            message: response.data.msg
          })
          // loginOutClear();
          break;
      }
    }
  } else {
    switch (responseCode) {
      case 299:
        localStorage.removeItem('userInfo')
        Message({
          type: 'error',
          message: '会话过期，请重新登录'
        })
        // 跳转登录页
        loginOutClear();
        break
    }
    return Promise.reject(response)
  }
}, error => {
  // 可以根据后端返回的状态码进行不同的操作
  const responseCode = error.response.status
  switch (responseCode) {
    // case 299:
    //   localStorage.removeItem('userInfo')
    //   Message({
    //     type: 'error',
    //     message: '会话过期，请重新登录'
    //   })
    //   // 跳转登录页
    //   router.replace({
    //     path: '/login',
    //     query: {
    //       redirect: router.currentRoute.fullPath
    //     }
    //   })
    //   break
    // 401：帐号密码错误
    case 401:
      Message({
        type: 'error',
        message: '帐号密码错误'
      });
      loginOutClear();
      break
    // 403: token过期
    case 403:
      // 弹出错误信息
      Message({
        type: 'error',
        message: error.response.data.msg || ''
      })
      // 跳转登录页
      loginOutClear();
      // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
      // setTimeout(() => {
      //   router.replace({
      //     path: '/login',
      //     query: {
      //       redirect: router.currentRoute.fullPath
      //     }
      //   })
      // }, 1000)
      break
    // 404请求不存在
    case 404:
      Message({
        message: '网络请求不存在',
        type: 'error'
      })
      break
    // 其他错误，直接抛出错误提示
    case 500:
      Message({
        message: '服务器错误',
        type: 'error'
      })
      break
    default:
      Message({
        message: error.response.data.msg,
        type: 'error'
      })
  }
  return Promise.reject(error)
})


export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, Qs.parse(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

export function postfile(url, params) {
  return new Promise((resolve, reject) => {
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    axios.post(url, params, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, { params: params })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, params)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

export function del(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, { data: params })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}



