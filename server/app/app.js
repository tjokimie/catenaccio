'use strict';

var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var compress = require('compression');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var errorHandler = require('errorhandler');
var helmet = require('helmet');
var config = require('./config/config');
var fs = require('fs');
var path = require('path');
var app = module.exports = express();


mongoose.connect(config.db);

requireModels(fs);

securityHeaders(app, helmet);

app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(compress());
app.use(methodOverride());
app.use(bodyParser.json());
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

function securityHeaders(app, helmet) {
    app.use(helmet.xframe());
    app.use(helmet.csp(config.csp));
    app.use(helmet.iexss());
    app.use(helmet.hidePoweredBy());
}
