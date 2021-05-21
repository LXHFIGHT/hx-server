/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 * @Description  : 一键映射 数据模型 -> 服务 -> 数据库 -> 接口 -> 路由脚本
 */
const chalk = require('chalk')
const readline = require('readline')
const fs = require('fs')
const path = require('path')
const { mysql } = require('./../../config/index')

const inputBundle = {
  name: '', // 请输入资源名（将以此命名相关文件、路由和对应的表名）
  chartName: '', // 请输入映射的数据表表名
  attrNames: '' // 请输入表中所有字段，用 “,” 进行连接
}

const jobs = () => {
  return [{
    from: path.join(__dirname, 'templates/model.txt'),
    to: path.join(__dirname, `./../../app/models/${inputBundle.name}.js`)
  }, {
    from: path.join(__dirname, 'templates/route.txt'),
    to: path.join(__dirname, `./../../app/routes/${inputBundle.name}.js`)
  }, {
    from: path.join(__dirname, 'templates/service.txt'),
    to: path.join(__dirname, `./../../app/services/${inputBundle.name}.js`)
  }]
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let createQuestionsBundle = (question, isOver = false) => {
  return new Promise((resolve, reject) => {
    const _doQuestion = (question) => {
      rl.question(question, (answer) => {
        if (answer === '') {
          console.log(`${chalk.red('当前输入项不能为空，请重新输入')}`)
          _doQuestion(question)
          return
        }
        resolve(answer)
        isOver && rl.close()
      })
    }
    _doQuestion(question)
  })
}

// 初始化命令行
const _initReadline = () => {
  createQuestionsBundle(`${chalk.bold('请输入资源名')}${chalk.blue('(将以此命名相关文件、路由和对应的表名)')} :`).then(name => {
    inputBundle.name = name
    return createQuestionsBundle(`${chalk.bold('请输入映射的数据表表名')}${chalk.blue('(对应数据库中真实的数据表名)')} :`)
  }).then(chartName => {
    inputBundle.chartName = chartName
    return createQuestionsBundle(`${chalk.bold('请输入表中所有字段')}${chalk.bold.red('(注意使用 “,” 进行连接)')} :`, true)
  }).then(attrNames => {
    inputBundle.attrNames = attrNames
    let isFileExsit = jobs().filter(v => fs.existsSync(v.to))[0]
    if (!!isFileExsit) {
      console.log(`请再次确认 ${chalk.red('apps/models')}, ${chalk.red('apps/routes')}, ${chalk.red('apps/services')}, 不会存在 ${chalk.red(inputBundle.name + '.js')} 文件`)
      rl.close()
      return
    }
    const promises = jobs().map(v => _processBundle(v))
    Promise.all(promises).then(res => {
      console.log(`🐰🐰 😊😊 ${chalk.black.bgGreen(' 成功 ')} 已生成 ${chalk.green(inputBundle.name + '模块')} 关联所有文件`)
      _editAppJS()
      console.log(`🐰🐰 😊😊 ${chalk.black.bgGreen(' 成功 ')} 已更新 ${chalk.green('app.js')} 文件`)
      rl.close()
    })
  })
}

const _processBundle = (bundle) => {
  return new Promise ((resolve, reject) => {
    let text = fs.readFileSync(bundle.from, { encoding: 'utf8' })
    let attrNames = ``
    let attrNameArray = inputBundle.attrNames.split(',')
    for (let i = 0; i < attrNameArray.length; i++) {
      if (i === attrNameArray.length - 1) {
        attrNames += `${attrNameArray[i]}: { }`
      } else {
        attrNames += `${attrNameArray[i]}: { }, 
  ` // 请勿注释本行
      }
    } 
    let defineOptions = ''
    let defineOptionsKeys = Object.keys(mysql.defineOptions)
    for (let j = 0; j < defineOptionsKeys.length; j++) {
      const t = typeof mysql.defineOptions[defineOptionsKeys[j]] === 'string' ? `'${mysql.defineOptions[defineOptionsKeys[j]]}'` : mysql.defineOptions[defineOptionsKeys[j]]
      if (j ===  defineOptionsKeys.length - 1) {
        defineOptions += `${defineOptionsKeys[j]}: ${t}`
      } else {
        defineOptions += `${defineOptionsKeys[j]}: ${t},
  ` // 请勿注释本行
      }
    } 
    console.log(mysql.defineOptions, '  ', defineOptions)
    text = text.replace('{{chartName}}', inputBundle.chartName)
    text = text.replace('{{name}}', inputBundle.name)
    text = text.replace('{{attrNameArray}}', attrNames)
    text = text.replace('{{defineOptions}}', defineOptions)
    try {
      fs.appendFileSync(bundle.to, text, 'utf8')
      console.log(`🐰🐰 😊😊 ${chalk.black.bgGreen(' 成功 ')} 生成 ${chalk.green(inputBundle.name + '模块')} 关联文件： ${bundle.to}`)
      resolve(bundle.to)
    } catch (err) {
      console.log(`读写 ${ bundle.to } 文件出错：${chalk.red(err)}`);
      reject(err)
    }
  })
}

// 用于修改app.js文件
const _editAppJS = () => {
  const appPath = path.join(__dirname, `./../../app.js`)
  let text = fs.readFileSync(appPath, { encoding: 'utf8' })
  // const userRouter = require('./app/routes/user')
  if (!text.includes(`'./app/routes/${inputBundle.name}'`)) {
    text = text.replace('/** 可使用 npm run createModule 快速添加模块 */', `/** 可使用 npm run createModule 快速添加模块 */
const ${inputBundle.name}Router = require('./app/routes/${inputBundle.name}')`) // 请勿修改对齐
  }
  if (!text.includes(`app.use('/${inputBundle.name}s'`)) {
    text = text.replace('/** 可使用 npm run createModule 快速引用模块 */', `/** 可使用 npm run createModule 快速引用模块 */
app.use('/${inputBundle.name}s', ${inputBundle.name}Router)`) // 请勿修改对齐
  }
  fs.writeFileSync(appPath, text, 'utf8')
}

_initReadline()
