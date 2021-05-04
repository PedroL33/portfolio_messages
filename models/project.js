const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: {type: String},
  summary: {type: String},
  tech: [String],
  features: [{
    description: String,
    icon: String
  }],
  gitLink: {type: String},
  liveLink: { type: String},
  thumbImg: {type: String, default: "https://chatbucket11.s3-us-west-2.amazonaws.com/portfolio/noImage.jpg"},
  modalImg: {type: String, default: "https://chatbucket11.s3-us-west-2.amazonaws.com/portfolio/noImage.jpg"}
})

module.exports = mongoose.model('Project', ProjectSchema)