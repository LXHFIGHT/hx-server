/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const service = require('./../services/materials')
const { sendResponse, getResponseBundle } = require('../../../utils/response')

module.exports = function (req, res, next) {
  const { path, method, query } = req
  if (path.includes('/materials') && method === 'GET') {
    service.getMaterials(query).then(data => {
      const result = getResponseBundle({ data })
      sendResponse(res, result)
    }).catch(err => {
      const data = getResponseBundle({ msg: err, result: -1 })
      sendResponse(res, data)
    })
  } else {
    next()
  }
}