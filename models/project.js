const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    title: {type: String},
    tech: {type: Array}
})

module.exports = mongoose.model('Project', ProjectSchema)