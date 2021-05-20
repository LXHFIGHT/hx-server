/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const { encryptStr } = require('../../../utils/object')
const logger = require('../../../utils/logger')

// 微信配置 服务器配置所需要 token 验证的方法
const checkSignature = (req, token) => {
  const { signature, timestamp, nonce, echostr } = req.query
  const arr = [token, timestamp, nonce].sort()
  const encryptData = encryptStr(arr.join(''), 'sha1')
  if (encryptData === signature) {
    return echostr
  } else {
    return false
  }
}

const getMsgBundle = (req, scanEventResponse) => {
  const { openid } = req.query
  const { xml } = req.body
  const eventkey = xml.eventkey ? xml.eventkey[0] : null
  const msg = typeof scanEventResponse === 'function'
    ? scanEventResponse(eventkey)
    : Object.assign({}, scanEventResponse) 
  let responseText = `<xml>
  <ToUserName><![CDATA[${openid}]]></ToUserName>
  <FromUserName><![CDATA[${xml.tousername}]]></FromUserName>
  <CreateTime>${parseInt(Date.now() / 1000)}</CreateTime>
  <MsgType><![CDATA[{{type}}]]></MsgType>
  {{contentText}}
  </xml>`
  responseText = responseText.replace('{{type}}', msg.type || 'news') // 替换消息类型文本
  let contentText = ''
  console.warn('MESSAGE', msg)
  if (msg.type === 'news' || !msg.type) {
    if (!Array.isArray(msg.articles)) {
      logger.warn('新闻消息主体的 articles 必须非空且为数组类型')
      return
    }
    contentText += `<ArticleCount>${msg.articles.length}</ArticleCount>
    <Articles>`
    for (let item of msg.articles) {
      contentText += `<item>
      <Title><![CDATA[${item.title}]]></Title>
      <Description><![CDATA[${item.description}]]></Description>
      <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
      <Url><![CDATA[${item.url}]]></Url>
    </item>`
    }
    contentText += `</Articles>`
  } else if (msg.type === 'text') {
    contentText += `<Content>${msg.content || ''}</Content>`
  } else if (msg.type === 'image') {
    !msg.mediaId && logger.warn('消息为图片类型时，素材ID msg.mediaId 不能为空')
    // 注意需要 图片要提前传到素材库
    contentText += `<Image><MediaId><![CDATA[${msg.mediaId}]]></MediaId></Image>`
  } else if (msg.type === 'voice') {
    !msg.mediaId && logger.warn('消息为语音音频类型时，素材ID msg.mediaId 不能为空')
    // 注意需要 语音要提前传到素材库
    contentText += `<Voice><MediaId><![CDATA[${msg.mediaId}]]></MediaId></Voice>`
  } else if (msg.type === 'video') {
    !msg.mediaId && logger.warn('消息为视频类型时，素材ID msg.mediaId 不能为空')
    // 注意需要 视频要提前传到素材库
    contentText += `<Video>
      <MediaId><![CDATA[${msg.mediaId}]]></MediaId>
      <Title><![CDATA[${msg.title || ''}]]></Title>
      <Description><![CDATA[${msg.description || ''}]]></Description>
    </Video>`
  } else if(msg.type === 'music') {
    contentText += `<Music>
      <Title><![CDATA[${msg.title || ''}]]></Title>
      <Description><![CDATA[${msg.description || ''}]]></Description>
      <MusicUrl><![CDATA[${msg.musicUrl || ''}]]></MusicUrl>
      <HQMusicUrl><![CDATA[${msg.hqMusicUrl || ''}]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[${msg.thumbMediaId || ''}]]></ThumbMediaId>
    </Music>`
  }
  responseText = responseText.replace('{{contentText}}', contentText)
  console.log('Sending Back', responseText)
  return responseText
}

module.exports = {
  checkSignature,
  getMsgBundle
}
