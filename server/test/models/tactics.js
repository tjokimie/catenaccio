'use strict';

require('../../app/models/tactics')();
var utils = require('../utils');
var expect = require('chai').expect;
var mongoose = require('mongoose');
var config = require('../../app/config/config');

describe('Model: Tactics', function() {
    var connection, Tactics;

    before(function(done) {
        connection = mongoose.createConnection(config.db);
        connection.once('open', function () {
            Tactics = connection.model('Tactics');
            done();
        });
    });

    after(function (done) {
        connection.close(function () {
            done();
        });
    });

    it('should save tactics', function(done) {
        var tactics = new Tactics(utils.createTactics());
        tactics.save(function (err, data) {
            if (err) {
                throw err;
            }
            expect(data.id).to.have.length.above(6);
            done();
        });
    });

    it('should not save empty tactics', function(done) {
        var tactics = new Tactics({});
        tactics.save(function (err) {
            expect(err).to.have.property('errors');
            done();
        });
    });

    it('should get public fields', function() {
        var tacticsData = utils.createTactics();
        var tactics = new Tactics(tacticsData);
        var publicTactics = tactics.getPublicFields();
        delete publicTactics.id;
        expect(publicTactics).to.deep.equal(tacticsData);
    });

    describe('football', function () {
        var tacticsData;

        beforeEach(function () {
            tacticsData = utils.createTactics();
        });

        it('should require coordinates', function (done) {
            delete tacticsData.football.x;
            delete tacticsData.football.y;
            delete tacticsData.football.z;
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors['football.x'].type).to.equal('required');
                expect(err.errors['football.y'].type).to.equal('required');
                expect(err.errors['football.z'].type).to.equal('required');
                done();
            });
        });
    });

    describe('players', function () {
        var tacticsData;

        beforeEach(function () {
            tacticsData = utils.createTactics();
        });

        it('should require players', function (done) {
            delete tacticsData.players;
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors.players.type).to.equal('user defined');
                done();
            });
        });

        it('should require coordinates', function (done) {
            delete tacticsData.players[0].x;
            delete tacticsData.players[0].y;
            delete tacticsData.players[0].z;
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors['players.0.x'].type).to.equal('required');
                expect(err.errors['players.0.y'].type).to.equal('required');
                expect(err.errors['players.0.z'].type).to.equal('required');
                done();
            });
        });

        it('should require player fields', function (done) {
            delete tacticsData.players[0].number;
            delete tacticsData.players[0].team;
            delete tacticsData.players[0].type;
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors['players.0.number'].type).to.equal('required');
                expect(err.errors['players.0.team'].type).to.equal('required');
                expect(err.errors['players.0.type'].type).to.equal('required');
                done();
            });
        });

        it('should validate number of players', function (done) {
            tacticsData.players.splice(0, 1);
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors.players.type).to.equal('user defined');
                done();
            });
        });

        it('should validate number of goalkeepers', function (done) {
            tacticsData.players[1].type = 'goalkeeper';
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors.players.type).to.equal('user defined');
                done();
            });
        });

        it('should validate number of players in teams', function (done) {
            tacticsData.players[0].team = 'away';
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors.players.type).to.equal('user defined');
                done();
            });
        });

        it('should validate player number min', function (done) {
            tacticsData.players[0].number = 0;
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors['players.0.number'].type).to.equal('min');
                done();
            });
        });

        it('should validate player number max', function (done) {
            tacticsData.players[0].number = 12;
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors['players.0.number'].type).to.equal('max');
                done();
            });
        });

        it('should validate player team', function (done) {
            tacticsData.players[0].team = 'barca';
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors['players.0.team'].type).to.equal('enum');
                done();
            });
        });

        it('should validate player type', function (done) {
            tacticsData.players[0].type = 'referee';
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors['players.0.type'].type).to.equal('enum');
                done();
            });
        });
    });

    describe('pencils', function () {
        var tacticsData;

        beforeEach(function () {
            tacticsData = utils.createTactics();
        });

        it('should accept empty array', function (done) {
            tacticsData.pencils = [];
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err).not.to.exist;
                done();
            });
        });

        it('should require points and z', function (done) {
            delete tacticsData.pencils[0].points;
            delete tacticsData.pencils[0].z;
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors['pencils.0.points'].type).to.equal('required');
                expect(err.errors['pencils.0.z'].type).to.equal('required');
                done();
            });
        });

        it('should validate points length', function (done) {
            tacticsData.pencils[0].points.splice(0, 1);
            var tactics = new Tactics(tacticsData);
            tactics.save(function (err) {
                expect(err.errors['pencils.0.points'].type).to.equal('user defined');
                done();
            });
        });
    });
});