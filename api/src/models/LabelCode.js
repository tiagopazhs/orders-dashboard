const mongoose = require('mongoose');

const LabelCode = mongoose.model('LabelCode', {
    campoCod: Number,
    campoDesc1: String,
    campoDesc2: String,
})

module.exports = LabelCode