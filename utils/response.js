/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const { SUCCESS_STATUS_CODE, FAIL_STATUS_CODE, server } = require('./../config')
const { SUCCESS_HTTP_MESSAGE } = require('./../const')

/**
 * 封装响应参数JSON对象
 * @param options.msg 响应信息
 * @param options.data 响应数据主体
 * @param options.result 响应是否成功 successStatusCode 为成功 其他为失败
 * @return {*} 响应JSON数据
 */
let getResponseBundle = (options) => {
  const result = options.result || SUCCESS_STATUS_CODE
  const data = options.data || {}
  const msg = options.msg || SUCCESS_HTTP_MESSAGE
  return JSON.stringify({ result, data, msg });
}

/**
 * 进行服务端响应处理
 * @param res 响应处理对象
 * @param data 响应数据
 * @param options 响应状态附加参数
 * @param options.headers 响应头集合
 * @param options.code 响应状态码
 */
let sendResponse = (res, data, options = {}) => {
  const headerOption = options.headers || {}
  const code = options.code || 200
  let responseData = typeof data !== 'string' ? JSON.stringify(data) : data
  let headers = {
    'charset': 'utf-8',
    'Access-Control-Allow-Origin': server.accessControlAllowOrigin,
    'Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS',
    'Access-Control-Allow-Headers':'Content-Type,Content-Length, Authorization, Accept, X-Requested-With',
    ...headerOption,
    'Content-Type': headerOption['Content-Type'] || 'application/json'
  }
  res.set(headers)
  res.status(code).send(responseData)
};

module.exports = {
  sendResponse,
  getResponseBundle
}