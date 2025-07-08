var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const listModel = require('../../models/list');
const usersModel = require('../../models/users');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const tokenTest = require('../../middlewares/tokenTest');
const secret = require('../../db/server.json').listServer.secret;

/* GET home page. */
// 日志数据
/* const dayRecord = {
  arr: []
} */
// L爆了，肯定要写json文件里面，这一刷新就没了

// 中间件声明
const formGet = express.urlencoded({ extended: false });

// 路由规则及其路由处理函数

router.post('/', tokenTest,formGet, async function (req, res) {
  try {
    const data = await usersModel.findOne({ username: req.session.username });
    const { task, time, type, amount, note } = req.body;
    if (!(typeof task === 'string' &&
      typeof time === 'string' &&
      typeof type !== 'undefined' &&
      typeof amount === 'string' &&
      typeof note === 'string')) {
      return res.status(400).json({
        code: 400,
        message: 'Bad request'
      });
    };
    await listModel.create({
      userId: data._id,
      task,
      time,
      type: type === 'true' ? true : false,
      amount: Number(amount),
      note
    });
    res.status(200).json({
      code: 201,
      message: 'Created'
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      code: 500,
      message: 'Internal Server Error'
    });
  };
});
router.delete('/:id',tokenTest, async (req, res) => {
  try {
    const userDoc = await usersModel.findOne({ username: req.session.username });
    if (!userDoc) {
      return res.status(200).json({
        code: 401,
        message: 'Unauthorized'
      });
    };
    const deleteResult = await listModel.deleteOne({ userId: userDoc._id, _id: req.params.id });
    if (deleteResult.deletedCount == 0) {
      return res.status(200).json({
        code: 404,
        message: 'Not Found'
      });
    };
    res.status(200).json({
      code: 204,
      message: 'No Content'
    });
  } catch (err) {
    res.status(500).json({
      "code": 500,
      "message": 'Internal Server Error'
    });
  };
});
// 以下是不一定有用的部分
router.get('/:id', tokenTest, async (req, res) => {
  try {
    const userDoc = await usersModel.findOne({ username: req.session.username });
    if (!userDoc) {
      return res.status(200).json({
        code: 401,
        message: 'Unauthorized'
      });
    };
    const findResult = await listModel.findOne({ userId: userDoc._id, _id: req.params.id });
    if (!findResult) {
      return res.status(200).json({
        code: 404,
        message: 'Not Found'
      });
    };
    res.status(200).json({
      code: 200,
      message: 'Found',
      data: findResult
    });
  } catch (err) {
    res.status(500).json({
      "code": 500,
      "message": 'Internal Server Error'
    });
  };
});
/* router.patch('/:id', async(req, res) => {
  try {
    const userDoc = await usersModel.findOne({ username: req.session.username });
    if (!userDoc) {
      return res.status(200).json({
        code: 401,
        message: 'Unauthorized'
      });
    };
    const Result = await listModel.deleteOne({ userId: userDoc._id, _id: req.params.id });
    if (deleteResult.deletedCount == 0) {
      return res.status(200).json({
        code: 404,
        message: 'Not Found'
      });
    };
    res.status(200).json({
      code: 204,
      message: 'No Content'
    });
  } catch (err) {
    res.status(500).json({
      "code": 500,
      "message": 'Internal Server Error'
    });
  };
}); */
router.post('/reg', (req, res) => {
  const { username, password } = req.body;
  usersModel.findOne({ username }).then(data => {
    if (data) {
      res.status(200).json({
        code: 409,
        message: '用户名已存在',
      });
      return;
    } else {
      usersModel.create({
        username,
        password: md5(password)
      }).then(doc => {
        console.log(doc);
        res.status(200).json({
          code: 201,
          message: '注册成功'
        });
      });
    };
  }).catch(err => {
    res.status(500).json({
      code: 500,
      message: '服务器异常'
    });
  });
});
router.post('/log', (req, res) => {
  const { username, password } = req.body;
  usersModel.findOne({ username }).then(data => {
    if (data && data.password == md5(password)) {
      const token = jwt.sign({ username }, secret, {expiresIn: 60 * 10});
      req.session.username = username;
      res.status(200).json({
        code: 200,
        message: '登录成功',
        token
      });
    } else {
      res.status(200).json({
        code: 401,
        message: '用户名或密码错误'
      });
    };
  }).catch(err => {
    res.status(500).json({
      code: 500,
      message: '服务器异常'
    });
  });
});
router.post('/logout',(req,res) =>{
  console.log('进路由了');
  res.clearCookie('sid');
  req.session.destroy(() =>{
    res.status(200).json({
      code: 200,
      message: '登出成功'
    });
  });
});
module.exports = router;
