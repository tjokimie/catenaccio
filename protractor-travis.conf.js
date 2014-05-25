var config = require('./protractor-shared.conf').config;

config.allScriptsTimeout = 30000;

config.capabilities = {
    browserName: 'phantomjs'
};

exports.config = config;
