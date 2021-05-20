
/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : 注意：测试环境配置基本依据开发环境，如果需要作区分则自行添加配置
 */
const devConfig = require('./config.dev')

const config = Object.assign({}, devConfig, {
  wechat: { // 微信模块相关配置
    appId: 'wxd04fa3945d36e950', // 公众号APPID
    appSecret: 'b488eb469e80ee430bb471cd46e8504a', // 公众号appSecret
    token: 'daqi_tech' // 服务号Token
  }
})

module.exports = config
