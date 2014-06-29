'use strict';

require('newrelic');

var app = require('./app/app');

module.exports = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
