const mongoose = require('mongoose');

const LabelHis = mongoose.model('LabelHis', {
    usuario: String,
    data: String,
    horario: String,
    quantidade: Number,
    campoCod: Number,
    campoDesc1: String,
    campoDesc2: String,
})

module.exports = LabelHis