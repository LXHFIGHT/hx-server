/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const { validator, notifier } = require('./route')
const getAccessToken = require('./services/getAccessToken')
const getPermanentQrcode = require('./services/getPermanentQrcode')
const getMaterials = require('./services/getMaterials')

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
 */
function WechatModule (options) {
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
  this.appId = options.appId  
  this.token = options.token
  this.appSecret = options.appSecret
  this.scanEventResponse = options.scanEventResponse
  // 获取永久动态二维码方法
  this.getPermanentQrcode = (scene_id, type = 'string') => {
    if (!scene_id && scene_id !== 0) {
      console.warn('调用获取永久二维码需传场景ID')
      return new Promise(() => {})
    }
    return getAccessToken(this.appId, this.appSecret).then(access_token => {
      return getPermanentQrcode(scene_id, type, access_token)
    }).catch(err => {
      console.warn('error occur', err)
    })
  }
  // 获取永久动态二维码方法
  this.getMaterials = (options) => {
    return getAccessToken(this.appId, this.appSecret).then(access_token => {
      return getMaterials(options, access_token)
    }).catch(err => {
      console.warn('error occur', err)
    })
  }
  // 获取 express 的中间件
  this.express = () => {
    return (req, res, next) => {
      if (req.path.indexOf(this.route) !== 0) {
        console.log('not found', req.path, this.route)
        next()
      } 
      switch (req.method) {
        case 'GET': validator(req, res, this.token); break;
        case 'POST': notifier(req, res, this); break;
        default: next();
      }
    }
  }
}

module.exports = WechatModule
