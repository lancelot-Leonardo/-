const mongoose = require('mongoose');

const rule = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String
    }
});
const usersModel = mongoose.model('users',rule);
module.exports = usersModel;