var express = require('express');
var cookieParser = require('cookie-parser');
require('dotenv').config();

var cors = require('cors');
var app = express();

var indexRouter = require('./routes/index');
var projectsRouter = require('./routes/projects');
app.use(cors());

var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/project', projectsRouter);
app.listen(port);