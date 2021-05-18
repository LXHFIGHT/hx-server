/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const WechatModule = require('./../../modules/wechat')
const wechatConfig = require('./../../config/wechat')
const parks = require('./../../data/parks')
const wechat = new WechatModule({
  ...wechatConfig,
  scanEventResponse: (eventkey) => {
    const match = parks.filter(v => eventkey.includes(v.scene_id))[0]
    return { // 图文消息
      type: 'news',
      articles: [{
        title: `点我一键停车缴费`,
        description: `您当前所在停车场是${match.park_name}`,
        picUrl: `https://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/img-wepay-logo.jpg`,
        url: match.url
      }]
    }
    // return { // 图文消息
    //   type: 'image',
    //   madiaId: 'gnK73KMa6bPXon5zXg56oYt_RmBlSDYQOGF62mHD3WU'
    // }
  }
})
module.exports = wechat
