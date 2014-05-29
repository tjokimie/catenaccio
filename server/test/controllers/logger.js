'use strict';

var request = require('supertest');
var app = require('../../app/app');

describe('Controller: logger', function () {
    describe('POST /report-violation', function () {
        it('should respond with No Content', function (done) {
            request(app)
                .post('/report-violation', {})
                .expect(204, done);
        });
    });
});
