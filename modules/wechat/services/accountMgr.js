/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const http = require('../../../utils/http')
const storage = require('../../../utils/storage')

const getPermanentQrcode = async (scene_id, type = 'string') => { // scene_str表示字符串类型的场景值ID 长度限制为1 ~ 64
  const access_token = await storage.getItem('access_token')
  const url = `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${access_token}`
  const requestBundle = { 
    action_name: type === 'string' ? 'QR_LIMIT_STR_SCENE' : 'QR_LIMIT_SCENE', 
    action_info: { scene: type === 'string' ? { scene_str: scene_id } : { scene_id } }
  }
  return new Promise((resolve, reject) => {
    http.post(url, requestBundle).then(resData => {
      const data = {
        ...resData,
        qrcodeUrl: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURI(resData.ticket)}`
      }
      resolve(data)
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

module.exports = {
  getPermanentQrcode
}
