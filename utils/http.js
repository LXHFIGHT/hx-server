/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const axios = require('axios')
const fs = require('fs')
const { getNotNullObject } = require('./object')
const { axiosTimeout } = require('./../config')
axios.defaults.timeout = axiosTimeout // 设置接口响应时间为

/**
 * 检查返回数据是否有问题
 * @param res 响应数据
 */
const checkResponse = (res) => {
  // 统一数据处理
  return res.data
}
/**
 * 统一处理错误信息
 * @param err 请求返回的错误信息
 */
const handleError = (err) => { console.error(err) }

/**
 * 
 * @param {*} method  请求方法
 * @param {*} path    请求路径
 * @param {*} requestData   请求参数
 * @param {*} options  附加操作
 * @param {Boolean} options.prefix 设置请求前缀  默认为 api/
 * @param {Boolean} options.hasNull 设置请求参数是否需要可以为空
 */
const fetch = (method, url, requestData, options = {}) => {
  const contentType = 'application/json'
  const headers = {
    'Content-Type': contentType
  }
  const data = options.hasNull ? requestData : getNotNullObject(requestData)
  let bundle = (method === 'get' || method === 'delete') ? { params: data } : data
  return axios[method](url, bundle, { headers })
    .then(res => {
      return checkResponse(res)
    })
    .catch(err => {
      handleError(err)
    })
}

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      responseType: 'arraybuffer'
    }).then(response => {
      const data = new Buffer.from(response.data, 'binary')
      if (fs.existsSync(dest)) {
        fs.writeFileSync(dest, data, 'binary')
      } else {
        fs.appendFileSync(dest, data, 'binary')
      }
      resolve(dest)
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

module.exports = {
  post (url, data = {}, options = {}) {
    return fetch('post', url, data, options)
  },
  get (url, data = {}, options = {}) {
    return fetch('get', url, data, options)
  },
  put (url, data, options = {}) {
    return fetch('put', url, data, options)
  },
  del (url) {
    return fetch('delete', url, {})
  },
  downloadFile
}
