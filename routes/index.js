var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var { check, validationResult } = require('express-validator');

/* GET home page. */
router.get('/', function(req, res) {
  res.json({msg: "Welcome"})
});

router.post('/', [
  check('email').isEmail().withMessage("Invalid email."),
  (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        })
    }
    var message = new Message({
      message: req.body.message,
      email: req.body.email
    })
    message.save((err, result) => {
      if(err) {
        return res.status(400).json({
          message: "Something went wrong."
        })
      }else {
        return res.status(200).json({
          message: "Message recieved."
        })
      }
    })
  } 
])

module.exports = router;
