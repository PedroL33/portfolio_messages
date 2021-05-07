var Message = require('../models/message');
var { check, validationResult } = require('express-validator');

exports.getMessages = [
  check('email').isEmail().withMessage("Invalid email."),
  check('message').isLength({min: 1}).withMessage("Please include a message."),
  check('name').isLength({min: 1}).withMessage("Please include your name"),
  (req, res) => {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
          return res.status(422).json({
              errors: errors.array()
          })
      }
      var message = new Message({
        message: req.body.message,
        email: req.body.email,
        name: req.body.name
      })
      message.save((err, result) => {
        if(err) {
          return res.status(400).json({
            errors: [{msg: "Something went wrong."}]
          })
        }else {
          return res.status(200).json({
            message: "Thank you for the message. You will hear from me soon!"
          })
        }
      })
    }catch(err) {
      return res.status(400).json({
        errors: [{msg: "Something went wrong."}]
      })
    }
  } 
]