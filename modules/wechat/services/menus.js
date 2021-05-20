/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const http = require('../../../utils/http')
const redis = require('../../../utils/storage')
/**
 * 获取自定义菜单配置接口
 * @param {*} access_token 
 * @returns 
 */
const getMenus = async () => { // scene_str表示字符串类型的场景值ID 长度限制为1 ~ 64
  let access_token = await redis.getItem('access_token')
  const url = `https://api.weixin.qq.com/cgi-bin/menu/get?access_token=${access_token}`
  return new Promise((resolve, reject) => {
    http.get(url, {}).then(resData => {
      console.log('Data', resData)
      resolve(resData)
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}
/**
 * 创建（修改）自定义菜单配置接口
 * @param {*} access_token 
 * @returns 
 */
const updateMenus = async (menus) => { // scene_str表示字符串类型的场景值ID 长度限制为1 ~ 64
  let access_token = await redis.getItem('access_token')
  const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${access_token}`
  return new Promise((resolve, reject) => {
    http.post(url, menus).then(resData => {
      resolve(resData)
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}


module.exports = {
  getMenus,
  updateMenus
}
