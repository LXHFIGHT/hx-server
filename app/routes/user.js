/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const express = require('express')
const router = express.Router()
const service = require('../services/user')


router.get('/', service.getList)
router.get('/amount', service.getNumber)
router.get('/:id', service.getItem)
router.delete('/:id', service.deleteItem)
router.post('/', service.addItem)
router.put('/:id', service.updateItem)

module.exports = router
