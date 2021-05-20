/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const env = process.env.NODE_ENV || 'dev'
console.log('Current Env', env)
const configs = require(`./config.${env}`)
module.exports = configs
