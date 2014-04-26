'use strict';

// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: 'client',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'app/bower_components/jquery/dist/jquery.js',
            'app/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            'app/bower_components/kineticjs/kinetic.js',
            'app/bower_components/lodash/dist/lodash.compat.js',
            'app/bower_components/angular/angular.js',
            'app/bower_components/angular-mocks/angular-mocks.js',
            'app/bower_components/angular-resource/angular-resource.js',
            'app/bower_components/angular-route/angular-route.js',
            'app/bower_components/angular-bootstrap/dist/ui-bootstrap-custom-tpls-0.10.0.js',
            'app/bower_components/angular-translate/angular-translate.js',
            'app/bower_components/angular-safe-apply/index.js',
            'app/scripts/**/*.js',
            'app/views/**/*.html',
            'test/spec/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // generate js files from html templates
        preprocessors: {
            'app/views/**/*.html': 'ng-html2js'
        },

        ngHtml2JsPreprocessor: {
            // strip this from the file path
            stripPrefix: 'app/'
        },

        // web server port
        port: 8080,

        // use dolts reporter, as travis terminal does not support escaping sequences
        // possible values: 'dots', 'progress', 'junit', 'teamcity'
        // CLI --reporters progress
        reporters: ['dots'],

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
