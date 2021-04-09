const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Username: {type: String},
    Password: {type: String}
})

module.exports = mongoose.model('User', UserSchema)