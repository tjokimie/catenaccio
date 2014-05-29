'use strict';

module.exports = (function () {
    switch (process.env.NODE_ENV) {
    case 'production':
        return {
            db: 'mongodb://localhost/test',
            public: 'build/'
        };
    case 'travis':
        return {
            db: 'mongodb://localhost/test',
            public: 'build/'
        };
    default:
        return {
            db: 'mongodb://localhost/test',
            public: 'client/app/'
        };
    }
}());
