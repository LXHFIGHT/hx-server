/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const { validator, notifier } = require('./route')
const getAccessToken = require('./services/getAccessToken')
const accountMgr = require('./services/accountMgr')
const materials = require('./services/materials')
const materialRouter = require('./route/materials')
const menuRouter = require('./route/menus')
const menus = require('./services/menus')

let timer = null
/**
 * 生成微信公众号、小程序模块单例的方法
 * @param {Object} options 生成参数 
 * @param {String} options.route 默认路由
 * @param {String} options.appId 公众号 APPID 
 * @param {String} options.appSecret 公众号appSecret
 * @param {String} options.token 服务器配置总所填的 Token
 * @param {Object, Function} options.scanEventResponse 
 *   生成扫码关注或扫码识别公众号动态二维码被动回复消息, 
 *   可以传一个对象来静态回复消息，也支持传一个方法（方法将会有eventkey作为参数）动态回复消息
 * @param {Object, Function} options.subscribeEventResponse 
 *   关注公众号被动回复消息 【静态】
 *   可以传一个对象来静态回复消息，也支持传一个方法（方法将会有eventkey作为参数）动态回复消息
 */
function WechatModule (options = {}) {
  const txt = `WechatModule 模块构造方法需要传一个对对象作为唯一参数，其中需要包含以下字段：
  @param {String} options.appId 公众号 APPID 
  @param {String} options.appSecret 公众号appSecret
  @param {String} options.token 服务器配置总所填的 Token`  
  if (!options) { 
    console.warn(txt)
    return
  }
  if (!options.appId || !options.token || !options.appSecret) { 
    console.warn(txt)
    return
  }
  this.route = (options.route || '/wechat')
  for (let param in options) {
    this[param] = options[param]
  }
  // 获取永久动态二维码方法
  this.getPermanentQrcode = accountMgr.getPermanentQrcode
  // 获取永久动态二维码方法
  this.getMaterials = materials.getMaterials
  // 获取菜单方法
  this.getMenus = menus.getMenus
  // 修改或创建菜单接口
  this.updateMenus = menus.updateMenus
  // 获取 express 的中间件
  this.express = () => {
    return (req, res, next) => {
      if (req.path.indexOf(this.route) !== 0) {
        console.log('not found', req.path, this.route)
        next()
      } 
      if (req.path === this.route) {
        switch (req.method) {
          case 'GET': validator(req, res, this.token); break;
          case 'POST': notifier(req, res, this); break;
          default: next();
        }
      } else if (req.path.indexOf(`${this.route}/material`) === 0) {
        materialRouter(req, res, next)
      } else if (req.path.indexOf(`${this.route}/menu`) === 0) {
        menuRouter(req, res, next)
      } else {
        next()
      }
    }
  }
  // 模块初始化时启动定时器
  this.init = () => {
    // 微信模块初始化
    getAccessToken(this.appId, this.appSecret)
    if (!timer) {
      // 每分钟查询一次access_token过期
      timer = setInterval(() => {
        getAccessToken(this.appId, this.appSecret)
      }, 60000)
    }
  }
  this.init() // 初始化
}

module.exports = WechatModule
