'use strict';

var tactics = require('../controllers/tactics');
var logger = require('../controllers/logger');
var index = require('../controllers/index');

module.exports = function (app) {
    app.post('/api/tactics', tactics.create);
    app.get('/api/tactics/:id', tactics.findOne);
    app.post('/report-violation', logger.log);
    app.use('/', index.index);
};
