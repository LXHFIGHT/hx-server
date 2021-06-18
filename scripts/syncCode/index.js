/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */

const chalk = require('chalk')
const { NodeSSH } = require('node-ssh') 
const prodConfig = require('./../../config/config.prod')
const testConfig = require('./../../config/config.test')
const devConfig = require('./../../config/config.dev')

const _getEnvConfig = () => {
  const text = process.argv[2]
  if (text.includes('prod')) {
    return prodConfig
  } else if (text.includes('test')) {
    return testConfig
  } else {
    return devConfig
  }
}

const init = () => {
  const { server } = _getEnvConfig()
  const ssh = new NodeSSH()
  if (!server) {
    console.log(`${chalk.red('请确认对应环境配置文件中的server对象有内容')}`)
    return
  }
  if (!server.host || !server.username || !server.privateKey) {
    console.log(`请确保${chalk.red('server')}对象中 ${chalk.red('host')}、${chalk.red('username')}、${chalk.red('privateKey')}都不为空`)
    return
  }
  console.log('Server')
  ssh.connect({
    host: server.host,
    username: server.username,
    privateKey: server.privateKey
  }).then(() => {
    return ssh.exec('git pull', [], { 
      cwd: '', // 项目部署路径
      onStdout (chunk) {
        console.log('远程输出日志：', chunk.toString('utf8'))
      },
      onStderr (chunk) {
        console.log('远程打印错误：', chunk.toString('utf8'))
      }
    })
  }).then(() => {
    console.log('Console Terminated')
  }).catch(err => {
    console.log('ERROR', err)
  })
}
init()