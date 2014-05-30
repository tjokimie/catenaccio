'use strict';

exports.createTactics = function () {
    return {
        football: {
            x: 62.5,
            y: 44,
            z: 0
        },
        players: createPlayers('home').concat(createPlayers('away')),
        pencils: [
            { points: [44, 0, 44, 1], x: 0, y: 0, z: 12 },
            { points: [0, 62.5], x: 0, y: 0, z: 13 }
        ]
    };
};

function createPlayers(team) {
    var players = [];
    for (var i = 1; i <= 11; i++) {
        players.push({
            x: 0,
            y: 0,
            z: i,
            number: i,
            team: team,
            type: i === 1 ? 'goalkeeper' : 'field'
        });
    }
    return players;
}
