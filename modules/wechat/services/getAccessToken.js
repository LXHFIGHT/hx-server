/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const http = require('./../../../utils/http')
const KEY_WECHAT_ACCESS_TOKEN = 'KEY_WECHAT_ACCESS_TOKEN'
module.exports = (appId, appSecret) => {
  const now = Date.now()
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
    http.get(url).then(res => {
      console.log('ACCESS_TOKEN', res)
      let bundle = {
        ...res,
        expired_at: now + res.expires_in * 1000
      }
      resolve(res.access_token)
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })  
}