const mongoose = require('mongoose');
const path = require('path');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(path.join(__dirname,'server.json'));
const dbObj = lowdb(adapter);
const {ip,port,name} = dbObj.get('listServer').value();
const db = function(success,error) {
    mongoose.connect(`mongodb://${ip}:${port}/${name}`);
    mongoose.connection.on('open',() =>{
        success();
    });
    mongoose.connection.on('error',(err) =>{
        error(err);
    });
};
module.exports = db;