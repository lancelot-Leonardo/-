const jwt = require('jsonwebtoken');
const express = require('express');
const secret = require('../db/server.json').listServer.secret;
function tokenTest(req,res,next) {
    jwt.verify(req.header('token'), secret, (err) =>{
        if(err) {
            console.log(err);
            res.status(200).json({
                code: 401,
                message: '无效的token'
            });
            return;
        }else {
            next();
        };
    });
};
module.exports = tokenTest;