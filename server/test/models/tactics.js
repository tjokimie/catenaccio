const { expect } = require('chai');
const mongoose = require('mongoose');
const config = require('../../app/config');
const utils = require('../utils');
require('../../app/models/tactics')();

describe('Model: Tactics', () => {
  let connection, Tactics;

  before(done => {
    connection = mongoose.createConnection(config.db);
    connection.once('open', () => {
      Tactics = connection.model('Tactics');
      done();
    });
  });

  after(done => {
    connection.close(done);
  });

  it('should save tactics', done => {
    const tactics = new Tactics(utils.createTactics());
    tactics.save((err, data) => {
      if (err) {
        throw err;
      }
      expect(data.id).to.have.length.above(6);
      done();
    });
  });

  it('should not save empty tactics', done => {
    const tactics = new Tactics({});
    tactics.save(err => {
      expect(err).to.have.property('errors');
      done();
    });
  });

  it('should get public fields', () => {
    const tacticsData = utils.createTactics();
    const tactics = new Tactics(tacticsData);
    let publicTactics = tactics.getPublicFields();
    delete publicTactics.id;
    expect(publicTactics).to.deep.equal(tacticsData);
  });

  describe('football', () => {
    let tacticsData;

    beforeEach(() => {
      tacticsData = utils.createTactics();
    });

    it('should require coordinates', done => {
      delete tacticsData.football.x;
      delete tacticsData.football.y;
      delete tacticsData.football.z;
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors['football.x'].kind).to.equal('required');
        expect(err.errors['football.y'].kind).to.equal('required');
        expect(err.errors['football.z'].kind).to.equal('required');
        done();
      });
    });
  });

  describe('players', () => {
    let tacticsData;

    beforeEach(() => {
      tacticsData = utils.createTactics();
    });

    it('should require players', done => {
      delete tacticsData.players;
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors.players.message).to.equal('invalid number of players');
        done();
      });
    });

    it('should require coordinates', done => {
      delete tacticsData.players[0].x;
      delete tacticsData.players[0].y;
      delete tacticsData.players[0].z;
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors['players.0.x'].kind).to.equal('required');
        expect(err.errors['players.0.y'].kind).to.equal('required');
        expect(err.errors['players.0.z'].kind).to.equal('required');
        done();
      });
    });

    it('should require player fields', done => {
      delete tacticsData.players[1].number;
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors['players.1.number'].kind).to.equal('required');
        done();
      });
    });

    it('should validate number of players', done => {
      tacticsData.players.splice(0, 1);
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors.players.message).to.equal('invalid number of players');
        done();
      });
    });

    it('should validate number of goalkeepers', done => {
      tacticsData.players[1].type = 'goalkeeper';
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors.players.message).to.equal('invalid number of goalkeepers');
        done();
      });
    });

    it('should validate number of players in teams', done => {
      tacticsData.players[0].team = 'away';
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors.players.message).to.equal('invalid number of players in teams');
        done();
      });
    });

    it('should validate player number min', done => {
      tacticsData.players[0].number = 0;
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors['players.0.number'].kind).to.equal('min');
        done();
      });
    });

    it('should validate player number max', done => {
      tacticsData.players[0].number = 12;
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors['players.0.number'].kind).to.equal('max');
        done();
      });
    });

    it('should validate player type', done => {
      tacticsData.players[1].type = 'referee';
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors['players.1.type'].kind).to.equal('enum');
        done();
      });
    });
  });

  describe('pencils', () => {
    let tacticsData;

    beforeEach(() => {
      tacticsData = utils.createTactics();
    });

    it('should accept empty array', done => {
      tacticsData.pencils = [];
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err).not.to.exist;
        done();
      });
    });

    it('should require coordinates', done => {
      delete tacticsData.pencils[0].x;
      delete tacticsData.pencils[0].y;
      delete tacticsData.pencils[0].z;
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors['pencils.0.x'].kind).to.equal('required');
        expect(err.errors['pencils.0.y'].kind).to.equal('required');
        expect(err.errors['pencils.0.z'].kind).to.equal('required');
        done();
      });
    });

    it('should require points', done => {
      delete tacticsData.pencils[0].points;
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors['pencils.0.points'].kind).to.equal('required');
        done();
      });
    });

    it('should validate points length', done => {
      tacticsData.pencils[0].points.splice(0, 1);
      const tactics = new Tactics(tacticsData);
      tactics.save(err => {
        expect(err.errors['pencils.0.points'].message).to.equal('invalid points length');
        done();
      });
    });
  });
});