var config = require('./protractor-shared.conf').config;

config.capabilities = {
    browserName: 'phantomjs'
};

exports.config = config;
