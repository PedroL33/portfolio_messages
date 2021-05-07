var { check, validationResult } = require('express-validator');
var Project = require('../models/project');
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const multiparty = require('multiparty');

AWS.config.update({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey
});

const s3 = new AWS.S3();

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: 'chatbucket11',
    ContentType: type.mime,
    Key: `${name}.${type.ext}`,
  }
  return s3.upload(params).promise();
}

const deleteFile = (filename, cb) => {
  try {
    const key = filename.split("amazonaws.com/");
    if(key[1] && key[1] === "portfolio/noImage.jpg") {
      cb(null)
    }else {
      const params = {
        Bucket: 'chatbucket11',
        Key: key[1],
      }
      s3.deleteObject(params, (err, data) => {
        if(err) {
          cb(err)
        }else {
          cb(null)
        }
      });
    }
  }catch(err) {
    console.log(err)
  }
}

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
    try {
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
    }catch(err) {
      console.log(err)
    }
  }
]

exports.deleteProjects = (req, res) => {
  try {
    req.body.projects.map(id => {
      Project.find({_id: id}, (err, result) => {
        if(err) {
          return console.log(err)
        }
        deleteFile(result[0].thumbImg, err => {
          if(err) {
            return res.status(400).json({
              errors: err
            })
          }
        })
        deleteFile(result[0].modalImg, err => {
          if(err) {
            return res.status(400).json({
              errors: err
            })
          }
        })
        result[0].remove(err => {
          if(err) {
            return res.status(400).json({
              errors: "Projects could not be deleted."
            })
          }
        });
      })
    })
    return res.status(200).json({
      success: `Projects deleted.`
    })
  }catch(err) {
    console.log(err)
  }
}

exports.uploadThumbnail = (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    if(err) {
      return res.status(500).json(err)
    }
    try {
      const path = files.image[0].path;
      const buffer = fs.readFileSync(path);
      const type = await fileType.fromBuffer(buffer);
      const fileName = `portfolio/${Date.now().toString()}`;
      const data = await uploadFile(buffer, fileName, type);
      Project.findById(req.params.id, (err, project) => {
        if(err) return res.status(400).json(err)
        deleteFile(project.thumbImg, err => {
          if(err) return res.status(400).json({errors: err})
          project.thumbImg = data.Location
          project.save(err => {
            if(err) return res.status(400).json(err)
            return res.status(200).json({
              success: "Thumbnail image added."
            })
          })
        });
      })
    } catch(err) {
      return res.status(500).json({
        error: "Something went wrong."
      })
    }
  })
}

exports.uploadModal = (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    if(err) {
      return res.status(500).json(err)
    }
    try {
      const path = files.image[0].path;
      const buffer = fs.readFileSync(path);
      const type = await fileType.fromBuffer(buffer);
      const fileName = `portfolio/${Date.now().toString()}`;
      const data = await uploadFile(buffer, fileName, type);
      Project.findById(req.params.id, (err, project) => {
        if(err) return res.status(400).json(err)
        deleteFile(project.modalImg, err => {
          if(err) return res.status(400).json({
            errors: err
          })
          project.modalImg = data.Location
          project.save(err => {
            if(err) return res.status(400).json(err)
            return res.status(200).json({
              success: "Modal image added."
            })
          })
        });
      })
    } catch(err) {
      return res.status(400).json({
        error: "Something went wrong."
      })
    }
  })
}

exports.editProject = (req, res) => {
  try {
    Project.findById(req.params.id, (err, doc) => {
      if(err) return res.status(400).json({
        errors: "Server side error."
      })
      else {
        doc.title = req.body.title ? req.body.title: doc.title
        doc.summary = req.body.summary ? req.body.summary: doc.summary
        doc.gitLink = req.body.gitLink ? req.body.gitLink: doc.gitLink
        doc.liveLink = req.body.liveLink ? req.body.liveLink: doc.liveLink
        doc.save((err, result) => {
          if(err) {
            return res.status(400).json({
              errors: err.message
            })
          }else {
            return res.status(200).json({
              success: result
            })
          }
        })
      }
    })
  }catch(err) {
    return res.status(400).json({
      errors: err.message
    })
  }
}

exports.editTech = (req, res) => {
  try {
    Project.findById(req.params.id, (err, doc) => {
      if(err) {
        return res.status(400).json({
          errors: "Something went wrong on the server."
        })
      }
      doc.tech = req.body;
      doc.save((err, results) => {
        if(err) {
          return res.status(400).json({
            errors: err.message
          })
        }else {
          return res.status(200).json({
            success: results
          })
        }
      })
    })
  }catch(err) {
    return res.status(400).json({
      errors: err
    })
  }
}

exports.editFeatures = (req, res) => {
  try {
    Project.findById(req.params.id, (err, doc) => {
      if(err) {
        return res.status(400).json({
          errors: err.message
        })
      }
      doc.features = req.body;
      doc.save((err, results) => {
        if(err) {
          return res.status(400).json({
            errors: err.message
          })
        }else {
          return res.status(200).json({
            success: results
          })
        }
      })
    })
  }catch(err) {
    return res.status(400).json({
      errors: err.message
    })
  }
}