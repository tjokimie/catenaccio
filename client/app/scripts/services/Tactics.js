angular.module('catenaccio.services')
    .factory('Tactics', function ($resource, pitchDimensions, layerService) {
        'use strict';

        var Tactics = $resource('/api/tactics/:id', { id: '@id' });

        Tactics.prototype.getFootball = function () {
            return _.chain(this.football).formatFootballShape().value() || {
                name: 'football',
                x: pitchDimensions.SIDE_LENGTH + pitchDimensions.TOUCHLINE_LENGTH / 2,
                y: pitchDimensions.SIDE_LENGTH + pitchDimensions.GOAL_LINE_LENGTH / 2,
                z: 0
            };
        };

        Tactics.prototype.getHomeGoalkeeper = function () {
            return _.chain(this.players || []).find({ team: 'home', type: 'goalkeeper' })
                .formatPlayerShape().value() || defaultPlayer(1);
        };

        Tactics.prototype.getHomePlayer = function (number) {
            return _.chain(this.players || []).find({ number: number, team: 'home', type: 'field' })
                .formatPlayerShape().value() || defaultPlayer(number);
        };

        Tactics.prototype.getAwayGoalkeeper = function () {
            return _.chain(this.players || []).find({ team: 'away', type: 'goalkeeper' })
                .formatPlayerShape().value() || defaultPlayer(23);
        };

        Tactics.prototype.getAwayPlayer = function (number) {
            return _.chain(this.players || []).find({ number: number, team: 'away', type: 'field' })
                .formatPlayerShape().value() || defaultPlayer(11 + number);
        };

        Tactics.prototype.getPencils = function () {
            return this.pencils;
        };

        Tactics.prototype.fromShapes = function () {
            this.footballFromShapes();
            this.playersFromShapes();
            this.pencilsFromShapes();
        };

        Tactics.prototype.footballFromShapes = function () {
            var circles = layerService.findShapes('.football');
            this.football = _.chain(circles).first().getShapePosition().value();
        };

        Tactics.prototype.playersFromShapes = function () {
            var groups = layerService.findShapes('Group');
            this.players = _(groups).map(shapeToPlayer).value();
        };

        Tactics.prototype.pencilsFromShapes = function () {
            var lines = layerService.findShapes('Line');
            this.pencils = _(lines).map(shapeToPencil).value();
        };

        function defaultPlayer(position) {
            var team = position > 11 ? 'away' : 'home';
            var name = team + '-' + (position === 1 || position === 23 ? 'goalkeeper' : 'field');
            return {
                name: name,
                x: pitchDimensions.SIDE_LENGTH + pitchDimensions.TOUCHLINE_LENGTH / 24 * position,
                y: pitchDimensions.GOAL_LINE_LENGTH + pitchDimensions.SIDE_LENGTH * 3 / 2,
                z: 0
            };
        }

        function shapeToPlayer(shape) {
            var player = _.chain(shape).getShapePosition().value();
            player.number = parseInt(_(shape.find('Text')).first().getText(), 10);
            player.team = _(shape.getName()).contains('home') ? 'home' : 'away';
            player.type = _(shape.getName()).contains('goalkeeper') ? 'goalkeeper' : 'field';
            return player;
        }

        function shapeToPencil(shape) {
            return {
                points: shape.getPoints(),
                z: shape.getZIndex()
            };
        }

        _.mixin({
            formatFootballShape: function (value) {
                if (_.isObject(value)) {
                    return {
                        name: 'football',
                        x: value.x,
                        y: value.y,
                        z: value.z
                    };
                }
            },
            formatPlayerShape: function (value) {
                if (_.isObject(value)) {
                    var name = value.team + '-' + (value.type === 'goalkeeper' ? 'goalkeeper' : 'field');
                    return {
                        name: name,
                        x: value.x,
                        y: value.y,
                        z: value.z
                    };
                }
            },
            getShapePosition: function (shape) {
                var position = shape.getPosition();
                position.z = shape.getZIndex();
                return position;
            }
        });

        return Tactics;
    });

