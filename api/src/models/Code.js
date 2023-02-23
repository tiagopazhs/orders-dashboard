const mongoose = require('mongoose');

const Code = mongoose.model('Code', {
    pedido: Number,
    item: String,
    ean: Number,
    serial: Number,
    verificado: Boolean,
})

module.exports = Code


