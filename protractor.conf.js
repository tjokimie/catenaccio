var config = require('./protractor-shared.conf').config;

config.chromeOnly = true;

config.capabilities = {
    browserName: 'chrome'
};

exports.config = config;
