'use strict';

module.exports = (function () {
    var csp = {
        'default-src': '\'none\'',
        'connect-src': '\'self\'',
        'font-src': ['\'self\''],
        'img-src': ['\'self\'', 'data:'],
        'script-src': ['\'self\'', '\'unsafe-eval\'', '\'unsafe-inline\'', 'ajax.googleapis.com', 'www.google-analytics.com'],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'netdna.bootstrapcdn.com'],
        sandbox: ['allow-forms', 'allow-same-origin', 'allow-scripts'],
        'report-uri': ['/report-violation'],
        reportOnly: false,
        setAllHeaders: false,
        safari5: false
    };

    switch (process.env.NODE_ENV) {
    case 'production':
        return {
            csp: csp,
            db: 'mongodb://localhost/test',
            public: 'build/',
            brute: {}
        };
    case 'travis':
        return {
            csp: {}, // PhantomJS has issues with CSP
            db: 'mongodb://localhost/test',
            public: 'build/',
            brute: { freeRetries: 99 }
        };
    default:
        return {
            csp: csp,
            db: 'mongodb://localhost/test',
            public: 'client/app/',
            brute: { freeRetries: 99 }
        };
    }
}());
