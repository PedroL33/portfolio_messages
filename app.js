var express = require('express');
var cookieParser = require('cookie-parser');

var indexRouter = require('./routes/index');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.listen(3000);
module.exports = app;
