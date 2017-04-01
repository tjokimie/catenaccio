const mongoose = require('mongoose');
const request = require('supertest');
const { expect } = require('chai');
const app = require('../../app/app');
const Tactics = require('../../app/models/Tactics');
const utils = require('../utils');

describe('Route: tactics', () => {
  describe('POST /tactics', () => {
    let tactics;

    beforeEach(() => {
      tactics = utils.createTactics();
    });

    it('should create tactics', done => {
      request(app)
        .post('/api/tactics')
        .send(tactics)
        .expect('Content-Type', /json/)
        .expect('Location', /api\/tactics\//)
        .expect(201)
        .end((err, res) => {
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

    it('should not create tactics', done => {
      tactics.players.splice(0, 1);
      request(app)
        .post('/api/tactics')
        .send(tactics)
        .expect(400, done);
    });
  });

  describe('GET /tactics/:id', () => {
    let tactics;

    before(done => {
      tactics = new Tactics(utils.createTactics());
      tactics.save(done);
    });

    it('should find tactics', done => {
      request(app)
        .get(`/api/tactics/${tactics.id}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
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

    it('should not find tactics', done => {
      request(app)
        .get('/api/tactics/666')
        .expect(404, done);
    });
  });
});
