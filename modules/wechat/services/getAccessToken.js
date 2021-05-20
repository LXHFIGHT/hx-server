/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const http = require('./../../../utils/http')
const storage = require('../../../utils/storage')
const logger = require('./../../../utils/logger')
// const KEY_WECHAT_ACCESS_TOKEN = 'KEY_WECHAT_ACCESS_TOKEN'
module.exports = async (appId, appSecret) => {
  const now = Date.now()
  const access_token = await storage.getItem('access_token')
  const expired_at = await storage.getItem('expired_at')
  const _requestAccessToken = () => {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
    http.get(url).then(res => {
      console.log('Get AccessToken', res)
      if (!res.access_token) {
        logger.warn(`获取AccessToken出错：${res}`)
        return
      }
      storage.setItem('access_token', res.access_token)
      storage.setItem('expired_at', (now + res.expires_in * 1000))
      console.log('Wechat access_token refreshed')
    }).catch(err => {
      console.error('Wechat access_token refresh failed: ', err)
    })
  }
  if (!access_token || isNaN(expired_at)) {
    _requestAccessToken()
  } else {
    if (now + 60000 > expired_at) {
      _requestAccessToken()
    } else {
      console.log(`当前AccessToken 有效，有效期至：`, new Date(parseInt(expired_at)).toLocaleString())
    }
  }
}
