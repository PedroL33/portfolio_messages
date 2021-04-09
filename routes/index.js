var express = require('express');
var router = express.Router();
var messageController = require('../controllers/messagesController');
var userController = require('../controllers/usersController');

/* GET home page. */
router.get('/', function(req, res) {
  res.json({msg: "Welcome"})
});

router.post('/login', userController.login)

router.post('/create', userController.createUser)

router.post('/newMessage', messageController.getMessages)

module.exports = router;
