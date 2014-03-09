describe('Service: Tactics', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var layerService, httpBackend, Tactics, tactics;

    beforeEach(module(function ($provide) {
        layerService = jasmine.createSpyObj('layerService', ['findShapes']);
        $provide.value('layerService', layerService);
    }));

    beforeEach(inject(function ($httpBackend, _Tactics_) {
        httpBackend = $httpBackend;
        Tactics = _Tactics_;
        tactics = new Tactics();
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should get players', function () {
        httpBackend.expectGET('/api/tactics/666').respond(200);
        tactics.$get({ id: 666 });
        httpBackend.flush();
    });

    it('should save tactics', function () {
        httpBackend.expectPOST('/api/tactics').respond(201);
        tactics.$save();
        httpBackend.flush();
    });

    describe('football', function () {
        it('should get position', function () {
            tactics.football = { x: 30, y: 20, z: 10 };
            var football = tactics.getFootball();
            expect(football.x).toBe(30);
            expect(football.y).toBe(20);
            expect(football.z).toBe(10);
            expect(football.name).toBe('football');
        });

        it('should get default position', function () {
            var football = tactics.getFootball();
            expect(football.x).toBe(62.5);
            expect(football.y).toBe(44);
            expect(football.z).toBe(0);
            expect(football.name).toBe('football');
        });
    });

    describe('home', function () {
        describe('goalkeeper', function () {
            it('should get position and name', function () {
                tactics.players = createPlayers();
                var player = tactics.getHomeGoalkeeper();
                expect(player.x).toBe(1);
                expect(player.y).toBe(2);
                expect(player.z).toBe(1);
                expect(player.name).toBe('home-goalkeeper');
            });

            it('should get default position and name', function () {
                var player = tactics.getHomeGoalkeeper();
                expect(player.x).toBeLessThan(62.5);
                expect(player.y).toBe(83);
                expect(player.z).toBe(0);
                expect(player.name).toBe('home-goalkeeper');
            });
        });

        describe('player', function () {
            it('should get position and name', function () {
                tactics.players = createPlayers();
                var player = tactics.getHomePlayer(11);
                expect(player.x).toBe(3);
                expect(player.y).toBe(4);
                expect(player.z).toBe(2);
                expect(player.name).toBe('home-field');
            });

            it('should get default position and name', function () {
                var player = tactics.getHomePlayer(11);
                expect(player.x).toBeLessThan(62.5);
                expect(player.y).toBe(83);
                expect(player.z).toBe(0);
                expect(player.name).toBe('home-field');
            });
        });

        describe('team', function () {
            var players;

            beforeEach(function () {
                var players = _.range(2, 12).map(function (number) {
                    return tactics.getHomePlayer(number);
                });
                players.unshift(tactics.getHomeGoalkeeper());
            });

            it('should have same distance from each other', function () {
                expectToHaveEqualDistancesOnX(players);
            });

            it('should be on same line', function () {
                expectToHaveEqualY(players);
            });
        });
    });

    describe('away', function () {
        describe('goalkeeper', function () {
            it('should get position and name', function () {
                tactics.players = createPlayers();
                var player = tactics.getAwayGoalkeeper();
                expect(player.x).toBe(5);
                expect(player.y).toBe(6);
                expect(player.z).toBe(3);
                expect(player.name).toBe('away-goalkeeper');
            });

            it('should get default position and name', function () {
                var player = tactics.getAwayGoalkeeper();
                expect(player.x).toBeGreaterThan(62.5);
                expect(player.y).toBe(83);
                expect(player.z).toBe(0);
                expect(player.name).toBe('away-goalkeeper');
            });
        });

        describe('player', function () {
            it('should get position and name', function () {
                tactics.players = createPlayers();
                var player = tactics.getAwayPlayer(2);
                expect(player.x).toBe(7);
                expect(player.y).toBe(8);
                expect(player.z).toBe(4);
                expect(player.name).toBe('away-field');
            });

            it('should get default position and name', function () {
                var player = tactics.getAwayPlayer(2);
                expect(player.x).toBeGreaterThan(62.5);
                expect(player.y).toBe(83);
                expect(player.z).toBe(0);
                expect(player.name).toBe('away-field');
            });
        });

        describe('team', function () {
            var players;

            beforeEach(function () {
                var players = _.range(2, 12).map(function (number) {
                    return tactics.getAwayPlayer(number);
                });
                players.push(tactics.getAwayGoalkeeper());
            });

            it('should have same distance from each other', function () {
                expectToHaveEqualDistancesOnX(players);
            });

            it('should be on same line', function () {
                expectToHaveEqualY(players);
            });
        });
    });

    it('should get pencils', function () {
        tactics.pencils = createPencils();
        var pencils = tactics.getPencils();
        expect(pencils.length).toBe(2);
        expect(pencils[0].points).toEqual([1, 2, 3, 4]);
        expect(pencils[0].z).toEqual(1);
        expect(pencils[1].points).toEqual([1, 2]);
        expect(pencils[1].z).toEqual(2);
    });

    describe('footballFromShapes', function () {
        beforeEach(function () {
            layerService.findShapes.andReturn([createFootballShape()]);
            tactics.footballFromShapes();
        });

        it('should have only football', function () {
            expect(tactics.football).toBeDefined();
            expect(tactics.players).toBeUndefined();
            expect(tactics.pencils).toBeUndefined();
        });

        it('should have football coordinates', function () {
            expect(tactics.football.x).toBe(66);
            expect(tactics.football.y).toBe(33);
            expect(tactics.football.z).toBe(1);
        });
    });

    describe('playersFromShapes', function () {
        beforeEach(function () {
            layerService.findShapes.andReturn([
                createPlayerShapeWithNameAndNumber('home-goalkeeper', 1),
                createPlayerShapeWithNameAndNumber('home', 10),
                createPlayerShapeWithNameAndNumber('away-goalkeeper', 1),
                createPlayerShapeWithNameAndNumber('away', 3)
            ]);
            tactics.playersFromShapes();
        });

        it('should have only players', function () {
            expect(tactics.football).toBeUndefined();
            expect(tactics.players.length).toBe(4);
            expect(tactics.pencils).toBeUndefined();
        });

        it('should have player coordinates', function () {
            tactics.players.forEach(function (player) {
                expect(player.x).toBe(33);
                expect(player.y).toBe(22);
                expect(player.z).toBe(11);
            });
        });

        it('should have player number', function () {
            expect(tactics.players[0].number).toBe(1);
            expect(tactics.players[1].number).toBe(10);
            expect(tactics.players[2].number).toBe(1);
            expect(tactics.players[3].number).toBe(3);
        });

        it('should have player team', function () {
            expect(tactics.players[0].team).toBe('home');
            expect(tactics.players[1].team).toBe('home');
            expect(tactics.players[2].team).toBe('away');
            expect(tactics.players[3].team).toBe('away');
        });

        it('should have player type', function () {
            expect(tactics.players[0].type).toBe('goalkeeper');
            expect(tactics.players[1].type).toBe('field');
            expect(tactics.players[2].type).toBe('goalkeeper');
            expect(tactics.players[3].type).toBe('field');
        });
    });

    describe('pencilsFromShapes', function () {
        beforeEach(function () {
            layerService.findShapes.andReturn([
                createPencilShapeWithPointsWithZ([1, 2, 3, 4], 1),
                createPencilShapeWithPointsWithZ([20, 10], 2)
            ]);
            tactics.pencilsFromShapes();
        });

        it('should have only pencils', function () {
            expect(tactics.football).toBeUndefined();
            expect(tactics.players).toBeUndefined();
            expect(tactics.pencils.length).toBe(2);
        });

        it('should have points', function () {
            expect(tactics.pencils[0].points).toEqual([1, 2, 3, 4]);
            expect(tactics.pencils[1].points).toEqual([20, 10]);
        });

        it('should have z', function () {
            expect(tactics.pencils[0].z).toEqual(1);
            expect(tactics.pencils[1].z).toEqual(2);
        });
    });

    describe('fromShapes', function () {
        beforeEach(function () {
            tactics = new Tactics();
            spyOn(Tactics.prototype, 'footballFromShapes');
            spyOn(Tactics.prototype, 'playersFromShapes');
            spyOn(Tactics.prototype, 'pencilsFromShapes');
        });

        it('should get shapes', function () {
            tactics.fromShapes();
            expect(Tactics.prototype.footballFromShapes).toHaveBeenCalled();
            expect(Tactics.prototype.playersFromShapes).toHaveBeenCalled();
            expect(Tactics.prototype.pencilsFromShapes).toHaveBeenCalled();
        });
    });

    function createPlayers() {
        return [
            { x: 1, y: 2, z: 1, number: 1, team: 'home', type: 'goalkeeper' },
            { x: 3, y: 4, z: 2, number: 11, team: 'home', type: 'field' },
            { x: 5, y: 6, z: 3, number: 1, team: 'away', type: 'goalkeeper' },
            { x: 7, y: 8, z: 4, number: 2, team: 'away', type: 'field' }
        ];
    }

    function expectToHaveEqualDistancesOnX(players) {
        return _(players)
            .map(function (player) {
                return player.x;
            })
            .reduce(function (accu, number, i, array) {
                if (i !== 0) {
                    accu.push(number - array[i - 1]);
                }
                return accu;
            }, [])
            .forEach(function (number, i, array) {
                if (i !== 0) {
                    expect(array[i - 1] === number);
                }
            });
    }

    function expectToHaveEqualY(players) {
        return _(players)
            .forEach(function (player, i, array) {
                if (i !== 0) {
                    expect(array[i - 1].y === player.y);
                }
            });
    }

    function createPencils() {
        return [
            { points: [1, 2, 3, 4], z: 1 },
            { points: [1, 2], z: 2 }
        ];
    }

    function createFootballShape() {
        var football = new Kinetic.Circle({ name: 'football', x: 66, y: 33 });
        football.index = 1;
        return football;
    }

    function createPlayerShapeWithNameAndNumber(name, number) {
        var group = new Kinetic.Group({ name: name, x: 33, y: 22 });
        group.index = 11;
        var text = new Kinetic.Text({ text: number.toString() });
        return group.add(text);
    }

    function createPencilShapeWithPointsWithZ(points, z) {
        var line = new Kinetic.Line({ points: points });
        line.index = z;
        return line;
    }
});
