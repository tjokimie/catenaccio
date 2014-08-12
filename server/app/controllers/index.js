'use strict';

var path = require('path');
var config = require('../config/config');

var root = path.resolve(__dirname + '/../../../');

exports.index = function (req, res) {
    res.sendFile('./' + config.public + 'index.html', { root: root });
};
