exports.config = {

    // Spec patterns are relative to the location of this config.
    specs: [
        'client/test/e2e/**/*.js'
    ],

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {'args': ['--disable-extensions']}
    },

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: 'http://localhost:8000',

    jasmineNodeOpts: {
        onComplete: null,
        isVerbose: false,
        showColors: true,
        includeStackTrace: true,
        defaultTimeoutInterval: 10000
    }
};
