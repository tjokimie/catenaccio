const request = require('supertest');
const app = require('../../app/app');

describe('Router: report-violation', () => {
  describe('POST /report-violation', () => {
    it('should respond with No Content', done => {
      request(app)
        .post('/report-violation', {})
        .expect(204, done);
    });
  });
});
