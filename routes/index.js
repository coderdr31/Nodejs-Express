var express = require('express');
var router = express.Router();

/* GET home page. */
// get方法(HTTP动词方法)用于指定不同的访问路径所对应的回调函数，这叫做“路由”（routing）。
// 中间件就是处理HTTP请求的函数，有传递给下一个中间件的作用。每个中间件可以从App实例，接收三个参数，依次为request对象（代表HTTP请求）、response对象（代表HTTP回应），next回调函数（代表下一个中间件,执行权）。每个中间件都可以对HTTP请求（request对象）进行加工，并且决定是否调用next方法，将request对象再传给下一个中间件。
// get方法表示处理客户端发出的GET请求,第二个参数是回调函数，它的req参数表示客户端发来的HTTP请求，res参数代表发向客户端的HTTP回应，这两个参数都是对象。

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
