var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// 数据库,monk链接数据库
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/nodetest2');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup,set方法用于指定变量的值
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态文件夹作为顶层结构
app.use(express.static(path.join(__dirname, 'public')));

//使我们的数据库可以连接路由,放到(/,index)前
//连接数据库到路由件。抛出错误以后，后面的中间件将不再执行，直到发现一个错误处理函数为止。
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', index); // (某路径，对应某中间件)
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(3000); 默认是监听3000端口
// set方法用于设定内部变量，use方法用于调用express的中间件
module.exports = app; // 导出app对象
