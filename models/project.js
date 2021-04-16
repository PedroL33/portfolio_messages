const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: {type: String},
  summary: {type: String},
  tech: [String],
  gitLink: {type: String},
  liveLink: { type: String},
  thumbImg: {type: String},
  modalImg: {type: String}
})

module.exports = mongoose.model('Project', ProjectSchema)