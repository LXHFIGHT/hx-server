
/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : 注意：测试环境配置基本依据开发环境，如果需要作区分则自行添加配置
 */
const devConfig = require('./config.dev')
const { combineObject } = require('./../utils/object')

const config = combineObject(devConfig, {
  wechat: { // 微信模块相关配置
    appId: '', // 公众号APPID
    appSecret: '', // 公众号appSecret
    token: '' // 服务号Token
  }
})

module.exports = config
