const _ = require('lodash');

exports.createTactics = () => ({
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
});

function createPlayers(team) {
  return _.range(1, 12).map(number => ({
    x: 0,
    y: 0,
    z: number,
    number,
    team: team,
    type: number === 1 ? 'goalkeeper' : 'field'
  }));
}
