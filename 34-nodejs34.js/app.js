var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const md5 = require('md5');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(path.join(__dirname, 'db/server.json'));
const dbObj = lowdb(adapter);
const { ip, port, name } = dbObj.get('listServer').value();

var apiRouter = require('./routes/api/api');
var WebRouter = require('./routes/web/web');

// 引入数据库集合操作对象

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'sid',    //cookie的键名
  secret: 'black',   //签名或者说是密钥,和cookie的值混一块，但是cookie原值还是保持连接的，服务器用正则来分析判断，相对于多了一点安全性
  saveUninitialized: false, //决定绑定的路由规则被请求是否会自动创建一个cookie和session，注意session有了的话不会再次被创建或刷新
  resave: true,    //是否再每次请求重新保存session，一般用于刷新session自动销毁剩余时间
  store: MongoStore.create({ mongoUrl: `mongodb://${ip}:${port}/${name}` }),    //数据库连接配置，你只需要关注要连接哪个填哪个url。还有别问为什么要用其他包的方法，问就是历史遗留没啥逻辑
  cookie: {
    httpOnly: true,  // 是否能被前端访问
    maxAge: 1000 * 60 * 10,  // cookie的自动销毁时间
    sameSite: 'lax'
  }
}));

app.use('/api', apiRouter);
app.use('/', WebRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.render('error.ejs');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
