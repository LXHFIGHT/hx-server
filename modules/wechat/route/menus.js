/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const service = require('../services/menus')
const { sendResponse, getResponseBundle } = require('../../../utils/response')

module.exports = function (req, res, next) {
  const { path, method } = req
  if (path.includes('/menus') && method === 'GET') {
    service.getMenus().then(data => {
      sendResponse(res, getResponseBundle({ data }))
    }).catch(err => {
      sendResponse(res, getResponseBundle({ msg: err, result: -1 }))
    })
  } else {
    next()
  }
}