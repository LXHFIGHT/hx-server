/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const service = require('./../services/materials')
const { sendResponse, getResponseBundle } = require('../../../utils/response')

module.exports = function (req, res, next) {
  const { path, method, query } = req
  console.log(path, method, query)
  if (path.includes('/materials') && method === 'GET') {
    service.getMaterials(query).then(data => {
      const result = getResponseBundle({ data })
      console.log('Success', result)
      sendResponse(res, result)
    }).catch(err => {
      const data = getResponseBundle({ msg: err, result: -1 })
      sendResponse(res, data)
    })
  } else {
    next()
  }
}