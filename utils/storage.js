/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : 缓存工具
 */

const NodeCache = require('node-cache')
const { ERROR_CACHE_STORAGE_FAILED } = require('./../config/const')
const { redisConfig } = require('./../config')

const storage = new NodeCache({ stdTTL: 0, checkperiod: 120, deleteOnExpire: false })

module.exports = {
  save (key, data) {
    return new Promise((resolve, reject) => {
      if (redisConfig.enable) {
        // redis 缓存逻辑于此
        return
      }
      let success = storage.set(key, data, 10000)
      success ? resolve(data) : reject(new Error(ERROR_CACHE_STORAGE_FAILED))
    })
  },
  get (key) {
    if (redisConfig.enable) {
      // redis 缓存逻辑于此
      return false
    }
    return storage.get(key)
  }
}
