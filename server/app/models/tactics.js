'use strict';

var mongoose = require('mongoose');
var shortid = require('shortid');
var _ = require('lodash-node');

var Schema = mongoose.Schema;

var CoordinatesType = {
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

var PlayerSchema = new Schema(_.extend({}, CoordinatesType, {
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
}));

var PencilSchema = new Schema({
    points: {
        type: [Number],
        required: true,
        validate: [evenLengthPoints, 'invalid points length']
    },
    z: {
        type: Number,
        required: true
    }
});

var TacticsSchema = new Schema({
    id: {
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
        id: this.id,
        football: {
            x: this.football.x,
            y: this.football.y,
            z: this.football.z
        },
        players: this.players.map(function (player) {
            return {
                x: player.x,
                y: player.y,
                z: player.z,
                number: player.number,
                team: player.team,
                type: player.type
            };
        }),
        pencils: this.pencils.map(function (pencil) {
            return {
                points: pencil.points.map(function (point) {
                    return point;
                }),
                z: pencil.z
            };
        })
    };
};

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
