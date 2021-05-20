/**
 * 提供最基础的接口-数据库关联服务
 */
const logger = require('./../../utils/logger')
const { smartValidator } = require('./../../utils/object')
const responseUtil = require('./../../utils/response')
const CODE_SERVER_ERROR = 500
const { 
  SUCCESS_DATA_INSERTED,
  ERROR_DATA_INSERTED,
  WARNING_NO_DATA_FOUND,
  SUCCESS_DATA_UPDATED,
  SUCCESS_LIST_READ,
  ERROR_LIST_READ,
  SUCCESS_DATA_READ,
  ERROR_DATA_DELETED,
  SUCCESS_DATA_DELETED
} = require('../../const')

/**
 * 生成通用的服务的中间件
 * @param {Model} model 
 * @param {Array} requiredArray 必填项列表  { key: '字段中文名', value: '字段名' }
 */
const baseServiceMiddleware = (model, requiredArray) => {
  return {
    addItem (req, res, next) {
      let resData = null
      const item = req.body
      console.log('RequestData', res, req, res.body)
      const test = Array.isArray(requiredArray) ? smartValidator(item, requiredArray) : null
      if (test) {
        logger.error(test)
        responseUtil.sendResponse(res, { msg: test, result: 1, data: -1 })
        return
      }
      model.create(item)
        .then(data => {
          logger.info('成功添加一个记录')
          // 当回调信息传入的值为字符串时，对应的情况是添加对象缺少重要参数或为空
          resData = responseUtil.getResponseBundle({
            msg: SUCCESS_DATA_INSERTED,
            data: data.dataValues
          })
          responseUtil.sendResponse(res, resData);
        }).catch(err => {
          logger.error('插入记录失败，错误信息如下：');
          logger.error(err);
          resData = {
            msg: ERROR_DATA_INSERTED,
            data: err,
            result: 1
          }
          responseUtil.sendResponse(res, resData, CODE_SERVER_ERROR)
        })
    },
    updateItem (req, res, next) {
      let bundle = {
        id: req.params.id,
        ...req.body
      }
      let resData = null
      model.update(bundle).then(data => {
        resData = responseUtil.getResponseBundle({
          msg: data[0] === 0 ? WARNING_NO_DATA_FOUND : SUCCESS_DATA_UPDATED,
          data: data[0]
        })
        responseUtil.sendResponse(res, resData)
      }).catch(err => {
        resData = { msg: ERROR_DATA_UPDATED, data: err, result: 1 }
        responseUtil.sendResponse(res, resData, CODE_SERVER_ERROR)
      })
    },
    getList (req, res, next) {
      const { query } = req
      model.list(query).then(data => {
        let resData = responseUtil.getResponseBundle({
          msg: SUCCESS_LIST_READ,
          data
        })
        responseUtil.sendResponse(res, resData)
      }).catch(err => {
        let resData = { msg: ERROR_LIST_READ, data: err, result: 1 }
        responseUtil.sendResponse(res, resData, CODE_SERVER_ERROR)
      })
    },
    getItem (req, res, next) {
      const { id } = req.params
      model.detail(id).then(data => {
        let msg = (data === null) ? WARNING_NO_DATA_FOUND : SUCCESS_DATA_READ
        let resData = responseUtil.getResponseBundle({ msg, data })
        responseUtil.sendResponse(res, resData, 200)
      }).catch(err => {
        let resData = responseUtil.getResponseBundle({
          msg: responseUtil.ERROR_DATA_READ,
          data: err,
          result: 0
        })
        responseUtil.sendResponse(res, resData, CODE_SERVER_ERROR)
      })
    },
    deleteItem (req, res, next) {
      const { id } = req.params
      let resData = null;
      model.del(id).then(rowsDeleted => {
        resData = responseUtil.getResponseBundle({
          msg: rowsDeleted ? SUCCESS_DATA_DELETED : WARNING_NO_DATA_FOUND,
          data: rowsDeleted
        })
        responseUtil.sendResponse(res, resData)
      }).catch((err) => {
        let resData = responseUtil.getResponseBundle({
          msg: ERROR_DATA_DELETED,
          data: err
        })
        responseUtil.sendResponse(res, resData, CODE_SERVER_ERROR)
      })
    },
    getNumber (req, res, next) {
      const { query } = req
      model.count(query).then(data => {
        let resData = responseUtil.getResponseBundle({ msg: SUCCESS_LIST_READ, data })
        responseUtil.sendResponse(res, resData)
      }).catch(err => {
        let resData = { msg: ERROR_LIST_READ, data: err, result: 1 }
        responseUtil.sendResponse(res, resData, CODE_SERVER_ERROR)
      })
    } 
  }
}

module.exports = baseServiceMiddleware
