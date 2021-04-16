var { check, validationResult } = require('express-validator');
var Project = require('../models/project');

exports.getProjects = (req, res) => {
  try {
    Project.find({}, (err, results) => {
      if(err) {
        return res.status(400).json({
          errors: "Something went wrong."
        })
      }else {
        return res.status(200).json(results)
      }
    })
  }catch(err) {
    console.log(err)
  }
}

exports.addProject = [
  check('title').exists().isLength({min: 4}).custom( (value, {req}) => {
    return Project.findOne({ title:value, _id:{ $ne: req.params.id } })
      .then( project => {
      if (project !== null) {
        return Promise.reject('Title already in use');
      }
    })
  }),
  check('summary').isLength({min:4}).withMessage("Include a summary."),
  check('gitLink').isURL().withMessage("Include git link."),
  check('liveLink').isURL().withMessage("Include live link."),
  (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      })
    }else {
      var project = new Project({
        title: req.body.title,
        summary: req.body.summary,
        gitLink: req.body.gitLink,
        liveLink: req.body.liveLink
      })
      project.save((err, result) => {
        if(err) {
          return res.status(400).json({
            errors: err
          })
        }else {
          return res.status(200).json({
            success: `${req.body.title} added.`
          })
        }
      })
    }
  }
]

exports.deleteProjects = (req, res) => {
  try {
    Project.deleteMany({
      _id: {
        $in: req.body.projects
      }
    })
    .then(result => {
      if(result.deletedCount==0) {
        return res.status(400).json({
          errors: "Projects could not be deleted."
        })
      }else {
        return res.status(200).json({
          success: `${result.deletedCount} projects deleted.`
        })
      }
    })
  }catch(err) {
    console.log(err)
  }
}

exports.editTitle = (req, res) => {

}

exports.editSummary = (req, res) => {

}

exports.addFeature = (req, res) => {

}

exports.removeFeature = (req, res) => {

}

exports.editGitLink = (req, res) => {

}

exports.editLiveLink = (req, res) => {

}
exports.addTech = (req, res) => {

}

exports.removeTech = (req, res) => {

}

exports.uploadPhoto = (req, res) => {

}