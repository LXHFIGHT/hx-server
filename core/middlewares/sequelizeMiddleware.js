const {
  SUCCESS_DATA_READ, 
  SUCCESS_DATA_INSERTED, 
  SUCCESS_DATA_UPDATED,
  SUCCESS_DATA_DELETED, 
  SUCCESS_LIST_READ 
} = require('../../const')
const logger = require('../../utils/logger')
const requestUtil = require('../../utils/request')

/**
 * 通用化findById方法
 */
const findById = (model, id) => {
  return new Promise((resolve, reject) => {
    model.findByPk(id)
      .then((data) => {
        logger.info(SUCCESS_DATA_READ)
        resolve(data)
      }).catch((err) => {
        logger.error(err)
        reject(err)
      })
  })
}

/**
 * 添加元素
 * @param model 数据模型
 * @param item 元素内容
 */
let create = (model, item) => {
  let bundle = model.build(item)
  return new Promise((resolve, reject) => {
    bundle
      .save()
      .then((data) => {
        logger.info(SUCCESS_DATA_INSERTED)
        resolve(data)
      })
      .catch((err) => {
        logger.error(err)
        reject(err.stack)
      })
  })
}


/**
 * 修改指定ID的元素
 * @param model 数据模型
 * @param item 元素内容
 */
const update = (model, item) => {
  return new Promise((resolve, reject) => {
    model.update(item, { where: { id: item.id } })
      .then((data) => {
        logger.info(`${SUCCESS_DATA_UPDATED}, update ${data} rows`)
        resolve(data)
      })
      .catch((err) => {
        logger.error(err)
        reject(err.stack)
      })
  })
}

/**
 * 获取符合查询条件的记录总数
 * @param {object} model 
 * @param {object} query 
 */
const count = (model, query) => {
  const searchInfo = requestUtil.getSearchBundle(query)
  return new Promise((resolve, reject) => {
    model.count(searchInfo)
      .then((result) => {
        logger.info(SUCCESS_LIST_READ)
        resolve(result)
      })
      .catch((err) => {
        logger.error(err)
        reject(err.stack)
      })
  })
}

/**
 * 获取指定查询条件下的元素列表
 * @param query 查询条件
 * @param {object} options 其他附加条件
 * @param {object} options.attributes.exclude 不查找某些字段
 */
const list = (model, query, options = {}) => {
  const pagesize = query.pagesize ? parseInt(query.pagesize) : 9999
  const page = query.page ? parseInt(query.page) : 1
  let searchBundle = Object.assign({}, 
    requestUtil.getSearchBundle({...query, page, pagesize}), 
    options)
  return new Promise((resolve, reject) => {
    model
      .findAndCountAll(searchBundle)
      .then((result) => {
        logger.info(SUCCESS_LIST_READ)
        const items = Array.isArray(result.rows) ? result.rows.map((v) => { return v.dataValues }) : []
        let data = {
          total: result.count,
          pageCount: Math.ceil(result.count / pagesize),
          items,
          currentPage: page,
          pagesize
        }
        resolve(data)
      })
      .catch((err) => {
        logger.error(err)
        reject(err.stack)
      })
  })
}

/**
 * 删除指定的元素
 * @param id 指定删除元素的唯一标识
 */
const del = (model, id) => {
  return new Promise((resolve, reject) => {
    model.destroy({ where: { id } })
      .then((rowsDeleted) => {
        logger.info(SUCCESS_DATA_DELETED)
        resolve(rowsDeleted)
      }).catch((err) => {
        logger.error(err)
        reject(err.stack)
      })
  })
}

module.exports = {
  findById, // 根据主键查找记录详情
  create, // 增
  update, // 改
  count, // 计算数量
  list, // 获取列表
  del // 删除对应主键的记录
}
