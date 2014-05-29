'use strict';

var config = require('../config/config');

exports.index = function (req, res) {
    res.sendfile('./' + config.public + 'index.html');
};
