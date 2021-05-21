/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : Redis 数据库相关的工具
 */
let { redis: redisConfig, projectName } = require('../config');
let createRedisClient = require('../core/redis');
let logger = require('./logger');

if (!redisConfig.enable) { // 如果没有启用redis
  const _popTips = () => { logger.warn('请先将 config/index.js 中 redisConfig.enable 设为1，同时配置到redis的连接信息') }
  module.exports = {
    setItem: _popTips,
    getItem: _popTips,
    removeItem: _popTips
  }
} else {
  const client = createRedisClient()
  /**
   * 添加string类型的数据
   * @param key 键
   * @param value 值
   */
  const setItem = (key, value) => {
    return new Promise((resolve, reject) => {
      if (!value) {
        reject('value不能为空或其他非法值')
        return
      }
      const data = typeof value === 'object' ? JSON.stringify(value) : value
      client.set(`${projectName}-${key}`, data, (err, result) => {
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
  * @param isObject 是否为对象类型
  */
  const getItem = (key, isObject = false) => {
    return new Promise((resolve, reject) => {
      client.get(`${projectName}-${key}`, (err, result) => {
          if (err) {
              logger.error(err)
              reject(err)
              return
          }
          try {
            const data = isObject ? JSON.parse(result) : result
            resolve(data)
          } catch (errObj) {
            reject(errObj)
          }
      })
    })
  }
  /**
  * 移除对应的键
  * @param key 键
  */
  const removeItem = (key) => {
    return new Promise((resolve, reject) => {
      client.del(`${projectName}-${key}`, (err, result) => {
          if (err) {
              logger.error(err)
              reject(err)
              return
          }
          resolve(result)
      })
    })
  }
  module.exports = { setItem, getItem, removeItem };
}
