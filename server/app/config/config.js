'use strict';

module.exports = (function () {
    switch (process.env.NODE_ENV) {
    case 'development':
        return {
            db: 'mongodb://localhost/test',
            public: 'client/app/'
        };
    case 'production':
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