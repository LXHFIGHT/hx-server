/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : 
 */
const getPassiveResponseText = (xml, query) => {
  const eventkey = xml.eventkey[0]
  // 注意，首次关注时的eventKey是 qrscene_XXXX，而关注后扫码 是 XXX 
  const match = parks.filter(v => eventkey.includes(v.scene_id))[0]
  if (!match) {
    return
  }
  let obj = {
    ToUserName: query.openid,
    FromUserName: xml.tousername,
    MsgType: 'news'
  }
  const responseText = `<xml>
    <ToUserName><![CDATA[${query.openid}]]></ToUserName>
    <FromUserName><![CDATA[${xml.tousername}]]></FromUserName>
    <CreateTime>${parseInt(Date.now() / 1000)}</CreateTime>
    <MsgType><![CDATA[news]]></MsgType>
    <ArticleCount>1</ArticleCount>
    <Articles>
      <item>
        <Title><![CDATA[点我一键停车缴费]]></Title>
        <Description><![CDATA[您当前所在停车场是${match.park_name}]]></Description>
        <PicUrl><![CDATA[https://lxh-static.oss-cn-shenzhen.aliyuncs.com/img/img-wepay-logo.jpg]]></PicUrl>
        <Url><![CDATA[${match.url}]]></Url>
      </item>
    </Articles>
  </xml>`
  return responseText
}