const request = require('supertest');
const app = require('../../app/app');

describe('Route: index-file', () => {
  describe('GET /', () => {
    it('should show index', done => {
      request(app)
        .get('/')
        .expect('Content-Type', /text\/html/)
        .expect(200, done);
    });
  });

  describe('GET /:id', () => {
    it('should show index', done => {
      request(app)
        .get('/foobar')
        .expect('Content-Type', /text\/html/)
        .expect(200, done);
    });
  });
});
