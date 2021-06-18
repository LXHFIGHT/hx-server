
/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const commonConfig = require('./config.common')
const { combineObject } = require('./../utils/object')

const config = combineObject(commonConfig, {
  server: {
    accessControlAllowOrigin: '*', // 允许访问浏览器网页域名
    host: '', // 服务器hostname IP地址
    username: 'root', // 服务器用户名
    privateKey: '' // ssh 本机私钥，需要提前复制到远程服务器 ~/.ssh/authorize_keys文件中
  },
  aliyunOss: { // 阿里云对象存储
    region: '',  // TODO OSS对象区域
    accessKeyId: '', // TODO 阿里云账号的accessKey
    accessKeySecret: '', // TODO 阿里云账号的accessKeySecret
    bucket: '', // TODO 阿里云OSS对象存储桶名字
    endpoint: '' // TODO 阿里云OSS的终端域名  
  },
  qiniuOss: { // 七牛云对象存储
    ACCESS_KEY: '', // TODO 七牛云账号的accessKey
    SECRET_KEY: '', // TODO 七牛云账号的accessKeySecret
    bucket: '', // TODO 七牛云OSS对象存储桶名字
    prefix: 'http://*******.bkt.clouddn.com/' // TODO 七牛云OSS外链前缀【结尾记得带上"/"】
  },
  redis: { // redis 内存型数据库相关配置
    enable: 1, // 是否启用
    port: 6379,
    host: '127.0.0.1',
    password: 'test123123',
    options: {}
  },
  mysql: { // mysql关系型数据库相关配置
    enable: 1, // 是否启用
    database: 'daqitech', // TODO replace the real database name with {databaseName} here
    username: 'daqitech', // TODO replace the real user name with {userName} here
    password: 'Daqitech1234!', // TODO replace the real password with {password} here
    options: {
      host: '120.79.217.63', // hostname
      port: 3306, // port
      dialect: 'mysql', // database SQL dialect
      timezone: '+08:00', // database timezone ('+08:00 Beijing')
      pool: {
        max: 20, // the maximum connect amount of the database
        min: 0, // the minimum connect amount of the database
        idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
      }
    }
  },
  wechat: { // 微信模块相关配置
    appId: 'wxc2afc6b9c1ac00c8', // 公众号APPID
    appSecret: 'b28f80fc19185cb46a06978a845dd130', // 公众号appSecret
    token: 'daqi_tech_next' // 服务号Token
  }
})

module.exports = config
