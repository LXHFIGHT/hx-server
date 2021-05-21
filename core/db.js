/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
/**
 * Created by LXHFIGHT on 2019/4/8
 * Email: lxhfight1@gmail.com
 * Description:
 *   A database manager of Sequelize
 */
const Sequelize = require('sequelize')
const { mysql: config } = require('./../config')
const sequelize = (function () {
  let instance
  return (function () {
    if (!instance) {
      instance = new Sequelize(
        config.database,
        config.username,
        config.password,
        config.options
      )
    }
    return instance
  }())
}())

module.exports = sequelize
