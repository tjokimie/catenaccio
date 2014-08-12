var config = require('./protractor-shared.conf').config;

config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;

config.allScriptsTimeout = 60000;

config.multiCapabilities = [
    {
        browserName: 'chrome',
        platform: 'Windows 8.1',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        name: 'Catenaccio with Chrome'
    },
    {
        browserName: 'firefox',
        platform: 'Windows 8.1',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        name: 'Catenaccio with Firefox'
    },
    {
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        name: 'Catenaccio with IE 11'
    },
    {
        browserName: 'safari',
        version: '7',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        build: process.env.TRAVIS_BUILD_NUMBER,
        name: 'Catenaccio with Safari'
    }
];

exports.config = config;
