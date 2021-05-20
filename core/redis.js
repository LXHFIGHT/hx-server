/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : Redis 数据库客户端对象
 */

let redis = require('redis');
let { redis: redisConfig } = require('../config');
let logger = require('./../utils/logger');

module.exports = (function () {
  let client = null
  return function () {
    if (!client) {
      client = redis.createClient(
        redisConfig.port,
        redisConfig.host,
        redisConfig.options
      )
      client.auth(redisConfig.password, () => {
        console.log('>>> redis database connect authorized')
      })
      client.on('connect', () => {
          console.log('ooo redis database connect complete')
      })
      client.on('ready', (err) => {
          if (err) {
            console.error('Error', err)
          }
          console.log('√√√ redis database ready to edit')
      })
      // 监听错误信息
      client.on('error', (err) => {
          logger.error(err.stack)
      })
    }
    return client
  }
})()
