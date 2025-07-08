const mongoose = require('mongoose');

const rule = new mongoose.Schema({
    userId: {
        required: true,
        type: String
    },
    task: {
        required: true,
        type: String,
    },
    time: {
        required: true,
        type: String,
    },
    type: {
        required: true,
        type: String,
    },
    amount: {
        required: true,
        type: Number,
    },
    note: {
        required: true,
        type: String,
    }
});
const listModel = mongoose.model('lists',rule);
module.exports = listModel;