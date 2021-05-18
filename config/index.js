/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const redisConf = require('./database/redis')
const mysqlConf = require('./database/mysql')
module.exports = {
  axiosTimeout: 24000, // axios请求超时上限 单位：毫秒
  redisConfig: { // redis 内存型数据库相关配置
    enable: 0, // 是否启用
    ...redisConf
  },
  mysqlConfig: { // mysql关系型数据库相关配置
    enable: 0, // 是否启用
    ...mysqlConf
  },
}