'use strict';

var tactics = require('../controllers/tactics');
var index = require('../controllers/index');

module.exports = function (app) {
    app.post('/api/tactics', tactics.create);
    app.get('/api/tactics/:id', tactics.findOne);
    app.use('/', index.index);
};