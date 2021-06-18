/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
var createError = require('http-errors')
var express = require('express')
const cors = require('cors')
let ejs = require('ejs')
var path = require('path')
var cookieParser = require('cookie-parser')
const xmlparser = require('express-xml-bodyparser')
var logger = require('morgan')
const { server } = require('./config')
const wechat = require('./app/modules/wechat') // 如果需要引入微信模块，生成一个微信的实例并引用
const loggerHelper = require('./utils/logger')
const indexRouter = require('./app/routes/index')
/** 可使用 npm run createModule 快速添加模块 */
const parkRouter = require('./app/routes/park')

const app = express()
// multipart/formData 请求方式 使用 multer插件，使用介绍：https://github.com/expressjs/multer
// application/xml 或 raw为xml 格式数据 使用 raw-body 模块，使用介绍：https://github.com/stream-utils/raw-body#examples

// view engine setup
app.engine('.html', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: server.accessControlAllowOrigin
}))
app.use(cookieParser())
app.use(xmlparser())
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter)
app.use(wechat.express()) // 如果需要引入微信模块，需要使用此中间件
// app.use('/users', userRouter)
/** 可使用 npm run createModule 快速引用模块 */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  if (err) {
    loggerHelper.error(err)
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
