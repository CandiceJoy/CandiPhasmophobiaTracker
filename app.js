"use strict";
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const phasmoRouter = require('./routes/phasmo.js');
const logger = require('morgan');
const app = express();
console.log("Node WWW Server Start");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/*
To add sites
------------
Put site statics in public/sitename
Put views in views/sitename
Create a router in routes (based off phasmo.js)
Add const sitenameRouter = require("./routes/sitename"); at the top of this file
Add an app.use statement below, using app.use(/^\/sitename\/?$/,sitenameRouter);
Lastly, add a location to /etc/nginx/sites-available/default in the following format (yes, node.conf works for all apps served by this app)
  location ^~ /sitename {
    include node.conf;
  }
*/

const dir = path.join(__dirname, "public");
console.log(dir);

app.use(express.static(dir));
app.use(/^\/phasmo\/?$/, phasmoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
