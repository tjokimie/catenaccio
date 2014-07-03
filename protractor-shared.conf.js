exports.config = {
    baseUrl: 'http://localhost:8000',

    specs: [ 'client/test/e2e/**/*.js' ],

    jasmineNodeOpts: {
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 60000
    }
};
