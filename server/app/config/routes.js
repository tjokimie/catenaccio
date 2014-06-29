'use strict';

var tactics = require('../controllers/tactics');
var logger = require('../controllers/logger');
var index = require('../controllers/index');
var bruteforce = require('./bruteforce');

module.exports = function (app) {
    app.post('/api/tactics', bruteforce.prevent, tactics.create);
    app.get('/api/tactics/:id', tactics.findOne);
    app.post('/report-violation', bruteforce.prevent, logger.warn);
    app.use('/', index.index);
};
