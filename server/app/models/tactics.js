const _ = require('lodash');
const mongoose = require('mongoose');
const shortid = require('shortid');

const { Schema } = mongoose;

const CoordinatesType = {
  x: {
    type: Number,
    required: true
  },
  y: {
    type: Number,
    required: true
  },
  z: {
    type: Number,
    required: true
  }
};

const PlayerSchema = new Schema(Object.assign({
  number: {
    type: Number,
    required: true,
    min: 1,
    max: 11
  },
  team: {
    type: String,
    required: true,
    enum: ['home', 'away']
  },
  type: {
    type: String,
    required: true,
    enum: ['field', 'goalkeeper']
  }
}, CoordinatesType));

const PencilSchema = new Schema(Object.assign({
  points: {
    type: [Number],
    required: true,
    validate: [evenLengthPoints, 'invalid points length']
  }
}, CoordinatesType));

const TacticsSchema = new Schema({
  _id: {
    type: String,
    unique: true,
    required: true,
    default: shortid.generate
  },
  football: CoordinatesType,
  players: {
    type: [PlayerSchema],
    validate: [
      { validator: validNumberOfPlayers, msg: 'invalid number of players' },
      { validator: validNumberOfGoalkeepers, msg: 'invalid number of goalkeepers' },
      { validator: evenPlayersInTeams, msg: 'invalid number of players in teams' }
    ]
  },
  pencils: [PencilSchema],
  created: {
    type: Date,
    default: Date.now
  }
});

TacticsSchema.methods.getPublicFields = function () {
  return {
    id: this._id,
    football: {
      x: this.football.x,
      y: this.football.y,
      z: this.football.z
    },
    players: this.players.map(player => ({
      x: player.x,
      y: player.y,
      z: player.z,
      number: player.number,
      team: player.team,
      type: player.type
    })),
    pencils: this.pencils.map(pencil => ({
      points: pencil.points.map(point => point),
      x: pencil.x,
      y: pencil.y,
      z: pencil.z
    }))
  };
};

TacticsSchema.index({ _id: 1 });
TacticsSchema.set('autoIndex', false);

module.exports = mongoose.model('Tactics', TacticsSchema);

function validNumberOfPlayers(players) {
  return players.length === 22;
}

function validNumberOfGoalkeepers(players) {
  return _(players).filter({ type: 'goalkeeper' }).value().length === 2;
}

function evenPlayersInTeams(players) {
  return _(players).filter({ team: 'home' }).value().length === _(players).filter({ team: 'away' }).value().length;
}

function evenLengthPoints(array) {
  return !array || array.length % 2 === 0;
}
