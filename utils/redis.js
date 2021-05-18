/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : Redis 数据库相关的工具
 */

let redis = require('redis');
let { redisConfig } = require('./../config');
let logger = require('./logger');
let db = {};

if (!redisConfig.enable) { // 如果没有启用redis
  module.exports = {
    set () {
      logger.warn('请先将 config/index.js 中 redisConfig.enable 设为1，同时配置到redis的连接信息')
    },
    get () {
      logger.warn('请先将 config/index.js 中 redisConfig.enable 设为1，同时配置到redis的连接信息')
    }
  }
  return
}

let client = redis.createClient(
  redisConfig.port,
  redisConfig.host,
  redisConfig.options
);

client.auth(redisConnInfo.RDS_PWD, () => {
    console.log('>>> redis database connect authorized')
})
client.on('connect', ()=>{
    console.log('ooo redis database connect complete')
})
client.on('ready', (err) => {
    console.log('√√√ redis database ready to edit')
})
// 监听错误信息
client.on('error', (err) => {
    logger.error(err.stack)
})

/**
 * 添加string类型的数据
 * @param key 键
 * @param value 值
 */
const setItem = (key, value) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, (err, result) => {
      if (err) {
          console.log(err)
          reject(err)
          return
      }
      resolve(result)
    })
  })
}

/**
* 获取string类型的数据
* @param key 键
*/
const getItem = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, result) => {
        if (err) {
            logger.error(err)
            reject(err)
            return
        }
        resolve(result)
    })
  })
}

const createSingleRedisDB = (function () {
  let db
  return function() {
    if (!db) {
      db = { set: setItem, get: getItem }
      return db
    }
  }
})()

module.exports = createSingleRedisDB;
