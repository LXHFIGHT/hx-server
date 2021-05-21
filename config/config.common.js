/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
module.exports = {
  projectName: '', // 项目名，用于提高辨识度如redis的键等等
  axiosTimeout: 24000, // axios请求超时上限 单位：毫秒
  SUCCESS_STATUS_CODE: 200, // 状态成功码
  FAIL_STATUS_CODE: 0, // 状态出错码
  mysql: {
    defineOptions: { // 定义 Sequelize 模型时通用的预置项
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
}
