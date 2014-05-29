'use strict';

var utils = require('../utils');
var expect = require('chai').expect;
var request = require('supertest');
var app = require('../../app/app');
var mongoose = require('mongoose');
var Tactics = mongoose.model('Tactics');

describe('Controller: tactics', function () {
    describe('POST /tactics', function () {
        var tactics;

        beforeEach(function () {
            tactics = utils.createTactics();
        });

        it('should create tactics', function (done) {
            request(app)
                .post('/api/tactics')
                .send(tactics)
                .expect('Content-Type', /json/)
                .expect('Location', /api\/tactics\//)
                .expect(201)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('football');
                    expect(res.body.players).to.have.length(tactics.players.length);
                    expect(res.body.pencils).to.have.length(tactics.pencils.length);
                    done();
                });
        });

        it('should not create tactics', function (done) {
            tactics.players.splice(0, 1);
            request(app)
                .post('/api/tactics')
                .send(tactics)
                .expect(400, done);
        });
    });

    describe('GET /tactics/:id', function () {
        var tactics;

        before(function (done) {
            tactics = new Tactics(utils.createTactics());
            tactics.save(done);
        });

        it('should find tactics', function (done) {
            request(app)
                .get('/api/tactics/' + tactics.id)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        throw err;
                    }
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('football');
                    expect(res.body.players).to.have.length(tactics.players.length);
                    expect(res.body.pencils).to.have.length(tactics.pencils.length);
                    done();
                });
        });

        it('should not find tactics', function (done) {
            request(app)
                .get('/api/tactics/666')
                .expect(404, done);
        });
    });
});
