const User = require('../models/user');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.login = (req, res) => {
  try {
    User.find({Username: req.body.username}, (err, results) => {
      if(err) {      
        return res.status(400).json({
          msg: "Something went wrong."
        })
      }else if(!results.length) {
        return res.status(400).json({
          msg: "Authentication failed."
        })
      }else {
        console.log(req.body.password, results[0].Password)
        bcrypt.compare(req.body.password, results[0].Password, function(err, valid) {
          if(err || !valid) {
            res.status(400).json({
              msg: "Authentication failed."
            })
          }else {
            const token = jwt.sign({
              exp: Math.floor(Date.now() / 1000) + (60 * 60),
              data: req.body.username
            }, process.env.JWT_SECRET);
            res.status(200).json({
              msg: "Authentication successful.",
              token: token
            })
          }
        })
      }
    })
  }catch {
    return res.status(400).json({
      msg: "Authentication failed."
    })
  }
}

exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if(err){
      return res.status(400).json({
        msg: "Something went wrong."
      })
    }
    var user = new User({
      Username: req.body.username,
      Password: hash
    })
    user.save((err, result) => {
      if(err) {
        return res.status(400).json({
          msg: "Something went wrong."
        })
      }
      return res.status(200).json({
        msg: `User ${req.body.username} created.`
      })
    })
  })
}