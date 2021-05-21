/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
/**
 * Created by LXHFIGHT on 2019/4/8
 * Email: lxhfight1@gmail.com
 * Description:
 *  用于处理请求对象的相关内容
 */
const { mysql } = require('./../config')
let excludeParams = ['page', 'pagesize', 'maxsize', 'order']   // 不列入合并搜索的字段名
const logger = require('./logger')
const { Op } = require('sequelize')

/**
 * 根据请求参数获取Sequelize搜索条件对象
 * @param query
 * @returns {{where: {}, offset: (number|*), limit: *}}
 */
const getSearchBundle = (query) => {
  if (!query) {
    return {}
  }
  let { pagesize, page } = query, offset, limit, order;
  pagesize = (pagesize) ? (parseInt(pagesize)) : 20
  page = page || 1
  offset = pagesize * (page - 1)
  limit = pagesize
  let where = {} // 搜索条件对象
  const _getOrder = (order) => {
    let result = []
    if (Array.isArray(order)) {
      for(let item of order) {
        if (typeof item === 'object') {
          result.push([item.key, item.type ? item.type : 'ASC'])
        } else if (typeof item === 'string') {
          result.push([item, 'ASC'])
        }
      }
    } else {
      result = [[mysql.defineOptions.createdAt, 'DESC']]
    }
    return result
  }
  for(let p in query){
    if (!excludeParams.includes(p)) {
      if (!((query[p] === '') || (query[p] === null ))) {
        if (!isNaN(parseFloat(query[p])) || p === 'id') {
          where[p] = query[p];
        } else {
          where[p] = {
            [Op.like]: `%${query[p]}%`
          };
        }
      } else {
        console.log('request.js getSearchBundle func:  the param ' + p + ' is empty');
      }
    }
  }
  order = _getOrder(query.order)
  const bundle = { where,  order,  offset, limit }
  logger.warn(bundle)
  return bundle
}

/**
 * 请求指定URL 并返回一个Promise对象， 获取对应的内容
 * @param {string} url 请求的url
 * @param {Boolean} isJSON 响应内容是否为JSON，默认为 false 不是
 * @return {Promise} 
 */
const requestUrl = (url, isJSON = false) => {
  let data = ''
  let requestModule = null
  let req = null
  if (url.indexOf('https') === 0) {
    requestModule = require('https')
  } else {
    requestModule = require('http')
  }
  return new Promise((resolve, reject) => {
    req = requestModule.get(url, (httpsRes) => {
      httpsRes.setEncoding('utf8')
      httpsRes.on('data', (chunk) => {
        data += chunk
      })
      httpsRes.on('end', () => {
        try {
          const result = isJSON ? JSON.parse(data) : data
          resolve(result)
        } catch (err) {
          console.warn('RequestURL 获取数据无法JSON解析', err)
          resolve(data)
        }
      })
    })
    req.on('error', (err) => {
      LogHelper.error('访问路径： ' + url + ' 获取参数失败')
      LogHelper.error(err)
      reject(err)
    })
    req.end()
  })
}

module.exports = {
  getSearchBundle,
  requestUrl
}
