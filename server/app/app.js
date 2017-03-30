const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const helmet = require('helmet');
const config = require('./config/config');
const fs = require('fs');
const path = require('path');

const app = express();

mongoose.connect(config.db);

requireModels(fs);

securityHeaders(app, helmet);

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../' + config.public)));

require('./config/routes')(app);

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
  app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}
if (process.env.NODE_ENV === 'production') {
	app.use(morgan());
}

module.exports = app;

function requireModels(fs) {
  fs.readdirSync(path.join(__dirname, './models')).forEach(file => {
    require('./models/' + file);
  });
}

function securityHeaders(app, helmet) {
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy(config.csp));
}
