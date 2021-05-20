/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const { MB_SIZE } = require('../const')
const log4js = require('log4js')
let type = 'dateFile',
  absolute = true,
  filename =  (process.env.NODE_ENV ? './../log/' :  'log/node-server/'),
  maxLogSize = MB_SIZE

const _getAppenderOption = (level) => {
  return {
    type,
    absolute,
    filename: `${filename}${level}/log`,
    maxLogSize,
    keepFileExt: true,
    alwaysIncludePattern: true,
    pattern: '.yyyy-MM-dd',
    backups: 3,
    daysToKeep: 7
  }
}
const _getLevelFilter = (level) => {
  return {
    type: 'logLevelFilter',
    appender: `${level}Mode`,
    level,
    maxLevel: level
  }
}
log4js.configure({
  appenders: {
    development: {
      type: 'console'
    },
    // DEBUG 级别日志
    warnMode: _getAppenderOption('warn'),
    justWarns: _getLevelFilter('warn'),
    // DEBUG 级别日志
    errorMode: _getAppenderOption('error'),
    justErrors: _getLevelFilter('error'),
    // DEBUG 级别日志
    fatalMode: _getAppenderOption('fatal'),
    justFatals: _getLevelFilter('fatal')
  },
  categories: { 
    default: { appenders: ['development'], level: 'debug' },
    traceLogger: { appenders: ['development'], level: 'trace' },
    infoLogger: { appenders: ['development'], level: 'info' },
    debugLogger: { appenders: ['development'], level: 'debug' },
    warnLogger: { appenders: ['development', 'justWarns'], level: 'warn' },
    errorLogger: { appenders: ['development', 'justErrors'], level: 'error' },
    fatalLogger: { appenders: ['development', 'justFatals'], level: 'fatal' }
  },
  replaceConsole: true // 将所有console输出到日志中 以 [INFO] console 代替 console 默认样式
})

let traceLogger = log4js.getLogger('traceLogger')
let debugLogger = log4js.getLogger('debugLogger')
let infoLogger  = log4js.getLogger('infoLogger')
let warnLogger  = log4js.getLogger('warnLogger')
let errorLogger = log4js.getLogger('errorLogger')
let fatalLogger = log4js.getLogger('fatalLogger')

//  兼容老版本 LogHelper
const log = (obj) => { debugLogger.debug(obj) }
//  兼容老版本 LogHelper
const trace = (obj) => { traceLogger.trace(obj) }
const debug = (obj) => { debugLogger.debug(obj) }
const info = (obj) => { infoLogger.info(obj) }
const warn = (obj) => { warnLogger.warn(obj) }
const error = (obj) => { errorLogger.error(obj) }
const fatal = (obj) => { fatalLogger.fatal(obj) }

module.exports = {
  log, trace, debug, info, warn, error, fatal
}
