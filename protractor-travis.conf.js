var config = require('./protractor-shared.conf').config;

config.allScriptsTimeout = 30000;
config.seleniumArgs = [ '-browserTimeout=60' ];

config.capabilities = {
    browserName: 'phantomjs',
    'phantomjs.binary.path': './node_modules/karma-phantomjs-launcher/node_modules/phantomjs/bin/phantomjs'
};

exports.config = config;
