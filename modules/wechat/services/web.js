/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : 和微信网页相关模块相关的服务
 */
const http = require('../../../utils/http')
const redis = require('../../../utils/storage')
const { wechat } = require('./../../../config')
const { getAccessToken } = require('./../utils')
const { randomString, encryptStr } = require('./../../../utils/object')
const { sendResponse } = require('./../../../utils/response')
/**
 * 获取自定义菜单配置接口
 * @returns 
 */
const getApiTicket = () => { // scene_str表示字符串类型的场景值ID 长度限制为1 ~ 64
  return new Promise(async (resolve, reject) => {
    let api_ticket = await redis.getItem('api_ticket')
    let api_ticket_expired_at = await redis.getItem('api_ticket_expired_at')
    if (Date.now() < parseInt(api_ticket_expired_at)) {
      resolve(api_ticket)
      return
    }
    let access_token = await getAccessToken()
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
    http.get(url, {}).then(resData => {
      const { errmsg, ticket, expires_in } = resData
      if (errmsg === 'ok') {
        redis.setItem('api_ticket', ticket)
        redis.setItem('api_ticket_expired_at', (Date.now() + expires_in * 1000))
        resolve(ticket)
      }  else {
        reject(errmsg)
      }
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

const jsConfigRoute = async (req, res) => {
  const { url } = req.query
  const jsapi_ticket = await getApiTicket()
  console.log('URL', url)
  let bundle = {
    appId: wechat.appId,
    timestamp: parseInt(Date.now() / 1000),
    nonceStr: randomString(16),
    signature: ''
  }
  const str = `noncestr=${bundle.nonceStr}&jsapi_ticket=${jsapi_ticket}&timestamp=${bundle.timestamp}&url=${url}`
  console.log('encryptStr', str)
  bundle.signature = encryptStr(str, 'sha1')
  sendResponse(res, bundle)
}

module.exports = {
  getApiTicket,
  jsConfigRoute
}
