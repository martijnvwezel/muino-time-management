'use strict';
const path = require('path');
const express = require('express');
const httpError = require('http-errors');
var fs = require('fs')
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const helmet = require('helmet');
const routes = require('../routes/index.route');
const config = require('./config');
const passport = require('./passport')
// const redis_client = require('./redis');
const cors = require('cors');

const app = express(); 
// app.use(compression());


if (config.env === 'development' && false) {//disabled
  // create a write stream (in append mode)
  var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
  app.use(logger(':date[clf] :remote-addr :method :url :status :response-time ms :res[content-length] :remote-user', { stream: accessLogStream }));//, { stream: accessLogStream }

} else {
  app.use(logger(':date[clf] :remote-addr :method :url :status :response-time ms :res[content-length] :remote-user'));
}

// Choose what fronten framework to serve the dist from
if ( config.env == 'development') {
  var distDir = '../../../muino-angular/dist/muino';
} else {
  var distDir = '../../dist/muino/';
} 


if(!config.disable_static_serve){
  app.use(express.static(path.join(__dirname, distDir)))
  app.use(/^((?!(api)).)*/, (req, res) => {
    res.sendFile(path.join(__dirname, distDir + '/index.html'));
  });
}


app.use(bodyParser.json({limit: '6mb' })); // profile image limit is 5MB 

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());


// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// getting info of proxy
app.set('trust proxy', true);


app.use(passport.initialize());

// API router
app.use('/api/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new httpError(404)
  return next(err);
});


// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join("; ");
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message
  });
  next(err);
});

module.exports = app;
