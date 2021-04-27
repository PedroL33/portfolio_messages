var express = require('express');
var router = express.Router();
var projectController = require('../controllers/projectsController');
var auth = require('../controllers/auth.js'); 

router.get('/all', projectController.getProjects);

router.post('/new', auth.checkAuth, projectController.addProject);

router.post('/delete', auth.checkAuth, projectController.deleteProjects);

router.post('/thumbnail/:id', auth.checkAuth, projectController.uploadThumbnail);

router.post('/modal/:id', auth.checkAuth, projectController.uploadModal);

module.exports = router;