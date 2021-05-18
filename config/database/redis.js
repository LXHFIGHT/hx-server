/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const devConfig = {
  port: 6379,
  host: '127.0.0.1',
  password: '',
  options: {}
};

const prodConfig = {
  port: 6379,
  host: '127.0.0.1',
  password: '',
  options: {}
};

module.exports = process.env.NODE_ENV ? prodConfig : devConfig
