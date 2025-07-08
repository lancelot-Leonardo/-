var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const listModel = require('../../models/list');
const usersModel = require('../../models/users');
const checkLogin = require('../../middlewares/checkLogin');

/* GET users listing. */
router.get('/', checkLogin, function (req, res, next) {
  usersModel.findOne({ username: req.session.username }).then(data => {
    return listModel.find({ userId: data._id });
  }).then(dataArr => {
    res.render('list', { title: '事项列表展示', dataArr });
  });
});
router.get('/add', checkLogin, function (req, res, next) {
    res.render('add.ejs', { title: '添加消费日志' });
});
router.get('/reg', (req, res) => {
  res.render('register.ejs');
});
router.get('/log', (req, res) => {
  res.render('login.ejs');
});

module.exports = router;