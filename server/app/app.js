const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const methodOverride = require('method-override');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const bruteforce = require('./bruteforce');
const tactics = require('./routes/tactics');
const reportViolation = require('./routes/report-violation');
const indexFile = require('./routes/index-file');
const errorHandler = require('./error-handler')

const app = express();

mongoose.connect(config.db);
requireModels(fs);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(compression());
app.use(helmet());
app.use(helmet.contentSecurityPolicy(config.csp));
app.use(methodOverride());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
if (process.env.NODE_ENV === 'production') {
    app.use(morgan());
}

app.use(express.static(path.join(__dirname, `../../${config.public}`)));
app.use('/api/tactics', bruteforce.prevent, tactics);
app.use('/report-violation', bruteforce.prevent, reportViolation);
app.use('/', indexFile);

app.use(errorHandler);

module.exports = app;

function requireModels(fs) {
  fs.readdirSync(path.join(__dirname, './models')).forEach(file => {
    require(`./models/${file}`);
  });
}
