'use strict';

var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var compress = require('compression');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var errorHandler = require('errorhandler');
var config = require('./config/config');
var fs = require('fs');
var path = require('path');
var app = module.exports = express();


mongoose.connect(config.db);

requireModels(fs);

app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(compress());
app.use(methodOverride());
app.use(bodyParser());
app.use(serveStatic(path.join(__dirname, '../../' + config.public)));

// bootstrap routes
require('./config/routes')(app);

if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
    app.use(errorHandler());
}

function requireModels(fs) {
    fs.readdirSync(path.join(__dirname, './models')).forEach(function (file) {
        require('./models/' + file);
    });
}
