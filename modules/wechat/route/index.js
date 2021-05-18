/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : 引入微信生态后需要添加的路由
 */

// var router = express.Router()
const { checkSignature, getMsgBundle } = require('./../services')
const responseUtil = require('../../../utils/response')

/* GET home page. */
const validator = (req, res, token) => {
  let result = checkSignature(req, token)
  if (result) {
    responseUtil.sendResponse(res, result)
  } else {
    responseUtil.sendResponse(res, { errMsg: 'Signature Not Match' })
  }
}

// 监控 微信服务器的通知
const notifier = (req, res, options) => {
  const data = req.body.xml
  let headers = {}
  if (!data) {
    responseUtil.sendResponse(res, '', {
      headers: { 'content-type': 'text/plain' }
    })
    return
  }
  const event = data.event ? data.event[0] : ''
  const scanEventResponse = options.scanEventResponse
  let responseText = ''
  switch (event) {
    case 'subscribe': // 微信模块构造方法中如果传 scanEventResponse 字段才启用扫码被动回复逻辑
      responseText = scanEventResponse ? getMsgBundle(req, scanEventResponse) : ''; 
      break;
    case 'SCAN': // 微信模块构造方法中如果传 scanEventResponse 字段才启用扫码被动回复逻辑
      responseText = scanEventResponse ? getMsgBundle(req, scanEventResponse) : ''; 
      break;
    default: console.log('UNKNOWN EVENT');
  }
  headers['content-type'] = responseText ? 'text/xml' : 'text/plain'
  headers['content-length'] = `${responseText.length}`
  responseUtil.sendResponse(res, responseText, { headers })
}

module.exports = { validator, notifier }
