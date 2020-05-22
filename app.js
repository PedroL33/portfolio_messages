var express = require('express');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');

var app = express();
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
app.listen(port);
module.exports = app;
