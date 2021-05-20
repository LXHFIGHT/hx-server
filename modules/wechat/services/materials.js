/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : 获取素材列表接口【通过】
 */

const http = require('../../../utils/http')
const storage = require('../../../utils/storage')
/**
 * 获取永久素材列表接口
 * @param {Object} options 请求对象
 * @param {String} options.type 素材的类型，图片（image）、视频（video）、语音 （voice）、图文（news）
 * @param {Number} options.page 当前页数 从1开始
 * @param {Number} options.pageSize 每页记录数（1~20之间）
 * @returns {Promise}
 */
const getMaterials = (options = {}) => { // scene_str表示字符串类型的场景值ID 长度限制为1 ~ 64
  return new Promise(async (resolve, reject) => {
    let access_token = await storage.getItem('access_token')
    const url = `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${access_token}`
    if (!options.type) {
      console.warn('options.type为必填项, 素材的类型分别传 图片（image）、视频（video）、语音 （voice）、图文（news）')
      reject('options.type为必填项, 素材的类型分别传 图片（image）、视频（video）、语音 （voice）、图文（news）')
      return
    }
    const page = options.page || 1
    let requestBundle = {
      type: options.type,
      count: options.pageSize > 20 ? 20 : (options.pageSize || 20)
    }
    requestBundle['offset'] = requestBundle.count * (page - 1)
    console.log('RequestBundle', requestBundle)
    http.post(url, requestBundle).then(resData => {
      resolve(resData)
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

module.exports = {
  getMaterials
}
