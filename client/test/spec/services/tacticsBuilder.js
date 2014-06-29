describe('Service: tacticsBuilder', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var tacticsBuilder, Tactics;

    /* jshint camelcase: false */
    beforeEach(inject(function (_tacticsBuilder_, _Tactics_) {
        tacticsBuilder = _tacticsBuilder_;
        Tactics = _Tactics_;
    }));
    /* jshint camelcase: true */

    describe('football', function () {
        var layer;

        beforeEach(function () {
            var tactics = new Tactics();
            spyOn(Tactics.prototype, 'getFootball').andCallThrough();
            layer = tacticsBuilder.newLayer().setTactics(tactics).addFootball().build();
        });

        it('should have football', function () {
            expect(layer.getChildren().length).toBe(1);
            expect(layer.getChildren()[0].getClassName()).toBe('Circle');
        });

        it('should get position', function () {
            expect(Tactics.prototype.getFootball).toHaveBeenCalled();
        });
    });

    describe('home players', function () {
        var layer;

        beforeEach(function () {
            var tactics = new Tactics();
            spyOn(Tactics.prototype, 'getHomeGoalkeeper').andCallThrough();
            spyOn(Tactics.prototype, 'getHomePlayer').andCallThrough();
            layer = tacticsBuilder.newLayer().setTactics(tactics).addHomeGoalkeeper().addHomePlayers().build();
        });

        it('should have full team', function () {
            expect(layer.getChildren().length).toBe(11);
        });

        it('should have numbers from one to eleven', function () {
            var players = layer.getChildren().toArray();
            expectToHaveNumbersFromOneToEleven(players);
        });

        it('should get position for goalkeeper', function () {
            expect(Tactics.prototype.getHomeGoalkeeper).toHaveBeenCalled();
        });

        it('should get position for players', function () {
            var args = getArgsForCalls(Tactics.prototype.getHomePlayer.calls);
            expect(Tactics.prototype.getHomePlayer.calls.length).toBe(10);
            expect(args).toEqual(_.range(2, 12));
        });
    });

    describe('away players', function () {
        var layer;

        beforeEach(function () {
            var tactics = new Tactics();
            spyOn(Tactics.prototype, 'getAwayGoalkeeper').andCallThrough();
            spyOn(Tactics.prototype, 'getAwayPlayer').andCallThrough();
            layer = tacticsBuilder.newLayer().setTactics(tactics).addAwayGoalkeeper().addAwayPlayers().build();
        });

        it('should have full team', function () {
            expect(layer.getChildren().length).toBe(11);
        });

        it('should have numbers from one to eleven', function () {
            var players = layer.getChildren().toArray();
            expectToHaveNumbersFromOneToEleven(players);
        });

        it('should get position', function () {
            expect(Tactics.prototype.getAwayGoalkeeper).toHaveBeenCalled();
        });

        it('should get position for players', function () {
            var args = getArgsForCalls(Tactics.prototype.getAwayPlayer.calls);
            expect(Tactics.prototype.getAwayPlayer.calls.length).toBe(10);
            expect(args).toEqual(_.range(2, 12));
        });
    });

    describe('pencils', function () {
        var layer;

        beforeEach(function () {
            var tactics = new Tactics();
            spyOn(Tactics.prototype, 'getPencils').andReturn([
                { points: [1, 2, 3, 4], z: 0 },
                { points: [1, 2], z: 0 }
            ]);
            layer = tacticsBuilder.newLayer().setTactics(tactics).addPencils().build();
        });

        it('should have pencils', function () {
            expect(layer.getChildren().length).toBe(2);
            expect(Tactics.prototype.getPencils).toHaveBeenCalled();
        });

        it('should have points', function () {
            expect(layer.getChildren()[0].getPoints()).toEqual([1, 2, 3, 4]);
            expect(layer.getChildren()[1].getPoints()).toEqual([1, 2]);
        });
    });

    function expectToHaveNumbersFromOneToEleven(players) {
        expect(players.length).toBe(11);
        _(players)
            .map(function (player) {
                var numberText = player.find('Text')[0].getText();
                return parseInt(numberText, 10);
            })
            .sort(function (a, b) {
                return a - b;
            })
            .each(function (number, i, numbers) {
                if (i !== 0) {
                    expect(number).toBe(numbers[i - 1] + 1);
                }
            });
    }

    function getArgsForCalls(calls) {
        return _(calls)
            .map(function (call) {
                return call.args;
            })
            .flatten().value();
    }
});
