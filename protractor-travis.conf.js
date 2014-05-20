var config = require('./protractor-shared.conf').config;

config.capabilities = {
    'browserName': 'PhantomJS'
};

exports.config = config;
