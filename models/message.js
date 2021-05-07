const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    message: {type: String},
    name: {type: String},
    email: {type: String}
})

module.exports = mongoose.model('Message', MessageSchema)