'use strict';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');
var fs = require('fs');
var path = require('path');
var app = module.exports = express();


mongoose.connect(config.db);

requireModels(fs);

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, '../../' + config.public)));
app.use(app.router);

// bootstrap routes
require('./config/routes')(app);

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
    app.use(express.errorHandler());
});

function requireModels(fs) {
    fs.readdirSync(path.join(__dirname, './models')).forEach(function(file) {
        require('./models/' + file);
    });
}
