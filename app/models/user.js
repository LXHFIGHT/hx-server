/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const Sequelize = require('sequelize')
const dbManager = require('../../core/db')
const sequelizeMiddleware = require('../../core/middlewares/sequelizeMiddleware')
const chartName = 't_users'

const model = dbManager.define(chartName, {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  openId: {
    type: Sequelize.STRING(255),
    field: 'open_id'
  },
  nickname: {
    type: Sequelize.STRING(255),
    defaultValue: '匿名'
  },
  gender: {
    type: Sequelize.INTEGER
  },
  avatarUrl: {
    type: Sequelize.TEXT,
    field: 'avatar_url'
  },
  city: {
    type: Sequelize.STRING(50)
  }
})

const detail = (id) => { return sequelizeMiddleware.findById(model, id) }
const create = (item) => { return sequelizeMiddleware.create(model, item)}
const update = (item) => { return sequelizeMiddleware.update(model, item)}
const count = (query) => { return sequelizeMiddleware.count(model, query)}
const list = (query, options) => { return sequelizeMiddleware.list(model, query, options)}
const del = (id) => { return sequelizeMiddleware.del(model, id)}

module.exports = { 
  detail,
  create,
  update,
  count,
  list,
  del
}
