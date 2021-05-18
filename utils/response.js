/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
/**
 * 封装响应参数JSON对象
 * @param options.msg 响应信息
 * @param options.data 响应数据主体
 * @param options.result 响应是否成功 0 为成功 其他书为失败
 * @return {*} 响应JSON数据
 */
let getResponseBundle = (options) => {
  let { msg, data, result } = options;
  (typeof result === 'undefined') &&  (result = (data !== -1) ? 0 : 1);
  let jsonData = { result, data, msg };
  return JSON.stringify(jsonData);
}

/**
 * 进行服务端响应处理
 * @param res 响应处理对象
 * @param data 响应数据
 * @param options 响应状态码
 */
let sendResponse = (res, data, options = {}) => {
  const code = options.code || 200
  const headers = options.headers || {}
  let responseData = data
  if (typeof responseData !== 'string') {
    responseData = JSON.stringify(responseData)
  }
  // 根据生产环境与否添加Access-Control-Allow-Origin头信息
  if (!process.env.NODE_ENV) {
    // 设置响应头
    res.writeHead(code, {
      'charset': 'utf-8',
      'Access-Control-Allow-Origin':'*',
      'Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':'Content-Type,Content-Length, Authorization, Accept, X-Requested-With',
      'content-type': headers['content-type'] || 'application/json, application/x-www-form-urlencoded',
    })
  } else {
    // 设置响应头
    res.writeHead(code, {
      'charset': 'utf-8',
      'Access-Control-Allow-Methods':'PUT,POST,GET,DELETE,OPTIONS',
      'Access-Control-Allow-Headers':'Content-Type,Content-Length, Authorization, Accept, X-Requested-With',
      'content-type': headers['content-type'] || 'application/json, application/x-www-form-urlencoded',
    })
  }
  res.write(responseData)
  res.end()
};

module.exports = {
  sendResponse,
  getResponseBundle
}