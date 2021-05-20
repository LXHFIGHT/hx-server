
/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const commonConfig = require('./config.common')

const config = Object.assign({}, commonConfig, {
  server: {
    accessControlAllowOrigin: '*' // 允许访问浏览器网页域名
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
    password: '1rp1sPTUrAux7zJuXrrGKRTxxWgspWa6',
    options: {}
  },
  mysql: { // mysql关系型数据库相关配置
    enable: 0, // 是否启用
    database: '', // TODO replace the real database name with {databaseName} here
    username: 'root', // TODO replace the real user name with {userName} here
    password: '', // TODO replace the real password with {password} here
    options: {
      host: '', // hostname
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
    appId: '', // 公众号APPID
    appSecret: '', // 公众号appSecret
    token: '' // 服务号Token
  }
})

module.exports = config
