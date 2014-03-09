'use strict';

var request = require('supertest');
var app = require('../../app/app');

describe('Controller: index', function () {
    describe('GET /', function () {
        it('should show index', function (done) {
            request(app)
                .get('/')
                .expect('Content-Type', /text\/html/)
                .expect(200, done);
        });
    });

    describe('GET /:id', function () {
        it('should show index', function (done) {
            request(app)
                .get('/foobar')
                .expect('Content-Type', /text\/html/)
                .expect(200, done);
        });
    });
});