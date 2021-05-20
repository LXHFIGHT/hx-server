/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const WechatModule = require('./../../modules/wechat')
const { wechat: wechatConfig } = require('./../../config')
const parks = require('./../../data/parks')
const wechat = new WechatModule({
  ...wechatConfig,
  scanEventResponse: (eventkey) => {
    const match = parks.filter(v => eventkey.includes(v.scene_id))[0]
    if (match) {
      return ''
    }
    return { // 图文消息
      type: 'news',
      articles: [{
        title: `点我一键停车缴费`,
        description: `您当前所在停车场是${match.park_name}`,
        picUrl: `https://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/img-wepay-logo.jpg`,
        url: match.url
      }]
    }
  },
  subscribeEventResponse: {
    type: 'news',
    articles: [{
      title: `欢迎您关注本公众号`,
      description: `点击领取优惠加油权益`,
      picUrl: `https://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/img-wepay-hongbao.png`,
      url: 'https://life.cars.shengxintech.com/gasoline/home/?channel_id=1091'
    }]
  }
})
module.exports = wechat
